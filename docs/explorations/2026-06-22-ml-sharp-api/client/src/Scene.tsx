import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { PLYLoader } from "three/examples/jsm/Addons.js";
import { useFloatingPLY } from "./hooks/useFloatingPLY";

export const Scene = ({ modelUrl }: { modelUrl?: string | null }) => {
  return (
    <Canvas>
      <color attach="background" args={["#000000"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={50} />
      <Suspense fallback={null}>
        {modelUrl && <Model url={modelUrl} />}
      </Suspense>
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
