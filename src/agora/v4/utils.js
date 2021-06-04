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
 export async function joinChannelWithRetry(agoraConfig, uid, token, eagerUseProxy = false) {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  AgoraRTC.setParameter("SUBSCRIBE_TCC", false);

  if (eagerUseProxy) {
    console.log("Starting proxy server")
    client.startProxyServer(3)
  }

  const joinPromise = client.join(agoraConfig.appId, agoraConfig.channel, token, uid);
  if (eagerUseProxy) {
    await joinPromise
    return client
  }

  // On timeout, connection via proxy server
  const timeoutPromise = new Promise((_res, rej) =>
    setTimeout(
      () => rej(new Error("Join timed out")),
      7000
    )
  );
 
  try {
    await Promise.race([timeoutPromise, joinPromise]);
    console.log("Joined channel with uid " + uid)
    return client
  } catch (error) {
    console.debug("Join channel failed; retrying with proxy", error)
    await client.leave()
    return joinChannelWithRetry(agoraConfig, uid, token, true)
  }
}