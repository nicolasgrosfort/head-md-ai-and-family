import { useEffect, useState } from "react";
import { useAudioRecorder } from "./hooks/useAudioRecorder";

export const Whisper = () => {
  const { isRecording, isReady, audioBlob, startRecording, stopRecording } =
    useAudioRecorder(240);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://localhost:8001/health")
      .then((r) => r.json())
      .then(console.log);
  }, []);

  //   async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
  //     const file = e.target.files?.[0];
  //     if (!file) return;

  //     const form = new FormData();
  //     form.append("file", file);

  //     const res = await fetch("http://localhost:8001/transcribe", {
  //       method: "POST",
  //       body: form,
  //     });
  //     const data = await res.json();
  //     setText(data.text);
  //   }

  useEffect(() => {
    if (!audioBlob) return;

    const form = new FormData();
    form.append("file", audioBlob, "audio.mp4");

    console.log("Sending audio blob to server:", audioBlob);

    fetch("http://localhost:8001/transcribe", {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((data) => {
        setText(data.text);
      });
  }, [audioBlob]);

  if (!isReady) return <p>Loading...</p>;

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isReady || e.repeat) return; // ← e.repeat évite les répétitions
        if (e.key === " ") startRecording();
      }}
      onKeyUp={(e) => {
        if (!isReady) return;
        if (e.key === " ") stopRecording();
      }}
    >
      <h1>Whisper</h1>
      <p>Press "r" to start/stop recording</p>
      <p>{isRecording ? "Recording..." : "Not recording"}</p>
      {/* <input type="file" accept="audio/*" onChange={handleFile} /> */}
      <p>{text}</p>
    </div>
  );
};
