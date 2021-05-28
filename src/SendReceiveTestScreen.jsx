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
import * as AgoraV4Impl from "./AgoraV4Impl"

const TestStatus = {
  STOPPED: 0,
  INITIALIZING: 1,
  RUNNING: 2,
}

export default function SendReceiveTestScreen() {
  const AgoraVersionContext = React.useContext(AgoraContainer.Context);
  const [testStatus, setTestStatus] = React.useState(TestStatus.STOPPED)
  const [testMetadata, setTestMetadata] = React.useState()
  const [eagerEnableProxy, setEagerEnableProxy] = React.useState(false)
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

  const startTest = async () => {
    setTestStatus(TestStatus.INITIALIZING)
    const data = await AgoraV4Impl.startSendReceiveTest(senderDomId, receiverDomId, eagerEnableProxy)
    setTestStatus(TestStatus.RUNNING)
    setTestMetadata(data)
  }

  const stopTest = async () => {
    await AgoraV4Impl.stopSendReceiveTest()
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
        <label for="eagerEnableProxyCheckbox">Enable proxy</label>
        <input 
          type="checkbox" 
          name="eagerEnableProxyCheckbox" 
          checked={eagerEnableProxy}
          onChange={(event) => setEagerEnableProxy(event.target.checked)}
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