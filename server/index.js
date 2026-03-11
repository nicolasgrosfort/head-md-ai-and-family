import { fal } from "@fal-ai/client";
import cors from "cors";
import express from "express";
import os from "os";

const hostname = os.hostname();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

fal.config({
  credentials: process.env.FAL_API_KEY,
});

app.post("/test", async (req, res) => {
  try {
    const { audio } = req.body;
    const audioBase64url = `data:audio/wav;base64,${audio}`;

    const result = await fal.subscribe(
      "fal-ai/elevenlabs/speech-to-text/scribe-v2",
      {
        input: {
          audio_url: audioBase64url,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      },
    );

    res.json({
      status: "ok",
      length: audio.length,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "transcription failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at:`);
  console.log(`http://${hostname}.local:${PORT}`);
});
