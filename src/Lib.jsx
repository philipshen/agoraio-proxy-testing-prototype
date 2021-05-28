/* eslint-disable react/prop-types */
/** @jsx jsx */
import { jsx, Global, css } from "@emotion/react";
import React from "react";
import ProximaNovaThin from "/fonts/ProximaNova-Thin.ttf";
import ProximaNovaLight from "/fonts/ProximaNova-Light.ttf";
import ProximaNovaReg from "/fonts/ProximaNova-Reg.ttf";
import ProximaNovaSbold from "/fonts/ProximaNova-Sbold.ttf";
import ProximaNovaBold from "/fonts/ProximaNova-Bold.ttf";

export const ViewportSize = {
  width: "100vw",
  height: "100vh",
};

export const Grid = {
  display: "grid",
  justifyContent: "center",
  alignItems: "center",
};

export const Flex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const HFlex = {
  ...Flex,
  flexFlow: "row",
};

export const VFlex = {
  ...Flex,
  flexFlow: "column",
};

export const Xray = {
  "& *": { outline: "1px solid rgba(255, 0, 0, 0.25)" },
};

export const Bx = React.forwardRef(({ sx, children, ...props }, ref) => {
  return (
    <div {...props} css={sx} ref={ref}>
      {children}
    </div>
  );
});
Bx.displayName = "Bx";

function customFont(name, ttf, weight) {
  return {
    "@font-face": {
      fontFamily: "ProximaNova",
      fontStyle: "normal",
      fontDisplay: "swap",
      fontWeight: weight,
      src: `
      local('ProximaNova'),
      local('${name}'),
      url(${ttf}) format('truetype')
    `,
      unicodeRange:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
    },
  };
}

// ---

// + assign colors once up here, then use them in aliases like theme.pallete.text.primary

export const theme = {
  spacing: [0, 8, 16, 32, 64],
  fontSizes: [0, 12, 14, /* base: */ 16, 20, 24, 32, 48, 64],
  fontWeights: [0, 100, 200, /* base: */ 400, 600],
  lineHeights: [0, /* base: */ 1.4],
  pallete: {
    text: {
      // ? Neutral 9
      primary: "#18191B",
      // ? some grey, or some Neutral
      secondary: "rgba(26, 27, 30, 0.64)",
      // ? neutral/00 white
      white: "#fff",
    },
    background: {
      primary: "#292C33",
      white: "#fff",
    },
    // ? some grey
    hr: "rgba(0, 0, 0, 0.08)",
  },
};

export function CssBaseline() {
  return (
    <Global
      styles={[
        // * following the conventions here:
        // * https://cssreference.io/property/font-weight/
        customFont("ProximaNova-Thin", ProximaNovaThin, 100),
        customFont("ProximaNova-Light", ProximaNovaLight, 200),
        customFont("ProximaNova-Reg", ProximaNovaReg, 400),
        customFont("ProximaNova-Sbold", ProximaNovaSbold, 600),
        customFont("ProximaNova-Bold", ProximaNovaBold, 700),

        css`
          :root {
            --font-family: ProximaNova, -apple-system, sans-serif;
            --font-size: 16px;
            --font-weight: 400;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: var(--font-family);
            font-size: var(--font-size);
            font-weight: var(--font-weight);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `,
      ]}
    />
  );
}

// ---

export const cp = {
  pxy: (x, y) => ({ padding: `${y}px ${x}px` }),
  mxy: (x, y) => ({ margin: `${y}px ${x}px` }),
};
