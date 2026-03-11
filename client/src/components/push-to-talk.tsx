import { useAtom } from "jotai";
import { useEffect } from "react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { audioBlobAtom } from "../store/atoms";

export const PushToTalk = () => {
  const [, setAudioBlob] = useAtom(audioBlobAtom);
  const { isRecording, audioBlob, startRecording, stopRecording } =
    useAudioRecorder(240);

  useEffect(() => {
    setAudioBlob(audioBlob);
  }, [audioBlob, setAudioBlob]);

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording();
  };

  return (
    <>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-40 h-40 rounded-full bg-red-700 text-white font-bold font-mono cursor-pointer active:bg-red-900"
      >
        {isRecording ? "Recording..." : "Push to Talk"}
      </button>
    </>
  );
};
