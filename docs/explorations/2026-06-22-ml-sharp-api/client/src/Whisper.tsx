import { useEffect, useRef } from "react";
import { useAudioRecorder } from "./hooks/useAudioRecorder";

export const Whisper = ({
  onTranscribeEnd,
  onRecordStart,
  onRecordEnd,
}: {
  onTranscribeEnd: (text: string) => void;
  onRecordEnd?: () => void;
  onRecordStart?: () => void;
}) => {
  const { isRecording, isReady, audioBlob, startRecording, stopRecording } =
    useAudioRecorder(240);

  const onTranscribeEndRef = useRef(onTranscribeEnd);
  const lastAudioBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    onTranscribeEndRef.current = onTranscribeEnd;
  }, [onTranscribeEnd]);

  useEffect(() => {
    fetch("http://localhost:8001/health")
      .then((r) => r.json())
      .then(console.log);
  }, []);

  useEffect(() => {
    if (!audioBlob) return;

    // évite de retraiter exactement le même blob
    if (lastAudioBlobRef.current === audioBlob) return;
    lastAudioBlobRef.current = audioBlob;

    const form = new FormData();
    form.append("file", audioBlob, "audio.mp4");

    fetch("http://localhost:8001/transcribe", {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((data) => {
        onTranscribeEndRef.current(data.text);
      });
  }, [audioBlob]);

  if (!isReady) return null;

  return (
    <div
      tabIndex={0}
      autoFocus
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        width: "100dvw",
        height: "100dvh",
      }}
      onKeyDown={(e) => {
        if (!isReady || e.repeat || isRecording) return;

        if (e.key === " ") {
          e.preventDefault();
          onRecordStart?.();
          startRecording();
        }
      }}
      onKeyUp={(e) => {
        if (!isReady || !isRecording) return;

        if (e.key === " ") {
          e.preventDefault();
          onRecordEnd?.();
          stopRecording();
        }
      }}
    />
  );
};
