export default (io, socket) => {
  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    io.sockets.emit("publishEvent", data)
  })
  // メッセージを削除する
  socket.on("deleteEvent", (data) => {
    io.sockets.emit("deleteEvent", data)
  })
}