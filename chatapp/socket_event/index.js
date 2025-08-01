import { getCurrentInstance } from "vue"

let currentScheduleContent = ""; 

export default (io, socket) => {
  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    io.sockets.emit("publishEvent", data)
  })
  // メッセージを削除する
  socket.on("deleteEvent", (data) => {
    io.sockets.emit("deleteEvent", data)
  })

  //メッセージの更新
  socket.on("updateSchedule", (data) => {
    currentScheduleContent = data; // 受信したスケジュール内容を保存
    io.sockets.emit("scheduleUpdate", currentScheduleContent);
  });

  //スケジュールの送信
  socket.on("getSchedule", () => {
    socket.emit("scheduleUpdate", currentScheduleContent);
  });
}