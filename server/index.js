import { fal } from "@fal-ai/client";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import express from "express";
import os from "os";
import { systemPrompt } from "./utils/config.js";

const PORT = 3000;
const app = express();

const ip = Object.values(os.networkInterfaces())
  .flat()
  .find((iface) => iface?.family === "IPv4" && !iface.internal)?.address;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

fal.config({
  credentials: process.env.FAL_API_KEY,
});

const google = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/speech-to-text", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/text-to-story", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/story-to-title", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/text-to-object", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/object-to-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    let mimeType = null;
    let image = null;

    const response = await google.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [systemPrompt.objectToImage, prompt].concat(" - "),
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        mimeType = part.inlineData.mimeType;
        image = part.inlineData.data;
      }
    }

    res.status(200).json({
      status: "ok",
      data: {
        mimeType,
        image,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Object to image failed", data: err });
  }
});

app.post("/remove-background-image", async (req, res) => {
  try {
    const { image } = req.body;

    const result = await fal.subscribe("fal-ai/bria/background/remove", {
      input: {
        image_url: image,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const mimeType = result.data.image.content_type;
    const imageUrl = result.data.image.url;

    res.status(200).json({
      status: "ok",
      data: {
        mimeType,
        imageUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Background removal failed", data: err });
  }
});

app.post("/image-to-model", async (req, res) => {
  try {
    const { image } = req.body;

    const result = await fal.subscribe("fal-ai/trellis", {
      input: {
        image_url: image,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    console.log(result);

    res.status(200).json({ status: "ok", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image to model failed", data: err });
  }
});

// app.post("/test", async (req, res) => {
//   try {
//     const { audio } = req.body;
//     const audioBase64url = `data:audio/wav;base64,${audio}`;

//     const result = await fal.subscribe(
//       "fal-ai/elevenlabs/speech-to-text/scribe-v2",
//       {
//         input: {
//           audio_url: audioBase64url,
//         },
//         logs: true,
//         onQueueUpdate: (update) => {
//           if (update.status === "IN_PROGRESS") {
//             update.logs.map((log) => log.message).forEach(console.log);
//           }
//         },
//       },
//     );

//     res.json({
//       status: "ok",
//       length: audio.length,
//       data: result.data,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "transcription failed" });
//   }
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`http://${ip}:${PORT}`);
});
