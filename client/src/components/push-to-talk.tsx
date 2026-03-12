import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { statusAtom } from "../store/atoms";

type PushToTalkProps = {
  onAudioBlobChange?: (blob: Blob | null) => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
};

export const PushToTalk = ({
  onAudioBlobChange,
  onStartRecording,
  onStopRecording,
}: PushToTalkProps) => {
  const status = useAtomValue(statusAtom);
  const { trigger } = useWebHaptics({ debug: true });
  const { isRecording, isReady, audioBlob, startRecording, stopRecording } =
    useAudioRecorder(240);

  useEffect(() => {
    if (onAudioBlobChange) {
      onAudioBlobChange(audioBlob);
    }
  }, [audioBlob, onAudioBlobChange]);

  const handleMouseDown = () => {
    startRecording();
    trigger("selection");

    if (onStartRecording) {
      onStartRecording();
    }
  };

  const handleMouseUp = () => {
    stopRecording();
    trigger("selection");

    if (onStopRecording) {
      onStopRecording();
    }
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className="w-full h-full bg-red-700 text-white font-bold font-mono cursor-pointer select-none active:scale-95 disabled:opacity-60"
      disabled={!isReady || !!status}
    >
      {status
        ? status
        : isReady
          ? isRecording
            ? "Recording..."
            : "Push to Talk"
          : "Initializing..."}
    </button>
  );
};
