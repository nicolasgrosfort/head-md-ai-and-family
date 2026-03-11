import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import os from "os";
import { defineConfig } from "vite";

const hostname = os.hostname();

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: [`http://${hostname}:5173`],
    proxy: {
      "/api": {
        target: `http://${hostname}:3000`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    tailwindcss(),
    basicSsl(),
    {
      name: "print-hostname",
      configureServer(server) {
        server.httpServer?.once("listening", () => {
          const port = server.config.server.port;
          console.log("");
          console.log("Dev server available at:");
          console.log(`Local:    http://localhost:${port}`);
          console.log(`Network:  http://${hostname}:${port}`);
          console.log("");
        });
      },
    },
  ],
});
