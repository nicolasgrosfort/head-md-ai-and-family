import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
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
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHolding, setIsHolding] = useState(false);

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
    trigger("selection");
    setIsHolding(true);

    holdTimerRef.current = setTimeout(() => {
      startRecording();
      trigger("selection");
      if (onStartRecording) onStartRecording();
    }, 1000);
  };

  const handleMouseUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);

    if (isRecording) {
      stopRecording();
      trigger("selection");
      if (onStopRecording) onStopRecording();
    }
  };

  if (status === "Ready") return;

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className="w-full h-full bg-red-800 font-bold font-mono cursor-pointer select-none border active:scale-95 disabled:opacity-60 relative"
      disabled={!isReady}
    >
      {status
        ? status
        : isReady
          ? isRecording
            ? "Recording..."
            : "REC"
          : "Initializing..."}

      {!isRecording && (
        <span
          className={`absolute top-0 left-0 bg-red-600 block h-full transition-all duration-1000 ${isHolding ? "w-full" : "w-0"} -z-10`}
        ></span>
      )}
    </button>
  );
};
