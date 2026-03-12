import { atom } from "jotai";

const audioBlobAtom = atom<Blob | null>(null);
const speechAtom = atom<string | null>(null);
const objectAtom = atom<string | null>(null);
const imageAtom = atom<string | null>(null);
const maskAtom = atom<string | null>(null);
const objectTitleAtom = atom<string | null>(null);
const modelUrlAtom = atom<string | null>(null);

export {
  audioBlobAtom,
  imageAtom,
  maskAtom,
  modelUrlAtom,
  objectAtom,
  objectTitleAtom,
  speechAtom,
};
