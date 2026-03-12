import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { PushToTalk } from "../components/push-to-talk";
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
import {
  imageToMask,
  maskToModel,
  objectToImage,
  objectToTitle,
  speechToText,
  storyToTitle,
  textToObject,
  textToStory,
} from "../utils/endpoints";

export const Record = () => {
  const setAudioBlob = useSetAtom(audioAtom);
  const setSpeech = useSetAtom(speechAtom);
  const setObject = useSetAtom(objectAtom);
  const setObjectTitle = useSetAtom(objectTitleAtom);
  const setImage = useSetAtom(imageAtom);
  const setMask = useSetAtom(maskAtom);
  const setModel = useSetAtom(modelAtom);
  const setStatus = useSetAtom(statusAtom);
  const setStory = useSetAtom(storyAtom);
  const setStoryTitle = useSetAtom(storyTitleAtom);

  const handleAudioBlobChange = useCallback(
    async (nextAudioBlob: Blob | null) => {
      setAudioBlob(nextAudioBlob);

      if (nextAudioBlob) {
        try {
          setStatus("Listening");
          console.log("Audio blob updated:", nextAudioBlob);

          const { text } = await speechToText(nextAudioBlob);
          console.log("Speech to text result:", text);
          setSpeech(text);

          setStatus("Processing");
          console.log("Processing started for text:", text);

          const { story } = await textToStory(text);
          console.log("Text to story result:", story);
          setStory(story);

          const { title: storyTitle } = await storyToTitle(story);
          console.log("Story to title result:", storyTitle);
          setStoryTitle(storyTitle);

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

          setStatus(null);
          console.log("Processing completed, model is ready:", model);
        } catch (error) {
          console.error("Error during processing:", error);
          setStatus("Error");
        }
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
      setStatus,
      setStory,
      setStoryTitle,
    ],
  );

  return (
    <main className="w-dvw h-dvh flex items-center justify-center text-3xl">
      <PushToTalk onAudioBlobChange={handleAudioBlobChange} />
    </main>
  );
};
