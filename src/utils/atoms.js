import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const savedDrawingAtom = atomWithStorage(undefined);
export const userAtom = atomWithStorage({});
export const pendingDrawingAtom = atomWithStorage(false);
