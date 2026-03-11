import { useAtom } from "jotai";
import { useState } from "react";
import { PushToTalk } from "./components/push-to-talk.tsx";
import { audioBlobAtom } from "./store/atoms.ts";
import { blobToBase64 } from "./utils/helpers.ts";

function App() {
  const [audioBlob] = useAtom(audioBlobAtom);
  const [response, setResponse] = useState<string | null>(null);

  const handleClick = async () => {
    if (!audioBlob) return;

    const audioBase64 = await blobToBase64(audioBlob);

    const res = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio: audioBase64 }),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <PushToTalk />
      </div>
      <div>
        <button
          onClick={handleClick}
          className="py-4 px-8 border-2"
          disabled={!audioBlob}
        >
          Send audio
        </button>
        {response && <pre>{response}</pre>}
      </div>
      <hr />
      {audioBlob && (
        <div>
          <p>Preview recording:</p>
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </div>
      )}
    </main>
  );
}

export default App;
