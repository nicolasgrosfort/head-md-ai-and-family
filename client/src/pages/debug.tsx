import { useAtomValue } from "jotai";
import { Model } from "../components/model";
import {
  audioAtom,
  imageAtom,
  maskAtom,
  modelAtom,
  objectAtom,
  objectTitleAtom,
  speechAtom,
  statusAtom,
  storyAtom,
  storyTitleAtom,
} from "../store/atoms";

export const Debug = () => {
  const status = useAtomValue(statusAtom);
  const audio = useAtomValue(audioAtom);
  const speech = useAtomValue(speechAtom);
  const story = useAtomValue(storyAtom);
  const storyTitle = useAtomValue(storyTitleAtom);
  const object = useAtomValue(objectAtom);
  const objectTitle = useAtomValue(objectTitleAtom);
  const image = useAtomValue(imageAtom);
  const mask = useAtomValue(maskAtom);
  const model = useAtomValue(modelAtom);

  return (
    <main className="w-dvw h-dvh flex flex-col gap-4 items-start p-4 overflow-scroll">
      {status && <p>Status: {status}</p>}
      {audio && <audio controls src={URL.createObjectURL(audio)} />}
      {speech && <p>Speech: {speech}</p>}
      {story && <p>Story: {story}</p>}
      {storyTitle && <p>Story Title: {storyTitle}</p>}
      {object && <p>Object: {object}</p>}
      {objectTitle && <p>Object Title: {objectTitle}</p>}
      {image && objectTitle && (
        <img className="w-50 h-50" src={image} alt={objectTitle} />
      )}
      {mask && <img className="w-50 h-50" src={mask} alt="Mask" />}
      {model && (
        <div className="w-50 h-50">
          <Model url={model} />
        </div>
      )}
    </main>
  );
};
