/**
 * @fileoverview Stores and provides the Agora SDK globally. Triggers a CDN download.
 * @ts-check
 */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import AgoraVersion from "./AgoraVersion";
import * as DurableState from "./DurableState";

export const Context = React.createContext();

const agoraCdnUrls = {
  [AgoraVersion.v3_4_0]: "https://download.agora.io/sdk/release/AgoraRTCSDK-3.4.0.js",
  [AgoraVersion.v4_4_0]: "https://download.agora.io/sdk/release/AgoraRTC_N-4.4.0.js"
}

/**
 * 
 * @typedef {{
 *  loadingScreen: JSX.Element,
 *  children: JSX.Element
 * }} Props
 * @param {Props} props 
 */
export function Provider(props) {
  const [agoraVersion, setAgoraVersion] = DurableState.use("local.agora_version", AgoraVersion.v4_4_0)
  const [isAgoraDownloaded, setIsAgoraDownloaded] = React.useState(false);

  React.useEffect(() => {
    // Load Agora
    let cdnUrl = agoraCdnUrls[agoraVersion];
    if (!cdnUrl) {
      cdnUrl = agoraCdnUrls[AgoraVersion.v4_4_0];
    }
    
    const scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      document.body.appendChild(script);
      script.onload = resolve
      script.onerror = reject
      script.async = true
      script.src = cdnUrl
    })
    
    scriptPromise
      .then(() => {
        console.debug("Successfully loaded Agora");
        setIsAgoraDownloaded(true);
      })
      .catch((err) => console.error("Failed to download Agora", err))
  }, []);

  const setVersion = React.useCallback((version) => {
    if (version === agoraVersion) {
      return;
    }
    
    setAgoraVersion(version)
    window.location.reload()
  }, [agoraVersion])

  return (
    <Context.Provider value={{ setVersion, agoraVersion: agoraVersion }}>
      {isAgoraDownloaded ? props.children : props.loadingScreen}
    </Context.Provider>
  );
}