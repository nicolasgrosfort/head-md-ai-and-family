import dotenv from "dotenv";
import express from "express";
import ollama from "ollama";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1/",
  apiKey: "ollama", // required but ignored
});

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/generate-image", async (req, res) => {
  const response = await openai.images.generate({
    model: "x/z-image-turbo",
    prompt: "A cute robot learning to paint",
    size: "1024x1024",
    response_format: "b64_json",
  });

  console.log(response);

  res.json({ imageBase64: response.data.b64_json });
});

app.post("/describe", async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "imageBase64 manquant" });
  }

  const response = await ollama.chat({
    model: "qwen3-vl",
    messages: [
      {
        role: "user",
        content: "What is in this image?",
        images: [imageBase64],
      },
    ],
    stream: false,
  });

  console.log(response.message.content);
  res.json({ description: response.message.content });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
