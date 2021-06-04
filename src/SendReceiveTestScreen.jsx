/**
 * @fileoverview Demo screen entry point
 * @ts-check
 */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { Bx } from "./Lib";
import * as AgoraContainer from "./AgoraVersionContainer"
import AgoraVersion from "./AgoraVersion"
import * as AgoraV4Impl from "./agora/v4/SendReceiveTest"
import * as AgoraV3Impl from "./agora/v3/SendReceiveTest"
import * as DurableState from "./DurableState"

const TestStatus = {
  STOPPED: 0,
  INITIALIZING: 1,
  RUNNING: 2,
}

export default function SendReceiveTestScreen() {
  const AgoraVersionContext = React.useContext(AgoraContainer.Context);
  const [testStatus, setTestStatus] = React.useState(TestStatus.STOPPED)
  const [testMetadata, setTestMetadata] = React.useState()
  const [eagerEnableProxy, setEagerEnableProxy] = DurableState.use("local.eagerEnableProxy", false)
  const [useTestMetadataCache, setUseTestMetadataCache] = DurableState.use("local.useTestMetadataCache", false)
  const senderDomId = "send-stream"
  const receiverDomId = "recv-stream"

  const streamStyles = { 
    backgroundColor: "black", 
    height: 270, 
    width: 480, 
    marginLeft: 20, 
    marginRight: 20,
    marginTop: 40
  }

  const useAgoraV3Api = AgoraVersionContext.agoraVersion.charAt(0) === "3"

  const startTest = async () => {
    setTestStatus(TestStatus.INITIALIZING)
    let metadata;
    try {
      if (useAgoraV3Api) {
        metadata = await AgoraV3Impl.startSendReceiveTest(
          senderDomId,
          receiverDomId,
          eagerEnableProxy,
          useTestMetadataCache  
        )
      } else {
        metadata = await AgoraV4Impl.startSendReceiveTest(
          senderDomId, 
          receiverDomId, 
          eagerEnableProxy,
          useTestMetadataCache
        )
      }
      
      setTestStatus(TestStatus.RUNNING)
      setTestMetadata(metadata)
    } catch (error) {
      setTestStatus(TestStatus.STOPPED)
    }
  }

  const stopTest = async () => {
    if (useAgoraV3Api) {
      await AgoraV3Impl.stopSendReceiveTest()
    } else {
      await AgoraV4Impl.stopSendReceiveTest()
    }
    setTestMetadata(null)
    setTestStatus(TestStatus.STOPPED)
  }

  return (
    <Bx sx={{ color: "white", padding: 40, width: "100%" }}>
      <button 
        type="submit" 
        onClick={() => {
          switch (testStatus) {
            case TestStatus.RUNNING:
              stopTest()
              break;
            case TestStatus.STOPPED:
              startTest();
              break;
            default:
              break;
          }
        }}
      >
        {(() => {
          switch (testStatus) {
            case TestStatus.RUNNING:
              return "Stop test"
            case TestStatus.STOPPED:
              return "Start test"
            case TestStatus.INITIALIZING:
              return "Starting test..."
          }
        })()}
      </button>
      <h3>Control Panel</h3>
      {Object.values(AgoraVersion).map((version) => {
        return (
          <button 
            key={version} 
            type="submit" 
            onClick={() => AgoraVersionContext.setVersion(version)}
          >
            {version}{AgoraVersionContext.agoraVersion === version ? " (current)" : ""}
          </button>
        )
      })}
      <div style={{marginTop: 8}}>
        <label for="eagerEnableProxyCheckbox">Eagerly enable proxy</label>
        <input 
          type="checkbox" 
          name="eagerEnableProxyCheckbox" 
          checked={eagerEnableProxy}
          onChange={(event) => setEagerEnableProxy(event.target.checked)}
        ></input>
      </div>
      <div style={{marginTop: 8}}>
        <label for="eagerEnableProxyCheckbox">Use test metadata cache</label>
        <input 
          type="checkbox" 
          name="eagerEnableProxyCheckbox" 
          checked={useTestMetadataCache}
          onChange={(event) => setUseTestMetadataCache(event.target.checked)}
        ></input>
      </div>

      <h3>Test Metadata</h3>
      <p style={{width: "60%", wordBreak: "break-all"}}>
        {JSON.stringify(testMetadata)}
      </p>
      
      {/* Sender/Receiver streams */}
      <div>
        <div style={{float: "left"}}>
          <h3>Sender</h3>
          <div id={senderDomId} style={streamStyles} />
        </div>
        <div style={{float: "left"}}>
          <h3>Receiver</h3>
          <div id={receiverDomId} style={streamStyles} />
        </div>
      </div>
    </Bx>
  );
}