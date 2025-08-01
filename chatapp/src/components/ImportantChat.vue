<script setup>
import { computed, inject } from "vue"
import toJpnTime from "../utils/toJpnTime"

const chatList = inject("chatList")

const importantChatList = computed(() =>
  chatList.filter((chat) => chat.isImportant === true)
)
</script>

<template>
  <div class="important-header">
    <h2>重要なお知らせ</h2>
  </div>
  <ul class="mt-5">
    <li v-for="(importantChat, i) in importantChatList" :key="i">
      <div style="white-space: pre-wrap;" class="item mt-4">{{ importantChat.chatContent }}</div>
      <div class="item mt-4">{{ toJpnTime(importantChat.sendAt) }}</div>
    </li>
  </ul>
</template>

<style>
.important-chat-list {
  overflow-y: auto;
  /* padding: 1rem; */
  width: 60%;
}

.important-chat-list li {
  list-style: none;
  display: flex;
  align-items: center;
  background-color: #ffd5d5;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  margin-bottom: 0.6rem;
  max-width: 500px;
}

.important-chat-list li .item {
  display: inline;
}

.important-chat-list li .item:nth-child(1) {
  order: 1;
  font-weight: 600;
}

.important-chat-list li .item:nth-child(3) {
  order: 2;
  flex: 1;
}

.important-chat-list li .item:nth-child(2) {
  order: 3;
  font-size: 0.8rem;
  color: #666;
  margin-left: auto;
}

.important-header {
  background-color: #d32f2f;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 4px 4px 0 0;
  position: sticky;
  top: 0;
  z-index: 5;
  flex: 0 0 auto;
}
</style>