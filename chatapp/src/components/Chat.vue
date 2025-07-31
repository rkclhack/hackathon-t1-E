<script setup>
import { inject, ref, reactive, onMounted, computed, provide } from "vue"
import socketManager from '../socketManager.js'
import { useWebNotification } from '@vueuse/core'

import toJpnTime from "../utils/toJpnTime.js"
import ImportantChat from "./ImportantChat.vue"

// #region global state
const userName = inject("userName")
const isExecutive = inject("isExecutive")
// #endregion

// #region local variable
const socket = socketManager.getInstance()
// #endregion

const { isSupported, show, notification } = useWebNotification({
  title: 'チャット通知',
  dir: 'auto',
  lang: 'ja',
  renotify: true,
  tag: 'chat-message',
})

// #region reactive variable
const chatContent = ref("")
const isImportant = ref(false)
const chatList = reactive([])
const importantChatList = computed(() =>
  chatList.filter((chat) => chat.isImportant === true)
)

function chat(chatContent, isImportant, userName, isExecutive) {
  // TODO: validate
  if (chatContent.trim() === '') {
    alert("メッセージが空です")
    return
  }
  
  return ({
    chatContent: chatContent,
    isImportant: isImportant,
    userName: userName,
    sendAt: new Date(),
    isExecutive: isExecutive
  })
}

provide("chatList", chatList)
// #endregion

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
})
// #endregion

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
   // 幹部以外がチェックしても無効化（信頼できない人間に負けないコード）
  const importantFlag = isExecutive?.value ? isImportant.value : false
  const chatInfo = chat(chatContent.value, importantFlag, userName.value, isExecutive.value);
  socket.emit("publishEvent", chatInfo)
  // 入力欄を初期化
  chatContent.value=""
  isImportant.value = false

}

// #endregion

// #region socket event handler

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  chatList.unshift(data)
  
   // 幹部による重要メッセージだけ通知
  if (
    isSupported &&
    data.userName !== userName.value &&
    data.isExecutive === true &&    // 幹部かどうか
    data.isImportant === true       // 重要かどうか
  ) {
    show({
      title: `【重要】${data.userName} さんのメッセージ`,
      body: data.chatContent,
    })
  }
  
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    onReceivePublish(data)
  })
}
// #endregion
</script>

<template>
  <div class="chat-container">
    <header class="chat-header">
      <h1 class="text-h3 font-weight-medium">バレーボール同好会</h1>
      <p>ユーザ：{{ userName }}さん</p>
      <router-link to="/" class="link">
        <button type="button" class="button-normal button-exit" @click="onExit">退室</button>
      </router-link>
    </header>
    <div class="chat-list"></div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li v-for="(chat, i) in chatList" :key="i">
            <div class="item mt-4">{{ chat.userName }}</div>
            <div class="item mt-4">{{ toJpnTime(chat.sendAt) }}</div>
            <div
              class="item mt-4"
              :class="{ 'executive-message': chat.isExecutive }"
              style="white-space: pre-wrap;"
            >
              {{ chat.chatContent }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="chat-input-area">
      <textarea v-model="chatContent" placeholder="投稿文を入力してください" rows="4" class="chat-input"></textarea>
      <div class="mt-5">
        <v-switch
          v-model="isImportant"
          label="重要"
          :disabled="!isExecutive">
        </v-switch>
        <button @click="onPublish"  class="send-btn">投稿</button>
      </div>

    </div>

</template>

<style scoped>
  .link {
    text-decoration: none;
  }

  .area {
    width: 500px;
    border: 1px solid #000;
    margin-top: 8px;
  }

  .item {
    display: block;
  }

  .util-ml-8px {
    margin-left: 8px;
  }

  .button-exit {
    margin-left: 1.5rem;
    background-color: #e53935;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #ffffff;
  }

  .chat-header {
    display: flex;
    justify-content: flex-start; 
    align-items: center;
    background-color: #ff6600;
    color: #fff;
    border-bottom: 2px solid #c0c0c0;
    padding: 0.8rem 1rem;
  }

  .chat-header h1 {
    margin-right: auto;
  }

  .chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .chat-list li {
    list-style: none;
    display: flex;
    align-items: center;
    background-color: #fff3e0;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    margin-bottom: 0.6rem;
    max-width: 500px; 
  }

  .chat-list li .item {
    display: inline;        
  }

  .chat-list li .item:nth-child(1) { order: 1; font-weight: 600; }
  .chat-list li .item:nth-child(3) { order: 2; flex: 1; }
  .chat-list li .item:nth-child(2) { 
    order: 3; 
    font-size: 0.8rem; 
    color: #666;
    margin-left: auto;
  }

  .chat-input-area {
    display: flex;
    align-items: center;
    background-color: #f2eebf;
    border-top: 1px solid #c0c0c0;
    padding: 0.5rem;
  }

  .chat-input {
    flex: 1;
    height: 2.5rem;
    background-color: #ffffff; 
    border: 1px solid #ff6600;
    border-radius: 4px;
    padding: 0.4rem;
    margin-right: 0.5rem;
  }

  .send-btn {
    background-color: #ff6600;
    border: none;
    color: #fff;
    font-size: 1.1rem;
    border-radius: 4px;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
  }

  .executive-message {
  font-weight: bold;
  color: red;
  }

</style>