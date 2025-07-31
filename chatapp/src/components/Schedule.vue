<script setup>
import { ref } from 'vue';

const canEdit = ref(false)
const scheduleContent = ref("")
</script>

<template>
  <h2>
    スケジュール
  </h2>
  <div @click="canEdit = !canEdit" class="toggle">{{ canEdit ? '✔︎' : '+'}}</div>
  <div v-if="!canEdit">
    {{ scheduleContent }}
  </div>
  <div v-else class="inputarea">
    <input type="text" v-model="scheduleContent">
  </div>
</template>

<style>
  
</style>