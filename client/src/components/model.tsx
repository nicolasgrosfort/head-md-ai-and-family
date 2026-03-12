import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

export const GLTF = ({ url }: { url: string }) => {
  const refGroup = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (refGroup.current) {
      refGroup.current.rotation.y += 0.005;
      refGroup.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={refGroup}>
      <primitive object={scene} />
    </group>
  );
};

export const Model = ({ url }: { url: string | null }) => {
  return (
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
        {url && <GLTF url={url} />}
      </Suspense>
    </Canvas>
  );
};
