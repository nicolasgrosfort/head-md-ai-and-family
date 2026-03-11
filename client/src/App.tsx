import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [response, setResponse] = useState<string | null>(null);

  const handleClick = async () => {
    const res = await fetch("http://macbook-pro-de-nicolas.local:3000/test");
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleClick}>Appeler /test</button>
        {response && <pre>{response}</pre>}
      </div>
    </>
  );
}

export default App;
