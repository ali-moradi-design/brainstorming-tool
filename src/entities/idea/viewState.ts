import { create } from 'zustand';

export type BoardView = 'map' | 'list';

type ViewState = {
  view: BoardView;
  /** An idea must carry all of these tags to stay highlighted. */
  tagFilter: string[];
  /** While true, clicking an idea links it to the selected idea. */
  linkMode: boolean;
  setView: (view: BoardView) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  setLinkMode: (on: boolean) => void;
};

export const useViewState = create<ViewState>((set) => ({
  view: 'map',
  tagFilter: [],
  linkMode: false,
  setView: (view) => set({ view }),
  toggleTag: (tag) =>
    set((s) => ({
      tagFilter: s.tagFilter.includes(tag)
        ? s.tagFilter.filter((t) => t !== tag)
        : [...s.tagFilter, tag],
    })),
  clearTags: () => set({ tagFilter: [] }),
  setLinkMode: (linkMode) => set({ linkMode }),
}));

export const matchesTags = (ideaTags: string[], filter: string[]): boolean =>
  filter.every((t) => ideaTags.includes(t));

export const allTags = (ideas: { tags: string[] }[]): string[] =>
  [...new Set(ideas.flatMap((i) => i.tags))].sort((a, b) => a.localeCompare(b));
