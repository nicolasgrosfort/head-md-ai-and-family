import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Debug } from "./pages/debug.tsx";
import { Home } from "./pages/home.tsx";
import { Record } from "./pages/record.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/record" element={<Record />} />
        <Route path="/debug" element={<Debug />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
