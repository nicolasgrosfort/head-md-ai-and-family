import { fal } from "@fal-ai/client";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import express from "express";
import os from "os";
// import { systemPrompt } from "../client/src/utils/instructions.js";

const PORT = 3000;
const app = express();

const ip = Object.values(os.networkInterfaces())
  .flat()
  .find((iface) => iface?.family === "IPv4" && !iface.internal)?.address;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.raw({ type: "*/*" }));

fal.config({
  credentials: process.env.FAL_API_KEY,
});

const google = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/speech-to-text", async (req, res) => {
  try {
    const speech = req.body;
    const speechBase64 = speech.toString("base64");
    const speechBase64Url = `data:audio/wav;base64,${speechBase64}`;

    const result = await fal.subscribe(
      "fal-ai/elevenlabs/speech-to-text/scribe-v2",
      {
        input: {
          audio_url: speechBase64Url,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      },
    );

    res.status(200).json({
      status: "ok",
      data: {
        text: result.data.text,
      },
    });
  } catch (error) {
    console.error("Speech to text failed", error);
    res.status(500).json({ error: "Speech to text failed", data: error });
  }
});

app.post("/text-to-story", (req, res) => {
  try {
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Text to story failed", data: err });
  }
});

app.post("/story-to-title", (req, res) => {
  try {
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Story to title failed", data: err });
  }
});

app.post("/text-to-object", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await google.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: text,
    });

    res.status(200).json({
      status: "ok",
      data: {
        object: response.text,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Text to object failed", data: err });
  }
});

app.post("/object-to-title", async (req, res) => {
  try {
    const { object } = req.body;

    const response = await google.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: object,
    });

    res.status(200).json({
      status: "ok",
      data: {
        title: response.candidates[0].content.parts[0].text,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Object to title failed", data: err });
  }
});

app.post("/object-to-image", async (req, res) => {
  try {
    const { object } = req.body;

    const response = await google.models.generateContent({
      model: "gemini-2.5-flash-image",
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1k",
        },
      },
      contents: object,
    });

    const imageBase64 = `data:image/png;base64,${response.candidates[0].content.parts[0].inlineData.data}`;

    res.status(200).json({
      status: "ok",
      data: {
        image: imageBase64,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Object to image failed", data: err });
  }
});

app.post("/image-to-mask", async (req, res) => {
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

    res.status(200).json({
      status: "ok",
      data: {
        mask: result.data.image.url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Background removal failed", data: err });
  }
});

app.post("/mask-to-model", async (req, res) => {
  try {
    const { mask, title } = req.body;

    const result = await fal.subscribe("fal-ai/sam-3/3d-objects", {
      input: {
        image_url: mask,
        mask_urls: [mask],
        prompt: title,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    res.status(200).json({
      status: "ok",
      data: {
        model: result.data.model_glb.url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mask to model failed", data: err });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`http://${ip}:${PORT}`);
});
