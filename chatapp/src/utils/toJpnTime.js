const toJpnTime = (sendAt) =>
  new Date(sendAt).toLocaleTimeString("ja-JP",
    { 
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit"
    }
  )

export default toJpnTime