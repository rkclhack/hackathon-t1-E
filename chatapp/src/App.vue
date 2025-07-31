<script setup>
import { computed, provide, ref } from "vue"

// #region reactive state
const userName = ref("")
const userRole = ref("general")
const isExecutive = computed(() => userRole.value === "executive")
// #endregion

// #region global variable
provide("userName", userName)
provide("userRole", userRole)
provide("isExecutive", isExecutive)
// #endregion
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
