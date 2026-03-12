import { useAtomValue } from "jotai";
import { maskAtom, storyAtom, storyTitleAtom } from "../store/atoms";
import { printTsukumogami } from "../utils/endpoints";

export const Print = () => {
  const storyTitle = useAtomValue(storyTitleAtom);
  const story = useAtomValue(storyAtom);
  const mask = useAtomValue(maskAtom);

  const readyToPrint = storyTitle && story && mask;

  return (
    <main className="h-dvh w-dvw flex items-center justify-center">
      {readyToPrint ? (
        <button
          className="text-3xl font-mono font-bold cursor-pointer"
          onClick={async () => {
            printTsukumogami([
              {
                type: "image",
                path: mask,
              },
              { type: "newline", count: 2 },
              {
                type: "text",
                content: storyTitle,
                bold: true,
              },
              { type: "newline", count: 1 },
              {
                type: "text",
                content: story,
              },
            ]);
          }}
        >
          PRINT
        </button>
      ) : (
        <p className="text-xl font-mono">Share a memory to enable printing</p>
      )}
    </main>
  );
};
