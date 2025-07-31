<script setup>
import { inject, ref, provide, computed } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
const userRole = inject("userRole")
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
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">誰も取り残さないチャットアプリ</h1>
      <div class="input-group">
        <label for="username">ユーザー名</label>
        <input v-model="inputUserName" type="text" class="user-name-text" placeholder="ユーザー名" />
        <p>ユーザー種別</p>
        <select v-model="userRole" class="user-role-select">
          <option value="general">一般</option>
          <option value="executive">幹部</option>
        </select>
      </div>
      <button type="button" @click="onEnter" class="button-normal">入室する</button>
    </div>
  </div>
</template>

<style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #ffffff;
    padding: 0 1rem;
  }

  .login-box {
    background-color: #fff3e0;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    width: 100%;
    max-width: 600px;
    text-align: center;
  }

  .title {
    font-size: 1.75rem;
    font-weight: 500;
    color: #ff6600;
    margin-bottom: 2rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 1.5rem;
    max-width: 300px;
  }

  .input-group label {
    margin-bottom: 0.5rem;
    color: #333;
    width: 100%;
    text-align: center;
  }

  .input-group > p {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
    text-align: center;
  }

  .user-role-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    color: #333;
    background-color: #ffffff;
    border: 2px solid #ff6600;
    border-radius: 6px;
  }

  .user-name-text {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid #ff6600;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 0;
    background-color: #ffffff;
  }

  .button-normal {
    width: 100%;
    max-width: 300px;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
    color: #ffffff;
    background-color: #ff6600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .button-normal:hover {
    background-color: #e65500;
  }
</style>
