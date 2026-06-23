import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";

import "./index.css";
import { Whisper } from "./Whisper.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/whisper" element={<Whisper />} />
    </Routes>
  </BrowserRouter>,
);
