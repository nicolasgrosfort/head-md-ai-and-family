import express from "express";
import ollama from "ollama";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const Analyser = z.object({
  isHat: z.boolean(),
});

app.post("/is-hat", async (req, res) => {
  const response = await ollama.chat({
    model: "gpt-oss",
    messages: [
      { role: "user", content: "Decide randomly if there is an hat or not." },
    ],
    format: zodToJsonSchema(Analyser),
  });

  const analyser = Analyser.parse(JSON.parse(response.message.content));
  console.log(analyser);
  res.json({ isHat: analyser.isHat });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
