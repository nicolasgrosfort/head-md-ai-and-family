import { Canvas } from "@react-three/fiber";
import { useAtom } from "jotai";
import { Suspense } from "react";
import { Model } from "../components/model.tsx";
import { modelUrlAtom } from "../store/atoms.ts";

export const Home = () => {
  const [modelUrl] = useAtom(modelUrlAtom);

  // const generate = async () => {
  //   try {
  //     setStatus("Object to image processing...");

  //     const resObjectToImage = await fetch("/api/object-to-image", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         prompt:
  //           "Un ours en peluche, un peu sale, raccommodé sur le nez et avec une oreille cassée. Il est bleu et rouge, et il lui manque un œil. Il est en position assise.",
  //       }),
  //     });

  //     if (!resObjectToImage.ok)
  //       throw new Error(`object-to-image failed: ${resObjectToImage.status}`);

  //     const {
  //       data: { mimeType, image },
  //     } = await resObjectToImage.json();

  //     setImageBase64(`data:${mimeType};base64,${image}`);
  //     setStatus("Background image removing...");

  //     const resRemoveBackgroundImage = await fetch(
  //       "/api/remove-background-image",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           image: `data:${mimeType};base64,${image}`,
  //         }),
  //       },
  //     );

  //     if (!resRemoveBackgroundImage.ok)
  //       throw new Error(
  //         `remove-background-image failed: ${resRemoveBackgroundImage.status}`,
  //       );

  //     const {
  //       data: { imageUrl },
  //     } = await resRemoveBackgroundImage.json();
  //     setImageBase64(imageUrl);

  //     setStatus("Image to model processing...");

  //     const resImageToModel = await fetch("/api/image-to-model", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         image: imageUrl,
  //       }),
  //     });

  //     const { data } = await resImageToModel.json();

  //     setModelUrl(data.model_glb.url);
  //     setStatus("ready");
  //   } catch (err) {
  //     console.error(err);
  //     setStatus(`Erreur : ${err instanceof Error ? err.message : "inconnue"}`);
  //   }
  // };

  return (
    <main className="w-dvw h-dvh pointer-events-none">
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
            color="#ffff00"
          />
          <directionalLight
            position={[0, -5, 0]} // y- dessous
            intensity={1}
            color="#ff00ff"
          />
          {modelUrl && <Model url={modelUrl} />}
        </Suspense>
      </Canvas>
    </main>
  );
};
