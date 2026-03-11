import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Model = ({ url }: { url: string }) => {
  const refGroup = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (refGroup.current) {
      refGroup.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={refGroup}>
      <primitive object={scene} />
    </group>
  );
};
