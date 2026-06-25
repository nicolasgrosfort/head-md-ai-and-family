import { useState } from "react";
import { Chat } from "./Chat";
import { Scene } from "./Scene";

function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);

  return (
    <main
      style={{
        width: "600px",
        height: "600px",
        borderRadius: "300px",
        overflow: "hidden",
        border: "2px solid #444",
      }}
    >
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
