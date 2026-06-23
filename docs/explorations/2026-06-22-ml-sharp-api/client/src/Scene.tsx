import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { PLYLoader } from "three/examples/jsm/Addons.js";
import { generateModel } from "./helpers/modeler";
import { useFloatingPLY } from "./hooks/useFloatingPLY";

export const Scene = ({ imageBase64 }: { imageBase64?: string | null }) => {
  const [plyUrl, setPlyUrl] = useState<string | null>("/yiayia.ply");
  const [, setError] = useState<string | null>(null);
  const [, setGenerating] = useState(false);

  // Déclenché quand imageBase64 change
  useEffect(() => {
    if (!imageBase64) return;

    const run = async () => {
      setGenerating(true);
      setError(null);
      const url = await generateModel(imageBase64);
      console.log("URL du modèle généré :", url);
      if (url) {
        if (plyUrl && plyUrl !== "/yiayia.ply") URL.revokeObjectURL(plyUrl);
        setPlyUrl(url);
      } else {
        setError("Erreur lors de la génération du modèle");
      }
      setGenerating(false);
    };

    run();
  }, [imageBase64, plyUrl]);

  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <color attach="background" args={["#000000"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={50} />
      <OrbitControls minDistance={0.001} maxDistance={1} />
      <Suspense fallback={null}>{plyUrl && <Model url={plyUrl} />}</Suspense>
    </Canvas>
  );
};

function Model({ url }: { url: string }) {
  const geometry = useLoader(PLYLoader, url);
  const { ref, material } = useFloatingPLY(geometry, {
    amplitude: { x: 0.05, y: 0.05, z: 0.05 },
    speed: 0.025,
    scale: 1.0,
    appearDuration: 10.0,
    appearScale: 500,
    pointSize: 1,
  });

  return <points ref={ref} geometry={geometry} material={material.current} />;
}
