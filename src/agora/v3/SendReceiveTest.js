import * as api from "../../API"
import * as Utils from "./utils"

// Internal state
let senderClient;
let senderStream;
let receiverClient;

function cacheTestMetadata(testMetadata) {
  window.localStorage.setItem("agora_test_metadata", JSON.stringify(testMetadata));
}

function getCachedTestMetadata() {
  const metadata = window.localStorage.getItem("agora_test_metadata")
  if (!metadata) {
    return;
  }

  return JSON.parse(metadata)
}

export async function stopSendReceiveTest() {
  await Promise.all([
    new Promise((res, rej) => senderClient?.leave(res, rej)),
    new Promise((res, rej) => receiverClient?.leave(res, rej)),
  ])
  senderStream?.getAudioTrack()?.stop()
  senderStream?.getVideoTrack()?.stop()
  senderStream?.stop()
  senderClient = undefined;
  receiverClient = undefined;
}

export async function startSendReceiveTest(
  senderDomId,
  receiverDomId,
  eagerUseProxy = false,
  useTestMetadataCache = false
) {
  let testMetadata;
  if (useTestMetadataCache) {
    testMetadata = getCachedTestMetadata()

    if (testMetadata) {
      console.debug("Using cached test metadata")
    }
  }

  if (!testMetadata) {
    console.debug("Fetching test metadata")
    testMetadata = await api.fetchSendReceiveTestData();
    cacheTestMetadata(testMetadata)
  }

  const agoraConfig = { channel: testMetadata.channel, appId: testMetadata.appId }

  try {
    // Init clients
    [senderClient, receiverClient] = await Promise.all([
      Utils.joinChannelWithRetry(
        agoraConfig,
        testMetadata.senderUid,
        testMetadata.senderToken, 
        eagerUseProxy
      ),
      Utils.joinChannelWithRetry(
        agoraConfig, 
        testMetadata.receiverUid,
        testMetadata.receiverToken, 
        eagerUseProxy
      )
    ])

    // Set up event listeners
    receiverClient.on("stream-added", ({ stream }) => {
      receiverClient.subscribe(
        stream, 
        { video: true, audio: true }, 
        (err) => console.error("Failed to subscribe: " + err)
      )
    })

    receiverClient.on("stream-subscribed", ({ stream }) => {
      stream.play(receiverDomId, { muted: true })
    })

    senderClient.on("stream-published", ({ stream }) => {
      stream.play(senderDomId, { muted: true })
    })

    // Publish stream from sender
    senderStream = AgoraRTC.createStream({
      streamID: agoraConfig.senderUid,
      audio: true,
      video: true,
    });
    await new Promise((resolve, reject) => senderStream.init(resolve, reject))
    senderClient.publish(senderStream, (err) => {
      console.debug("Failed to publish", err)
    });
  } catch (error) {
    stopSendReceiveTest()
    throw error
  }

  return testMetadata
}