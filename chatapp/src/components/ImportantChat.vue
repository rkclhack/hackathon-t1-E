<script setup>
import { computed, inject } from "vue"
import toJpnTime from "../utils/toJpnTime"

const chatList = inject("chatList")

const initChatProperty = (chat) => {
  if (chat.isChecked === undefined) {
    chat.isChecked = false
  }
  if (chat.isRead === undefined) {
    chat.isRead = false
  }
  return chat
}

const importantChatList = computed(() => {
  const filtered = chatList.filter((chat) => chat.isImportant === true)
  
  const initChats = filtered.map(initChatProperty)
  
  // 未読項目を上,既読項目を下にソート 同じ既読状態では新しいものを上に
  return initChats.sort((a, b) => {
    const aIsRead = a.isRead
    const bIsRead = b.isRead
    
    // 未読項目を上に表示
    if (!aIsRead && bIsRead) return -1  // 未読のaを上にする
    if (aIsRead && !bIsRead) return 1   // 既読のbを上にする
    
    // 同じ既読状態の場合は新しいものを上にする
    return new Date(b.sendAt) - new Date(a.sendAt)
  })
})

// チェックボックスの切り替え
const toggleCheck = (chat) => {
  initChatProperty(chat)
  chat.isChecked = !chat.isChecked
}

// 既読にする機能
const markAsRead = () => {
  chatList.forEach(chat => {
    if (chat.isImportant && chat.isChecked) {
      initChatProperty(chat)
      chat.isRead = true
      chat.isChecked = false
    }
  })
}

</script>

<template>
  <div class="important-chat-list-box">
    <div class="important-header">
      <h2>重要なお知らせ</h2>
    </div>
    <ul class="mt-5">
      <li 
        v-for="(importantChat, i) in importantChatList" 
        :key="i"
        :class="{ 'read-item': importantChat.isRead }"
      >
        <input 
          type="checkbox" 
          :checked="importantChat.isChecked"
          @change="toggleCheck(importantChat)"
          class="chat-checkbox"
        />
        <div class="item mt-4">{{ toJpnTime(importantChat.sendAt) }}</div>
        <div style="white-space: pre-wrap;" class="item mt-4">{{ importantChat.chatContent }}</div>
      </li>
    </ul>
    <div class="read-button-container mb-4">
      <button @click="markAsRead" class="read-button">既読</button>
    </div>
  </div>

</template>

<style>
/* 既読ボタンのスタイル */
 .read-button-container {
   position: fixed;
   bottom: 20px;
   right: 5%;
   z-index: 100;
   display: flex;
   justify-content: center;
 }

.read-button {
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
}


.important-chat-list-box {
  overflow-y: auto;
  padding: 1rem;
  width: 80%;
  height: 100%;
  margin: 0 auto;
  position: relative;
}

.important-chat-list-box li {
  list-style: none;
  display: flex;
  align-items: center;
  background-color: #ffd5d5;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  margin-bottom: 0.6rem;
  max-width: 500px;
}

/* 既読項目のスタイル */
.important-chat-list-box li.read-item {
  opacity: 0.6;
  background-color: #e0e0e0;
}

.important-chat-list-box li.read-item .item {
  color: #666;
}

/* チェックボックスのスタイル */
.chat-checkbox {
  margin-right: 1rem;
  cursor: pointer;
}

.important-chat-list-box li .item {
  display: inline;
}

/* 時刻表示（2番目の要素） */
.important-chat-list-box li .item:nth-child(2) {
  order: 3;
  font-size: 0.8rem;
  color: #666;
  margin-left: auto;
}

/* チャットコンテンツ（3番目の要素） */
.important-chat-list-box li .item:nth-child(3) {
  order: 2;
  flex: 1;
  font-weight: 600;
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