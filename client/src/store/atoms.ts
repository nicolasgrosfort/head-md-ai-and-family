import { atom } from "jotai";
import { DEFAULT_MODEL_URL } from "../utils/config";

const isConnectedAtom = atom(false);
const statusAtom = atom<string | null>(null);

const audioAtom = atom<Blob | null>(null);
const storyAtom = atom<string | null>(null);
const storyTitleAtom = atom<string | null>(null);
const speechAtom = atom<string | null>(null);
const objectAtom = atom<string | null>(null);
const imageAtom = atom<string | null>(null);
const maskAtom = atom<string | null>(null);
const objectTitleAtom = atom<string | null>(null);
const modelAtom = atom<string | null>(DEFAULT_MODEL_URL);

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
  storyAtom,
  storyTitleAtom,
};
