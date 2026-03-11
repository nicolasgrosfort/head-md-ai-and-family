import { useState } from "react";
import { audio } from "./data/audio.ts";

function App() {
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
      <div></div>
      <div>
        <button onClick={handleClick}>Appeler /test</button>
        {response && <pre>{response}</pre>}
      </div>
    </>
  );
}

export default App;
