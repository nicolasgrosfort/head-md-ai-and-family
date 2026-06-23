import { useState } from "react";
import { Chat } from "./Chat";
import { Scene } from "./Scene";

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <main>
      {imageUrl ? (
        <Scene imageBase64={imageUrl} />
      ) : (
        <Chat setImageUrl={setImageUrl} />
      )}
    </main>
  );
}

export default App;
