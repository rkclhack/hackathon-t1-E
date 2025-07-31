<script setup>
import { inject } from 'vue';

const modes = ["重要事項", "スケジュール"]
const mode = inject("mode")

</script>

<template>
  <div class="dropdown">
    <v-select v-model="mode" :items="modes" label="表示モード" variant="solo"></v-select>
  </div>
</template>

<style>
.dropdown {
  position: absolute;
  top: 90px;
  right: 10px;
  z-index: 10;
}

/* .selector {
  
} */
</style>