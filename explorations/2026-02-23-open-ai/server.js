import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/joke", async (req, res) => {
  const response = await client.responses.create({
    model: "gpt-4o",
    input: "Génère un haiku au sujet du vibe coding",
  });

  res.json({ joke: response.output_text });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
