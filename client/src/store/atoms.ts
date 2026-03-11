import { atom } from "jotai";

const audioBlobAtom = atom<Blob | null>(null);

export { audioBlobAtom };
