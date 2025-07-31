<script setup>
import { inject, ref, provide, computed } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
const userRole = inject("userRole", ref("general"))
const isExecutive = computed(() => userRole.value === "executive")
// #endregion

// #region local variable
const router = useRouter()
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const inputUserName = ref("")
// #endregion

// #region browser event handler
// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック(未入力でエラーメッセージ出す)
   if (!inputUserName.value.trim()) {
    alert("ユーザー名を入力してください。")
    return
  }  

  // 入室メッセージを送信
  socket.emit("enterEvent", { user: inputUserName.value });
  // 全体で使用するnameに入力されたユーザー名を格納
  userName.value = inputUserName.value
  // チャット画面へ遷移
  router.push({ name: "chat" })
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">バレーボール同好会</h1>
    <div class="mt-10">
      <p>ユーザー名</p>
      <input v-model="inputUserName" type="text" class="user-name-text" />
      <p>ユーザー種別</p>
      <select v-model="userRole" class="user-role-select">
        <option value="general">一般</option>
        <option value="executive">幹部</option>
      </select>
    </div>
    <button type="button" @click="onEnter" class="button-normal">入室する</button>
  </div>
</template>

<style scoped>
.user-name-text {
  width: 200px;
  border: 1px solid #888;
  margin-bottom: 16px;
}
</style>
