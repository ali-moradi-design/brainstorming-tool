import { useLiveQuery } from 'dexie-react-hooks';
import { db, type IdeaRecord } from '@/shared/api';
import { newId } from '@/shared/lib';
import { collectSubtree, type Point } from './layout';

const byCreation = (a: IdeaRecord, b: IdeaRecord) =>
  a.createdAt - b.createdAt || (a.id < b.id ? -1 : 1);

export const listIdeas = async (boardId: string): Promise<IdeaRecord[]> =>
  (await db.ideas.where('boardId').equals(boardId).toArray()).sort(byCreation);

export const useIdeas = (boardId: string): IdeaRecord[] | undefined =>
  useLiveQuery(() => listIdeas(boardId), [boardId]);

type NewIdea = Pick<IdeaRecord, 'boardId' | 'parentId' | 'text'> &
  Partial<Pick<IdeaRecord, 'description' | 'x' | 'y' | 'color' | 'tags'>>;

export const addIdea = async (input: NewIdea): Promise<IdeaRecord> => {
  const idea: IdeaRecord = {
    description: '',
    x: 0,
    y: 0,
    color: 0,
    collapsed: false,
    tags: [],
    ...input,
    id: newId(),
    createdAt: Date.now(),
  };
  await db.ideas.add(idea);
  return idea;
};

export const updateIdea = (
  id: string,
  patch: Partial<
    Pick<IdeaRecord, 'text' | 'description' | 'x' | 'y' | 'color' | 'tags' | 'collapsed'>
  >,
): Promise<number> => db.ideas.update(id, patch);

export const moveIdeas = (positions: Map<string, Point>): Promise<unknown> =>
  db.transaction('rw', db.ideas, () =>
    Promise.all([...positions].map(([id, p]) => db.ideas.update(id, p))),
  );

/** Deletes an idea together with all of its descendants. */
export const removeIdeaTree = async (boardId: string, id: string): Promise<void> => {
  const ideas = await listIdeas(boardId);
  const ids = collectSubtree(ideas, id);
  await db.transaction('rw', db.ideas, db.notes, db.links, async () => {
    await db.notes.where('ideaId').anyOf(ids).delete();
    await db.links.where('fromId').anyOf(ids).delete();
    await db.links.where('toId').anyOf(ids).delete();
    await db.ideas.bulkDelete(ids);
  });
};
