import { useAtom } from "jotai";
import { Model } from "../components/model.tsx";
import { modelUrlAtom } from "../store/atoms.ts";

export const Home = () => {
  const [modelUrl] = useAtom(modelUrlAtom);

  return (
    <main className="w-dvw h-dvh pointer-events-none">
      <Model url={modelUrl} />
    </main>
  );
};
