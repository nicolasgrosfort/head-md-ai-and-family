import { fal } from "@fal-ai/client";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import os from "os";
import { Server } from "socket.io";
import { ledOff, ledOn } from "./libs/led.js";
import { print } from "./libs/printer.js";

const PORT = 3000;
const app = express();
const httpServer = createServer(app);

const ip = Object.values(os.networkInterfaces())
  .flat()
  .find((iface) => iface?.family === "IPv4" && !iface.internal)?.address;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.raw({ type: "*/*", limit: "50mb" }));

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

fal.config({
  credentials: process.env.FAL_API_KEY,
});

const google = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

ledOff(16);
ledOff(26);
ledOff(24);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("ledOn", (pin) => {
    console.log(`Turning LED on pin ${pin} ON`);
    ledOn(pin);
  });

  socket.on("ledOff", (pin) => {
    console.log(`Turning LED on pin ${pin} OFF`);
    ledOff(pin);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.post("/speech-to-text", async (req, res) => {
  try {
    const speech = req.body;

    const filename = `audio-${Date.now()}.wav`;
    const { error } = await supabase.storage
      .from("audio")
      .upload(filename, speech, { contentType: "audio/wav" });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("audio").getPublicUrl(filename);

    const result = await fal.subscribe(
      "fal-ai/elevenlabs/speech-to-text/scribe-v2",
      {
        input: {
          audio_url: publicUrl,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      },
    );

    io.emit("speech", result.data.text);
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

app.post("/text-to-story", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await google.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: text,
    });

    io.emit("story", response.text);
    res.status(200).json({
      status: "ok",
      data: {
        story: response.text,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Text to story failed", data: err });
  }
});

app.post("/story-to-title", async (req, res) => {
  try {
    const { story } = req.body;

    const response = await google.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: story,
    });

    io.emit("storyTitle", response.text);
    res.status(200).json({
      status: "ok",
      data: {
        title: response.text,
      },
    });
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

    io.emit("object", response.text);
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

    io.emit("objectTitle", response.text);
    res.status(200).json({
      status: "ok",
      data: {
        title: response.text,
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

    const parts = response.candidates[0].content.parts;
    const imagePart = parts.find((part) =>
      part.inlineData?.mimeType?.startsWith("image/"),
    );
    const mimeType = imagePart.inlineData.mimeType;
    const imageBase64 = `data:${mimeType};base64,${imagePart.inlineData.data}`;

    io.emit("image", imageBase64);
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

    io.emit("mask", result.data.image.url);
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

app.post("/print-tsukumogami", async (req, res) => {
  try {
    const { lines } = req.body;
    await print(lines);
    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Print failed", data: err });
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

    io.emit("model", result.data.model_glb.url);
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

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`http://${ip}:${PORT}`);
});
