import { useAtomValue } from "jotai";
import { useState } from "react";
import {
  maskAtom,
  statusAtom,
  storyAtom,
  storyTitleAtom,
} from "../store/atoms";
import { printTsukumogami } from "../utils/endpoints";

export const PrintButton = () => {
  const status = useAtomValue(statusAtom);
  const storyTitle = useAtomValue(storyTitleAtom);
  const story = useAtomValue(storyAtom);
  const mask = useAtomValue(maskAtom);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const readyToPrint = storyTitle && story && mask;

  if (status !== "Ready") return null;

  return (
    <button
      className="w-full h-full bg-green-800 border text-3xl font-mono font-bold cursor-pointer select-none active:scale-95"
      disabled={isPrinting}
      onClick={async () => {
        if (!readyToPrint) return;
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
  );
};
