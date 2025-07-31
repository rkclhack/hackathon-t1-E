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
const memoList = ref([])
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
  const chatInfo = chat(chatContent.value, isImportant.value, userName.value, isExecutive.value);
  socket.emit("publishEvent", chatInfo)
  // 入力欄を初期化
  chatContent.value=""

}

// #endregion

// #region socket event handler

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  chatList.unshift(data)

   // 通知サポート＆自分の投稿じゃないときだけ表示
  if (isSupported && data.userName !== userName.value) {
    show({
      title: `${data.userName} さんからの新着メッセージ`,
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
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea v-model="chatContent" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
      <div class="mt-5">
        <v-switch
          v-model="isImportant"
          label="重要">
        </v-switch>
        <button @click="onPublish"  class="button-normal">投稿</button>
      </div>
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
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
    </router-link>
    <important-chat></important-chat>
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
  color: #000;
  margin-top: 8px;
}

.executive-message {
  font-weight: bold;
  color: red;
}

</style>