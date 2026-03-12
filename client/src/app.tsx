import { useAtomValue } from "jotai";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketSync } from "./components/socket-sync.tsx";
import { Debug } from "./pages/debug.tsx";
import { Home } from "./pages/home.tsx";
import { Record } from "./pages/record.tsx";
import { isConnectedAtom } from "./store/atoms.ts";

export const App = () => {
  const isConnected = useAtomValue(isConnectedAtom);

  return (
    <div className={isConnected ? "" : "bg-red-900"}>
      <SocketSync>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/record" element={<Record />} />
            <Route path="/debug" element={<Debug />} />
          </Routes>
        </BrowserRouter>
      </SocketSync>
    </div>
  );
};
