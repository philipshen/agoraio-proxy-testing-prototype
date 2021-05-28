/**
 * @fileoverview Wraps APIs for Agora 4. We'll need the same interface for Agora 3:
 * 
 * @method startSendReceiveTest(senderDomId,[receiverDomId],[[eagerUseProxy]])
 * @method stopSendReceiveTest()
 * @ts-check
 */
import * as api from "./API"

// Internal state
let senderClient;
let senderTracks;
let receiverClient;

/**
 * @typedef {{
 *  appId: string,
 *  channel: string
 * }} AgoraConfig
 * @param {AgoraConfig} agoraConfig 
 * @param {*} uid 
 * @param {*} token 
 * @param {*} client 
 * @param {*} eagerUseProxy 
 */
async function _joinChannelWithRetry(agoraConfig, uid, token, client, eagerUseProxy = false) {
  const joinPromise = client.join(agoraConfig.appId, agoraConfig.channel, token, uid);
  if (eagerUseProxy) {
    const id = await joinPromise
    return id
  }

  // On timeout, connection via proxy server
  const timeoutPromise = new Promise((_res, rej) =>
    setTimeout(
      () => rej(new Error("Join timed out")),
      7000
    )
  );

  try {
    const id = await Promise.race([timeoutPromise, joinPromise]);
    return id
  } catch (error) {
    console.log("Join channel failed; retrying with proxy", error)
    return _joinChannelWithRetry(agoraConfig, uid, token, client, true)
  }
}

/**
 * Stops the send/receive test
 */
export async function stopSendReceiveTest() {
  senderTracks.forEach((track) => track.stop())
  await Promise.all([
    senderClient.leave(),
    receiverClient.leave()
  ])
  senderClient = undefined;
  receiverClient = undefined;
}

/**
 * Starts sending and receiving a stream from this client
 * 
 * @param {string} senderDomId The dom ID to play the sender's local stream on
 * @param {string} receiverDomId The dom ID to play the receiver's local stream on
 * @returns All the metadata returned by the server
 */
export async function startSendReceiveTest(senderDomId, receiverDomId, eagerUseProxy = false) {
  // Initialize Agora clients
  const testMetadata = await api.fetchSendReceiveTestData();
  senderClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  receiverClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  const agoraConfig = { channel: testMetadata.channel, appId: testMetadata.agoraAppId }

  try {
    await Promise.all([
      _joinChannelWithRetry(
        agoraConfig,
        testMetadata.senderUid,
        testMetadata.senderToken, 
        senderClient, 
        eagerUseProxy
      ),
      _joinChannelWithRetry(
        agoraConfig, 
        testMetadata.receiverUid,
        testMetadata.receiverToken, 
        receiverClient, 
        eagerUseProxy
      )
    ])

    // Set up receiver event listeners
    receiverClient.on("user-published", async (remoteUser, mediaType) => {
      if (remoteUser.uid !== testMetadata.senderUid) {
        console.error(`Unrecognized user ${remoteUser.uid} published to channel`)
        return;
      }

      await receiverClient.subscribe(remoteUser, mediaType)
      if (mediaType === "video") {
        remoteUser.videoTrack.play(receiverDomId)
      }
    })

    // Publish stream from sender
    senderTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
      {},
      { 
        encoderConfig: {
          width: 480,
          height: 270,
        }
      }
    )
    await senderClient.publish(senderTracks)
    senderTracks[1].play(senderDomId) // Just play the video track
  } catch (error) {
    stopSendReceiveTest()
  }

  
  return testMetadata;
}