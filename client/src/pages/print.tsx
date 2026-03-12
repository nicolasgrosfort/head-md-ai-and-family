import { useAtomValue } from "jotai";
import { storyAtom, storyTitleAtom } from "../store/atoms";
import { printTsukumogami } from "../utils/endpoints";

export const Print = () => {
  const storyTitle = useAtomValue(storyTitleAtom);
  const story = useAtomValue(storyAtom);

  const readyToPrint = storyTitle && story;

  return (
    <main className="h-dvh w-dvw flex items-center justify-center">
      {readyToPrint ? (
        <button
          className="text-3xl font-mono font-bold cursor-pointer"
          onClick={async () => {
            printTsukumogami([storyTitle, story]);
          }}
        >
          PRINT
        </button>
      ) : (
        <p className="text-2xl font-mono italic text-gray-500">
          Share a memory to enable printing
        </p>
      )}
    </main>
  );
};
