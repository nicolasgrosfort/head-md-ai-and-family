import { useAtomValue } from "jotai";
import { useState } from "react";
import { maskAtom, storyAtom, storyTitleAtom } from "../store/atoms";
import { printTsukumogami } from "../utils/endpoints";

export const Print = () => {
  const storyTitle = useAtomValue(storyTitleAtom);
  const story = useAtomValue(storyAtom);
  const mask = useAtomValue(maskAtom);

  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const readyToPrint = storyTitle && story && mask;

  return (
    <main className="h-dvh w-dvw flex items-center justify-center p-4">
      {readyToPrint ? (
        <button
          className="w-full h-full bg-green-800 border text-3xl font-mono font-bold cursor-pointer active:scale-95"
          disabled={isPrinting}
          onClick={async () => {
            setIsPrinting(true);
            await printTsukumogami([
              {
                type: "image",
                path: mask,
              },
              { type: "newline", count: 2 },
              {
                type: "text",
                content: storyTitle,
                bold: true,
                big: true,
                center: true,
              },
              { type: "newline", count: 1 },
              {
                type: "text",
                content: story,
              },
            ]);
            setIsPrinting(false);
          }}
        >
          {isPrinting ? "PRINTING..." : "PRINT"}
        </button>
      ) : (
        <p className="text-xl font-mono">Share a memory to enable printing</p>
      )}
    </main>
  );
};
