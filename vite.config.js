import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

console.warn(process.env)

export default defineConfig({
  plugins: [reactRefresh()],
  // base: "/agenda-editor-prototype/",
  assetsInclude: "./fonts"
});
