"use client";

import { Place } from "@/utils/types";
import { OrbitControls, PositionalAudio } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { PLYLoader } from "three/examples/jsm/Addons.js";

type PlaceViewerProps = {
  place: Place;
  isSoundOn: boolean;
};

export default function PlaceViewer({ place, isSoundOn }: PlaceViewerProps) {
  const geometry = useLoader(PLYLoader, place.model);

  return (
    <>
      <OrbitControls />
      <group position={place.position}>
        <points geometry={geometry}>
          <pointsMaterial size={place.size} vertexColors />
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
