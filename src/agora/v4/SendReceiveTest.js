/**
 * @fileoverview Wraps APIs for Agora 4. We'll need the same interface for Agora 3:
 * 
 * @method startSendReceiveTest(senderDomId,[receiverDomId],[[eagerUseProxy]])
 * @method stopSendReceiveTest()
 * @ts-check
 */
import * as api from "../../API"
import * as Utils from "./utils"

// Internal state
let senderClient;
let senderTracks;
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

/**
 * Stops the send/receive test
 */
export async function stopSendReceiveTest() {
  senderTracks?.forEach((track) => track.stop())
  await Promise.all([
    senderClient?.leave(),
    receiverClient?.leave()
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
export async function startSendReceiveTest(
  senderDomId, 
  receiverDomId, 
  eagerUseProxy = false, 
  useTestMetadataCache = false
) {
  // Fetch test metadata
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

  // Initialize Agora clients
  const agoraConfig = { channel: testMetadata.channel, appId: testMetadata.appId }

  try {
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
    throw error
  }

  
  return testMetadata;
}