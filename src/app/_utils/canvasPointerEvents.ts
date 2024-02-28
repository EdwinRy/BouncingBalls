import { create } from 'zustand';

interface CanvasPointerStore {
    pointer: { x: number; y: number };
    setPointer: (x: number, y: number) => void;
}

export const useCanvasPointerStore = create<CanvasPointerStore>((set) => ({
    pointer: { x: 0, y: 0 },
    setPointer: (x, y) => set((state) => ({ ...state, pointer: { x, y } }), true),
}));
