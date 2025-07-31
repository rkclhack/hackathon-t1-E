<script setup>
import { computed, inject } from "vue"
import toJpnTime from "../utils/toJpnTime"

const chatList = inject("chatList")

const importantChatList = computed(() =>
    chatList.filter((chat) => chat.isImportant === true)
)
</script>

<template>
    <ul>
        <li v-for="(importantChat, i) in importantChatList" :key="i">
            <div class="item mt-4">{{ toJpnTime(importantChat.sendAt) }}</div>
            <div style="white-space: pre-wrap;" class="item mt-4">{{ importantChat.chatContent }}</div>
        </li>
    </ul>
</template>