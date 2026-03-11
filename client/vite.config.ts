import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import os from "os";
import { defineConfig } from "vite";

const ip = Object.values(os.networkInterfaces())
  .flat()
  .find((iface) => iface?.family === "IPv4" && !iface.internal)?.address;

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: [`http://${ip}:5173`],
    https: {
      key: fs.readFileSync("./localhost+3-key.pem"),
      cert: fs.readFileSync("./localhost+3.pem"),
    },
    proxy: {
      "/api": {
        target: `http://${ip}:3000`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [tailwindcss()],
});
