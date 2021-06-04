export async function joinChannelWithRetry(agoraConfig, uid, token, eagerUseProxy = false) {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

  // Initial join attempt
  const attemptJoin = async (useProxy) => {
    return new Promise((resolve, reject) => {
      client.init(
        agoraConfig.appId, 
        /* onSuccess */ () => {
          console.debug("Client initialized")
          if (useProxy) {
            console.debug("Starting proxy server");
            client.startProxyServer(3)
          }

          client.join(
            token, 
            agoraConfig.channel, 
            uid, 
            undefined,
            () => {
              resolve(client)
              console.debug("Joined with uid " + uid)
            }, 
            reject
          )
        },
        /* onFailure */ reject);
    })
  }

  const timeoutPromise = new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Join timed out"))
    }, 7000)
  })

  try {
    await Promise.race([attemptJoin(eagerUseProxy), timeoutPromise])
    return client
  } catch (error) {
    console.debug('Join channel failed; retrying with proxy', error)
    await new Promise((resolve, reject) => client.leave(resolve, reject))
    return attemptJoin(true)
  }
}