/**
 * @fileoverview Stores and provides the Agora SDK globally. Triggers a CDN download.
 * @ts-check
 */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import AgoraVersion from "./AgoraVersion";

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
  const agoraVersion = React.useRef(window.localStorage.getItem("agora_version"))
  const [isAgoraDownloaded, setIsAgoraDownloaded] = React.useState(false);

  React.useEffect(() => {
    // Load Agora
    let cdnUrl = agoraCdnUrls[agoraVersion.current];
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
        console.log("Successfully loaded Agora")
        setIsAgoraDownloaded(true)
      })
      .catch((err) => console.error("Failed to download Agora", err))
  }, []);

  const setVersion = React.useCallback((version) => {
    if (version === agoraVersion.current) {
      return;
    }
    
    window.localStorage.setItem("agora_version", version);
    window.location.reload()
  }, [agoraVersion.current])

  return (
    <Context.Provider value={{ setVersion, agoraVersion: agoraVersion.current }}>
      {isAgoraDownloaded ? props.children : props.loadingScreen}
    </Context.Provider>
  );
}