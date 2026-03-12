import { printTsukumogami } from "../utils/endpoints";

export const Print = () => {
  return (
    <main className="h-dvh w-dvw flex items-center justify-center">
      <button
        className="text-3xl font-mono font-bold cursor-pointer"
        onClick={async () => {
          printTsukumogami(["Line 1", "Line 2", "Line 3"]);
        }}
      >
        PRINT
      </button>
    </main>
  );
};
