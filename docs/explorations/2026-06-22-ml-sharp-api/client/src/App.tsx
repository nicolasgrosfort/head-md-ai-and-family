import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useCallback, useState } from "react";
import { PLYLoader } from "three/examples/jsm/Addons.js";
import "./App.css";
import { useFloatingPLY } from "./hooks/useFloatingPLY";

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

function App() {
  const [plyUrl, setPlyUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("ratio", "0.5");
        formData.append("rx", "180");
        formData.append("ry", "0");
        formData.append("rz", "0");

        const response = await fetch("http://localhost:8000/process", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail ?? "Erreur serveur");
        }

        // Libérer l'ancienne URL blob si elle existe
        if (plyUrl) URL.revokeObjectURL(plyUrl);

        const blob = await response.blob();
        setPlyUrl(URL.createObjectURL(blob));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    },
    [plyUrl],
  );

  return (
    <main>
      <div style={{ position: "absolute", zIndex: 10, padding: "1rem" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={loading}
        />
        {loading && <p>Traitement en cours...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <color attach="background" args={["#000000"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={50} />
        <OrbitControls />
        <Suspense fallback={null}>{plyUrl && <Model url={plyUrl} />}</Suspense>
      </Canvas>
    </main>
  );
}

export default App;
