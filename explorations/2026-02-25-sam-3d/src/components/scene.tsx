import PlaceViewer from "@/components/place-viewer";
import { Place } from "@/utils/types";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

type SceneProps = {
  place?: Place;
  isSoundOn: boolean;
};

export const Scene = ({ place, isSoundOn }: SceneProps) => {
  if (!place) return null;

  return (
    <Canvas className="touch-none">
      <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={50} />
      <PlaceViewer isSoundOn={isSoundOn} place={place} />
    </Canvas>
  );
};
