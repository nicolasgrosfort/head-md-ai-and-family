import { PerspectiveCamera, PresentationControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { PLYLoader } from "three/examples/jsm/Addons.js";
import "./App.css";

function Model() {
  const result = useLoader(PLYLoader, "/yiayia.ply");

  return (
    <points geometry={result}>
      <pointsMaterial size={0.005} vertexColors />
    </points>
  );
}

function App() {
  return (
    <main>
      <Suspense fallback={<p>Loading...</p>}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={50} />
          <PresentationControls
            enabled
            global
            snap
            polar={[-Math.PI / 2, Math.PI / 2]}
          >
            <Model />
          </PresentationControls>
        </Canvas>
      </Suspense>
    </main>
  );
}

export default App;
