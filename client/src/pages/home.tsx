import { useAtom } from "jotai";
import { Model } from "../components/model.tsx";
import { modelAtom } from "../store/atoms.ts";

export const Home = () => {
  const [modelUrl] = useAtom(modelAtom);

  return (
    <main className="w-dvw h-dvh pointer-events-none">
      <Model url={modelUrl} />
    </main>
  );
};
