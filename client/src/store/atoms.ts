import { atom } from "jotai";

const isConnectedAtom = atom(false);

const audioBlobAtom = atom<Blob | null>(null);
const speechAtom = atom<string | null>(null);
const objectAtom = atom<string | null>(null);
const imageAtom = atom<string | null>(null);
const maskAtom = atom<string | null>(null);
const objectTitleAtom = atom<string | null>(null);
const modelUrlAtom = atom<string | null>(
  "https://v3b.fal.media/files/b/0a91dda9/DT2uTfwxYrYUcVyYMrRE7_combined_scene.glb",
);

export {
  audioBlobAtom,
  imageAtom,
  isConnectedAtom,
  maskAtom,
  modelUrlAtom,
  objectAtom,
  objectTitleAtom,
  speechAtom,
};
