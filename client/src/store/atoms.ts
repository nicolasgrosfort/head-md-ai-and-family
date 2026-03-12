import { atom } from "jotai";
import { DEFAULT_MODEL_URL } from "../utils/config";

const audioBlobAtom = atom<Blob | null>(null);
const speechAtom = atom<string | null>(null);
const objectAtom = atom<string | null>(null);
const modelUrlAtom = atom<string | null>(DEFAULT_MODEL_URL);

export { audioBlobAtom, modelUrlAtom, objectAtom, speechAtom };
