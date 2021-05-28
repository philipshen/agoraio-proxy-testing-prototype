const Middleware = require("./middleware")
const { RtcRole, RtcTokenBuilder } = require("agora-access-token")
const express = require('express')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const port = process.env.SERVER_PORT

app.get("/send-receive-test", Middleware.noCache, (_req, resp) => {
  resp.header('Access-Control-Allow-Origin', '*');
  const channel = "prototype-" + Math.random().toString(36).substring(7)
  const expireTime = (Date.now() / 1000) + 3600 // 1 hour

  // Sender
  const senderUid = 1111
  const senderToken = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERTIFICATE,
    channel,
    senderUid,
    RtcRole.PUBLISHER,
    expireTime
  )

  // Receiver
  const receiverUid = 2222
  const receiverToken = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERTIFICATE,
    channel,
    receiverUid,
    RtcRole.SUBSCRIBER,
    expireTime
  )

  return resp.json({ 
    senderUid, 
    senderToken, 
    receiverUid, 
    receiverToken, 
    channel, 
    appId: process.env.AGORA_APP_ID 
  })
})

app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Demo app listening at http://localhost:${port}`)
})