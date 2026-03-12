import { atom } from "jotai";

const isConnectedAtom = atom(false);
const statusAtom = atom<string | null>(null);

const audioAtom = atom<Blob | null>(null);
const speechAtom = atom<string | null>(null);
const objectAtom = atom<string | null>(null);
const imageAtom = atom<string | null>(null);
const maskAtom = atom<string | null>(null);
const objectTitleAtom = atom<string | null>(null);
const modelAtom = atom<string | null>(null);

export {
  audioAtom,
  imageAtom,
  isConnectedAtom,
  maskAtom,
  modelAtom,
  objectAtom,
  objectTitleAtom,
  speechAtom,
  statusAtom,
};
