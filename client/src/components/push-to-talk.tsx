import { useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

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
  const { isRecording, isReady, audioBlob, startRecording, stopRecording } =
    useAudioRecorder(240);
  const { trigger } = useWebHaptics({ debug: true });

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
      className="w-full h-full bg-red-700 text-white font-bold font-mono cursor-pointer select-none active:scale-95"
      disabled={!isReady}
    >
      {isReady
        ? isRecording
          ? "Recording..."
          : "Push to Talk"
        : "Initializing..."}
    </button>
  );
};
