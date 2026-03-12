import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { PushToTalk } from "../components/push-to-talk";
import {
  audioBlobAtom,
  imageAtom,
  maskAtom,
  modelUrlAtom,
  objectAtom,
  objectTitleAtom,
  speechAtom,
} from "../store/atoms";
import {
  imageToMask,
  maskToModel,
  objectToImage,
  objectToTitle,
  speechToText,
  textToObject,
} from "../utils/endpoints";

export const Record = () => {
  const setAudioBlob = useSetAtom(audioBlobAtom);
  const setSpeech = useSetAtom(speechAtom);
  const setObject = useSetAtom(objectAtom);
  const setObjectTitle = useSetAtom(objectTitleAtom);
  const setImage = useSetAtom(imageAtom);
  const setMask = useSetAtom(maskAtom);
  const setModel = useSetAtom(modelUrlAtom);

  const handleAudioBlobChange = useCallback(
    async (nextAudioBlob: Blob | null) => {
      setAudioBlob(nextAudioBlob);

      if (nextAudioBlob) {
        console.log("Audio blob updated:", nextAudioBlob);

        const { text } = await speechToText(nextAudioBlob);
        console.log("Speech to text result:", text);
        setSpeech(text);

        const { object } = await textToObject(text);
        console.log("Text to object result:", object);
        setObject(object);

        const { title: objectTitle } = await objectToTitle(object);
        console.log("Object to title result:", objectTitle);
        setObjectTitle(objectTitle);

        const { image } = await objectToImage(object);
        console.log("Object to image result:", image);
        setImage(image);

        const { mask } = await imageToMask(image);
        console.log("Image to mask result:", mask);
        setMask(mask);

        const { model } = await maskToModel(mask, objectTitle);
        console.log("Mask to model result:", model);
        setModel(model);
      }
    },
    [
      setAudioBlob,
      setSpeech,
      setObject,
      setObjectTitle,
      setImage,
      setMask,
      setModel,
    ],
  );

  return (
    <main className="w-dvw h-dvh flex items-center justify-center text-3xl">
      <PushToTalk onAudioBlobChange={handleAudioBlobChange} />
    </main>
  );
};
