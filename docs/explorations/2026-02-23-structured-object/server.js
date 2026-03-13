import express from "express";
import ollama from "ollama";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const Analyser = z.object({
  isHat: z.boolean(),
});

const analyserSchema = {
  type: "object",
  properties: {
    isHat: { type: "boolean" },
  },
  required: ["isHat"],
};

app.get("/is-hat", async (req, res) => {
  const response = await ollama.chat({
    model: "gpt-oss",
    messages: [
      { role: "user", content: "Decide randomly if there is an hat or not." },
    ],
    format: analyserSchema,
  });

  const analyser = Analyser.parse(JSON.parse(response.message.content));
  console.log(analyser);
  res.json({ isHat: analyser.isHat });
});

const PORT = 3100;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
