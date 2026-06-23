import { useState } from "react";
import { Chat } from "./Chat";
import { Scene } from "./Scene";

function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);

  return (
    <main>
      {showModel ? (
        <Scene modelUrl={modelUrl} />
      ) : (
        <Chat
          setModelUrl={setModelUrl}
          modelUrl={modelUrl}
          setShowModel={setShowModel}
        />
      )}
    </main>
  );
}

export default App;
