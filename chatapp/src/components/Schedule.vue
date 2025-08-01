<script setup>
import { ref, inject, watch, onMounted } from 'vue';
import socketManager from '../socketManager';

const canEdit = ref(false)
const scheduleContent = ref("")
const isExective = inject ("isExecutive")

const socket = socketManager.getInstance()

const onReceiveSchedule = (data) => {
  scheduleContent.value = data;
  console.log(scheduleContent.value)
}

onMounted(() => {
  socket.on("scheduleUpdate", onReceiveSchedule);
  socket.emit("getSchedule");
}) 

//編集の反映
const toggleEdit = () => {
  canEdit.value = !canEdit.value;
  if (!canEdit.value){
    socket.emit("updateSchedule", scheduleContent.value)
  }
}

</script>

<template>
  <div class="schedule-container">
    <h2 class="mt-2">
      スケジュール
    </h2>
    <div v-if="isExective" @click="toggleEdit" class="toggle">{{ canEdit ? '✔︎' : '➕' }}</div>
    <div v-if="!canEdit" class="content">
      {{ scheduleContent }}
    </div>
    <div v-else class="inputarea" :class="{ 'has-border': canEdit }">
      <textarea v-model="scheduleContent" cols="9" rows="17" autofocus></textarea>
    </div>
  </div>
</template>

<style>
.schedule-container {
  position: absolute;
  right: 0;
  top: 78px;
  width: 40%;
  height: calc(100vh - 80px);
  border-left: 1px solid black;
}

h2 {
  margin-left: 20px;
}

.toggle {
  font-weight: bold;
  margin-left: 10px;
  cursor: pointer;
  width: fit-content;
  padding: 5px;
}

.content {
  background-color: #fff2f2;
  height: calc(100% - 88px);
  margin: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.inputarea {
  margin: 10px;
  background-color: #fff2f2;
}

textarea {
  width: 100%;
  outline: none;
}

.has-border {
  border: 1.5px solid #015ECC;
}
</style>
