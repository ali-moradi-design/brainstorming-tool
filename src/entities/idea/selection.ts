import { create } from 'zustand';

/** Longer than the gap between the two clicks of a typical double-click. */
export const DETAILS_DELAY_MS = 300;

type SelectionState = {
  selectedId: string | null;
  /** Idea shown in the details sheet; follows `selectedId`, sometimes a moment later. */
  detailsId: string | null;
  editingId: string | null;
  /** Bumped by the outline so the canvas can pan to `focus.id`. */
  focus: { id: string; n: number } | null;
  /** Idea to focus once its board has loaded (set by search before navigating). */
  pending: string | null;
  /**
   * `waitForDoubleClick`: opening the sheet shrinks the canvas and moves its toolbar, so the
   * second click of a double-click would hit whatever moved under the pointer. When the sheet
   * is closed, open it only after the double-click window.
   */
  select: (id: string | null, options?: { waitForDoubleClick?: boolean }) => void;
  edit: (id: string | null) => void;
  focusIdea: (id: string) => void;
  setPending: (id: string | null) => void;
  reset: () => void;
};

let detailsTimer: ReturnType<typeof setTimeout> | undefined;

/** Selection is shared by the canvas, the outline in the sidebar and the details panel. */
export const useSelection = create<SelectionState>((set, get) => ({
  selectedId: null,
  detailsId: null,
  editingId: null,
  focus: null,
  pending: null,
  select: (selectedId, options) => {
    clearTimeout(detailsTimer);
    const wait = options?.waitForDoubleClick && selectedId !== null && get().detailsId === null;
    if (!wait) {
      set({ selectedId, detailsId: selectedId });
      return;
    }
    set({ selectedId });
    detailsTimer = setTimeout(() => {
      if (get().selectedId === selectedId) set({ detailsId: selectedId });
    }, DETAILS_DELAY_MS);
  },
  edit: (editingId) => set({ editingId }),
  focusIdea: (id) => {
    clearTimeout(detailsTimer);
    set((s) => ({ selectedId: id, detailsId: id, focus: { id, n: (s.focus?.n ?? 0) + 1 } }));
  },
  setPending: (pending) => set({ pending }),
  reset: () => {
    clearTimeout(detailsTimer);
    set({ selectedId: null, detailsId: null, editingId: null, focus: null });
  },
}));
