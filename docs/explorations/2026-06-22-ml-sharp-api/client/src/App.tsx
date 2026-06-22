import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { PLYLoader } from "three/examples/jsm/Addons.js";
import "./App.css";
import { useFloatingPLY } from "./hooks/useFloatingPLY";

function Model() {
  const geometry = useLoader(PLYLoader, "/yiayia.ply");
  const { ref, material } = useFloatingPLY(geometry, {
    amplitude: { x: 0.05, y: 0.05, z: 0.05 },
    speed: 0.025,
    scale: 1.0,
    appearDuration: 10.0,
    appearScale: 500,
    pointSize: 0.25,
  });

  return <points ref={ref} geometry={geometry} material={material.current} />;
}

function App() {
  return (
    <main>
      <Suspense fallback={<p>Loading...</p>}>
        <Canvas>
          <color attach="background" args={["#000000"]} />
          <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={50} />
          <Model />
        </Canvas>
      </Suspense>
    </main>
  );
}

export default App;
