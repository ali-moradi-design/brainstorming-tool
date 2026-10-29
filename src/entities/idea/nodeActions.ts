import { createContext } from 'react';

/** What an idea node can ask the canvas to do. Provided once, so nodes never re-render for it. */
export type IdeaNodeActions = {
  toggleCollapse: (id: string, collapsed: boolean) => void;
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  commit: (id: string, text: string, previous: string) => void;
};

const noop = () => {};

export const IdeaNodeActionsContext = createContext<IdeaNodeActions>({
  toggleCollapse: noop,
  startEdit: noop,
  cancelEdit: noop,
  commit: noop,
});
