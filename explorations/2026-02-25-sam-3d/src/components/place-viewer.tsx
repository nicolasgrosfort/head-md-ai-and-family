"use client";

import { Place } from "@/utils/types";
import { OrbitControls, PositionalAudio } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { PLYLoader } from "three/examples/jsm/Addons.js";

type PlaceViewerProps = {
  place: Place;
  isSoundOn: boolean;
};

export default function PlaceViewer({ place, isSoundOn }: PlaceViewerProps) {
  const geometry = useLoader(PLYLoader, place.model);
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <>
      <OrbitControls />
      <group
        ref={groupRef}
        position={place.position}
        rotation={[Math.PI, 0, 0]}
      >
        <points geometry={geometry}>
          <pointsMaterial size={place.size} color={"white"} />
        </points>
        {place.audio && isSoundOn && (
          <PositionalAudio
            key={place.audio}
            url={place.audio}
            distance={1}
            autoplay
            loop
          />
        )}
      </group>
    </>
  );
}
