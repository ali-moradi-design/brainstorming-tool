import { create } from 'zustand';

type SelectionState = {
  selectedId: string | null;
  editingId: string | null;
  /** Bumped by the outline so the canvas can pan to `focus.id`. */
  focus: { id: string; n: number } | null;
  select: (id: string | null) => void;
  edit: (id: string | null) => void;
  focusIdea: (id: string) => void;
  reset: () => void;
};

/** Selection is shared by the canvas, the outline in the sidebar and the details panel. */
export const useSelection = create<SelectionState>((set) => ({
  selectedId: null,
  editingId: null,
  focus: null,
  select: (selectedId) => set({ selectedId }),
  edit: (editingId) => set({ editingId }),
  focusIdea: (id) => set((s) => ({ selectedId: id, focus: { id, n: (s.focus?.n ?? 0) + 1 } })),
  reset: () => set({ selectedId: null, editingId: null, focus: null }),
}));
