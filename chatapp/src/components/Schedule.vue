<script setup>
import { ref } from 'vue';

const canEdit = ref(false)
const scheduleContent = ref("")
</script>

<template>
  <div class="schedule-container">
    <h2 class="mt-2">
      スケジュール
    </h2>
    <div @click="canEdit = !canEdit" class="toggle">{{ canEdit ? '✔︎' : '➕' }}</div>
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
