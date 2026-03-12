import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { PushToTalk } from "../components/push-to-talk";
import { audioBlobAtom, objectAtom, speechAtom } from "../store/atoms";
import { speechToText, textToObject } from "../utils/endpoints";

export const Record = () => {
  const setAudioBlob = useSetAtom(audioBlobAtom);
  const setSpeech = useSetAtom(speechAtom);
  const setObject = useSetAtom(objectAtom);

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
      }
    },
    [setAudioBlob, setSpeech, setObject],
  );

  return (
    <main className="w-dvw h-dvh flex items-center justify-center text-3xl">
      <PushToTalk onAudioBlobChange={handleAudioBlobChange} />
    </main>
  );
};
