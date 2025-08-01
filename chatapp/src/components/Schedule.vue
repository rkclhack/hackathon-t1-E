<script setup>
import { ref } from 'vue';

const canEdit = ref(false)
const scheduleContent = ref("")
</script>

<template>
  <div class="schedule-container">
    <div class="schedule-header">
      <h2>スケジュール</h2>
      <div class="toggle" @click="canEdit = !canEdit">
        {{ canEdit ? '完了' : '編集' }}
      </div>
    </div>

    <div class="schedule-body">
      <div v-if="!canEdit" class="content">
        {{ scheduleContent }}
      </div>
      <div v-else class="inputarea" :class="{ 'has-border': canEdit }">
        <textarea v-model="scheduleContent" cols="9" rows="17" autofocus></textarea>
      </div>
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
  display: flex;
  flex-direction: column;
}

.schedule-header {
  background-color: #d32f2f;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
  position: sticky;
  top: 0;
  z-index: 5;
}

.schedule-header h2 {
  margin: 0;
  flex: none;
  font-size: 1.5rem;
}

.toggle {
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  user-select: none;
}

.schedule-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fff2f2;
}

.content {
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 100%;
}

.inputarea {
  background-color: #fff2f2;
}

textarea {
  width: 100%;
  outline: none;
  resize: vertical;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 1rem;
  padding: 0.5rem;
  box-sizing: border-box;
}

.has-border {
  border: 1.5px solid #015ECC;
  border-radius: 4px;
}
</style>
