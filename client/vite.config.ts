import os from "os";
import { defineConfig } from "vite";

const hostname = os.hostname();

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["macbook-pro-de-nicolas.local"],
  },
  plugins: [
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
