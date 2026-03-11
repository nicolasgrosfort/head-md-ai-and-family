import cors from "cors";
import express from "express";
import os from "os";

const hostname = os.hostname();
const app = express();
const PORT = 3000;

//   await fal.config({
//     apiKey:
//       "ed3171f3-6338-4853-a827-49b60822a802:cbba78d2e33b5670fb722a76f55a5ce2",
//   });

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/test", async (req, res) => {
  try {
    const { audio } = req.body;

    console.log("audio received length:", audio.length);

    // const result = await fal.subscribe("fal-ai/speech-to-text", {
    //   input: {
    //     audio_url: audio,
    //   },
    //   logs: true,
    // });

    res.json({
      status: "ok",
      length: audio.length,
      //   text: result.data.output.
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
