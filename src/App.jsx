/* eslint-disable react/prop-types */
/** @jsx jsx */
import { jsx, ThemeProvider } from "@emotion/react";
import React from "react";
import { Bx, CssBaseline, theme, HFlex, VFlex } from "./Lib";
import SendReceiveTestScreen from "./SendReceiveTestScreen";
import * as AgoraVersionContainer from "./AgoraVersionContainer";
import * as DurableState from "./DurableState";

// + compile to static build
// + highlight item(s) at cursor line

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AgoraVersionContainer.Provider loadingScreen={<Bx sx={{ color: "white" }}>Loading Agora....</Bx>}>
        <DurableState.Provider>
          <Root />
        </DurableState.Provider>
      </AgoraVersionContainer.Provider>
    </ThemeProvider>
  );
}

function Root() {
  const screenIds = ["sendReceiveTest"];
  const [currentScreenId, putCurrentScreenId] = DurableState.use(
    "session.currentScreenId",
    screenIds[0]
  );
  const navigateToScreen = (screenId) => {
    if (!screenIds.includes(screenId))
      throw new Error(`unrecognized screen id: ${screenId}`);
    putCurrentScreenId(screenId);
  };

  return (
    <Bx
      sx={{
        ...VFlex,
        alignItems: "stretch",
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <Bx // * top nav toolbar
        sx={(t) => ({
          ...HFlex,
          justifyContent: "flex-start",

          "& > *": {
            padding: t.spacing[1],
            marginLeft: t.spacing[2],
            color: t.pallete.text.secondary,
            "&[data-is-active=true]": {
              color: t.pallete.text.primary,
              fontWeight: t.fontWeights[4],
            },
          },
        })}
      >
        <Bx
          data-is-active={currentScreenId === "sendReceiveTest"}
          onClick={() => navigateToScreen("sendReceiveTest")}
        >
          Send/Receive Test
        </Bx>
      </Bx>
      <Bx // * main area
        sx={(t) => ({
          flex: 2,
          background: t.pallete.background.primary,
          ...HFlex,
          alignItems: "stretch",
        })}
      >
        {
          {
            sendReceiveTest: (
              <SendReceiveTestScreen />
            ),
          }[currentScreenId]
        }
      </Bx>
    </Bx>
  );
}
