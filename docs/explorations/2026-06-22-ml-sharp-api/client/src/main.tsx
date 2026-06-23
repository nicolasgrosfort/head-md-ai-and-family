import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import { Chat } from "./Chat.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  </BrowserRouter>,
);
