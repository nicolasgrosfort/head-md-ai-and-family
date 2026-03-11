import { useAtom } from "jotai";
import { useState } from "react";
import { PushToTalk } from "./components/push-to-talk.tsx";
import { audio } from "./data/audio.ts";
import { audioBlobAtom } from "./store/atoms.ts";

function App() {
  const [audioBlob] = useAtom(audioBlobAtom);
  const [response, setResponse] = useState<string | null>(null);

  const handleClick = async () => {
    const res = await fetch("http://macbook-pro-de-nicolas.local:3000/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio: audio.base64 }),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <>
      <div>
        <PushToTalk />
      </div>
      <div>
        <button onClick={handleClick}>Appeler /test</button>
        {response && <pre>{response}</pre>}
      </div>
      <hr />
      {audioBlob && (
        <div>
          <p>Preview recording:</p>
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </div>
      )}
    </>
  );
}

export default App;
