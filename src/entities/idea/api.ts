import { useLiveQuery } from 'dexie-react-hooks';
import { db, type IdeaRecord } from '@/shared/api';
import { newId } from '@/shared/lib';
import { collectSubtree, GAP_X, GAP_Y, type Point } from './layout';

const byCreation = (a: IdeaRecord, b: IdeaRecord) =>
  a.createdAt - b.createdAt || (a.id < b.id ? -1 : 1);

export const listIdeas = async (boardId: string): Promise<IdeaRecord[]> =>
  (await db.ideas.where('boardId').equals(boardId).toArray()).sort(byCreation);

export const useIdeas = (boardId: string): IdeaRecord[] | undefined =>
  useLiveQuery(() => listIdeas(boardId), [boardId]);

type NewIdea = Pick<IdeaRecord, 'boardId' | 'parentId' | 'text'> &
  Partial<Pick<IdeaRecord, 'x' | 'y' | 'color'>>;

export const addIdea = async (input: NewIdea): Promise<IdeaRecord> => {
  const idea: IdeaRecord = { x: 0, y: 0, color: 0, ...input, id: newId(), createdAt: Date.now() };
  await db.ideas.add(idea);
  return idea;
};

/** Default spot for a new child: right of its parent, below existing siblings. */
export const childPosition = (ideas: IdeaRecord[], parent: IdeaRecord): Point => {
  const siblings = ideas.filter((i) => i.parentId === parent.id);
  const y = siblings.length ? Math.max(...siblings.map((s) => s.y)) + GAP_Y : parent.y;
  return { x: parent.x + GAP_X, y };
};

export const updateIdea = (
  id: string,
  patch: Partial<Pick<IdeaRecord, 'text' | 'x' | 'y' | 'color'>>,
): Promise<number> => db.ideas.update(id, patch);

export const moveIdeas = (positions: Map<string, Point>): Promise<unknown> =>
  db.transaction('rw', db.ideas, () =>
    Promise.all([...positions].map(([id, p]) => db.ideas.update(id, p))),
  );

/** Deletes an idea together with all of its descendants. */
export const removeIdeaTree = async (boardId: string, id: string): Promise<void> => {
  const ideas = await listIdeas(boardId);
  await db.ideas.bulkDelete(collectSubtree(ideas, id));
};
