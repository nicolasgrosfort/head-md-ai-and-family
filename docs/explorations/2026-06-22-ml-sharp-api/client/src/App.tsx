import { useState } from "react";
import { Chat } from "./Chat";
import { Scene } from "./Scene";

function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  return (
    <main>
      {modelUrl ? (
        <Scene modelUrl={modelUrl} />
      ) : (
        <Chat setModelUrl={setModelUrl} />
      )}
    </main>
  );
}

export default App;
