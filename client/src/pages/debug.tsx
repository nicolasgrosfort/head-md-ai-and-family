import { useAtomValue } from "jotai";
import { Model } from "../components/model";
import {
  imageAtom,
  maskAtom,
  modelUrlAtom,
  objectAtom,
  objectTitleAtom,
  speechAtom,
} from "../store/atoms";

export const Debug = () => {
  const speech = useAtomValue(speechAtom);
  const object = useAtomValue(objectAtom);
  const objectTitle = useAtomValue(objectTitleAtom);
  const image = useAtomValue(imageAtom);
  const mask = useAtomValue(maskAtom);
  const modelUrl = useAtomValue(modelUrlAtom);

  return (
    <div className="fixed inset-0 pointer-events-none w-dvw h-dvh flex flex-col gap-4 items-start p-4">
      {speech && <p>Speech: {speech}</p>}
      {object && <p>Object: {object}</p>}
      {objectTitle && <p>Object Title: {objectTitle}</p>}
      {image && objectTitle && (
        <img className="w-50 h-50" src={image} alt={objectTitle} />
      )}
      {mask && <img className="w-50 h-50" src={mask} alt="Mask" />}
      {modelUrl && (
        <div className="w-50 h-50">
          <Model url={modelUrl} />
        </div>
      )}
    </div>
  );
};
