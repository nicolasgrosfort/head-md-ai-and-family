import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import ollama from "ollama";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, "images", "image.jpg");

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/describe", async (req, res) => {
  const imageBase64 = fs.readFileSync(imagePath).toString("base64");
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
