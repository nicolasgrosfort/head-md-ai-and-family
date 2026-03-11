import { Canvas } from "@react-three/fiber";
import { useAtom } from "jotai";
import { Suspense, useState } from "react";
import { Model } from "./components/model.tsx";
import { PushToTalk } from "./components/push-to-talk.tsx";
import { audioBlobAtom } from "./store/atoms.ts";
import { blobToBase64 } from "./utils/helpers.ts";
// import { blobToBase64 } from "./utils/helpers.ts";

function App() {
  const [audioBlob] = useAtom(audioBlobAtom);
  const [googleResponse, setGoogleResponse] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(
    "https://v3b.fal.media/files/b/0a91cc0d/MwwnogFgl-Ol6d7xuYIi3_combined_scene.glb",
  );
  const [status, setStatus] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleClick = async () => {
    setStatus("processing");

    if (!audioBlob) return;

    const audioBase64 = await blobToBase64(audioBlob);

    const res = await fetch("/api/speech-to-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio: audioBase64 }),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
    setStatus("ready");
  };

  const generate = async () => {
    try {
      setStatus("Object to image processing...");

      const resObjectToImage = await fetch("/api/object-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            "Un ours en peluche, un peu sale, raccommodé sur le nez et avec une oreille cassée. Il est bleu et rouge, et il lui manque un œil. Il est en position assise.",
        }),
      });

      if (!resObjectToImage.ok)
        throw new Error(`object-to-image failed: ${resObjectToImage.status}`);

      const {
        data: { mimeType, image },
      } = await resObjectToImage.json();

      setImageBase64(`data:${mimeType};base64,${image}`);
      setStatus("Background image removing...");

      const resRemoveBackgroundImage = await fetch(
        "/api/remove-background-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: `data:${mimeType};base64,${image}`,
          }),
        },
      );

      if (!resRemoveBackgroundImage.ok)
        throw new Error(
          `remove-background-image failed: ${resRemoveBackgroundImage.status}`,
        );

      const {
        data: { imageUrl },
      } = await resRemoveBackgroundImage.json();
      setImageBase64(imageUrl);

      setStatus("Image to model processing...");

      const resImageToModel = await fetch("/api/image-to-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageUrl,
        }),
      });

      const { data } = await resImageToModel.json();

      setModelUrl(data.model_glb.url);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus(`Erreur : ${err instanceof Error ? err.message : "inconnue"}`);
    }
  };

  return (
    <main className="flex flex-col gap-4 p-4">
      <div>{status}</div>
      <div>
        <PushToTalk />
      </div>
      <div>
        <button
          onClick={generate}
          className="py-4 px-8 border-2 cursor-pointer"
        >
          Generate
        </button>
      </div>
      {googleResponse && <pre>{googleResponse}</pre>}
      {imageBase64 && (
        <div>
          <p>Generated image from object-to-image:</p>
          <img
            src={imageBase64}
            alt="Generated object"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}

      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
          <Suspense fallback={null}>
            <directionalLight
              position={[0, 5, 5]} // devant
              intensity={4}
              color="#ffffff"
            />

            <directionalLight
              position={[5, 5, 0]} // x+ y+ z=0 -> haut à droite
              intensity={2}
              color="#ff00ff"
            />

            <directionalLight
              position={[-5, 5, 0]} // x- y+ -> haut à gauche
              intensity={2}
              color="#00ffff"
            />

            <directionalLight
              position={[0, 5, -5]} // z- derrière, y+ haut
              intensity={2}
              color="#00ff00"
            />
            {modelUrl && <Model url={modelUrl} />}
          </Suspense>
        </Canvas>
      </div>

      {audioBlob && (
        <>
          <button
            onClick={handleClick}
            className="py-4 px-8 border-2 cursor-pointer"
          >
            Send audio
          </button>
          {response && <pre>{response}</pre>}
          <div>
            <p>Preview recording:</p>
            <audio controls src={URL.createObjectURL(audioBlob)} />
          </div>
        </>
      )}
    </main>
  );
}

export default App;
