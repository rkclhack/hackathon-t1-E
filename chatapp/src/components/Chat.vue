<script setup>
import { inject, ref, reactive, onMounted, computed, provide } from "vue"
import socketManager from '../socketManager.js'
import { useWebNotification } from '@vueuse/core'

import toJpnTime from "../utils/toJpnTime.js"
import ImportantChat from "./ImportantChat.vue"
import Schedule from "./Schedule.vue"
import DropDownList from "./DropDownList.vue"

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
const mode = ref("重要事項")

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


const findLatestMessage = (userName) => {
  const userChats = chatList.filter(chat => chat.userName === userName)
  if (userChats.length === 0) return null

  return userChats.reduce((latest, current) =>
    new Date(current.sendAt) > new Date(latest.sendAt) ? current : latest
  )
}

const deleteFlag = ref(false)

provide("chatList", chatList)
provide("mode", mode)

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
  deleteFlag.value = true
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
    // data.isExecutive === true &&    // 幹部かどうか
    data.isImportant === true       // 重要かどうか
  ) {
    show({
      title: `【重要】${data.userName} さんのメッセージ`,
      body: data.chatContent,
    })
  }
  
}

const onDeleteMessage = () => {
  const isConfirmed =confirm('本当に削除しますか？')

  const latestChat = findLatestMessage(userName.value)
  if(!latestChat){
    alert("削除するメッセージがありません")
    return
  }
  if(!deleteFlag.value){
    alert("連続でメッセージは削除できません")
    return
  }
  console.log(latestChat)
  if (isConfirmed){
    socket.emit("deleteEvent",{
      userName: userName.value,
      sendAt: latestChat.sendAt
    })
    deleteFlag.value = false
  }
}

const onReceiveDelete = (deleteInfo) => {
  const index = chatList.findIndex(chat => 
    chat.userName === deleteInfo.userName && 
    chat.sendAt === deleteInfo.sendAt
  )
  
  if (index !== -1) {
    chatList.splice(index, 1)
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

  socket.on("deleteEvent", (deleteInfo) => {
    onReceiveDelete(deleteInfo)
  });
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
    <div class="chat-inner">
      <div class="chat-list">
        <div class="mt-5" v-if="chatList.length !== 0">
          <ul>
            <li v-for="(chat, i) in chatList" :key="i"
            :class="{ 'mine': chat.userName === userName }"
            >
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
      <div class="important-chat-list">
        <important-chat v-show="mode === '重要事項'" :class="{ move: mode !== '重要事項' }"></important-chat>
      </div>
      <schedule v-show="mode === 'スケジュール'" :class="{ move: mode !== 'スケジュール' }"></schedule>
      <drop-down-list></drop-down-list>
    </div>

    <div class="chat-input-area">
      <textarea v-model="chatContent" placeholder="投稿文を入力してください" rows="4" class="chat-input"></textarea>
      <div class="important-wrapper" v-if="isExecutive">
        <v-chip v-if="isImportant" color="red lighten-1" text-color="white" small>
          重要
        </v-chip>
        <v-switch
          v-model="isImportant"
          :color="isImportant ? 'red lighten-1' : 'grey'"
          class="mt-5">
        </v-switch>
      </div>
      <button @click="onDeleteMessage" class="delete-btn">削除</button>
      <button @click ="onPublish" class="send-btn">投稿</button>
    </div>
  </div>
</template>

<style scoped>
body {
  overflow-y: hidden;
}

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
  background-color: #ffffff;
}

.chat-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #ff6600;
  color: #fff;
  border-bottom: 2px solid #c0c0c0;
  padding: 0 1rem;
  height: 78px;
}

.chat-header h1 {
  margin-right: auto;
}

.chat-list {
  overflow-y: auto;
  /* padding: 1rem; */
  width: 60%;
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

.chat-list li .item:nth-child(1) {
  order: 1;
  font-weight: 600;
}

.chat-list li .item:nth-child(3) {
  order: 2;
  flex: 1;
}

.chat-list li .item:nth-child(2) {
  order: 3;
  font-size: 0.8rem;
  color: #666;
  margin-left: auto;
}

.chat-input-area {
  position: absolute;
  display: flex;
  bottom: 0;
  width: 60%;
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

.chat-inner {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 80px);
}

.important-chat-list {
  width: 40%;
  height: calc(100vh - 80px);
  border-left: 1px solid #282828;
  }

  .executive-message {
  font-weight: bold;
  color: red;
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

  .important-wrapper {
    display: flex;
    align-items: center; 
    margin: 0 1rem 0 0;
  }

  .important-wrapper .v-chip { 
    order: 2; margin-left: 0.5rem;
  }

  .executive-message {
    font-weight: bold;
    color: red;
  }

  .delete-btn {
    background-color: #ff6600;
    border: none;
    margin-left: auto;
    color: #fff;
    font-size: 1.1rem;
    border-radius: 4px;
    padding: 0.5rem 0.8rem;
    margin-right: 1rem;
    cursor: pointer;
  }

  .chat-list li.mine {
    margin-left: auto;
    background-color: #e0f7fa;
    justify-content: flex-end;
  }

  .chat-list li.mine .item {
    text-align: left;
  }

  .chat-list li.mine .item:nth-child(2) {
    margin-left: 0;
    margin-right: auto;
  }

  .move {
    transform: translateX(1000%);
  }
</style>
