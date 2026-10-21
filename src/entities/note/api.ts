import { useLiveQuery } from 'dexie-react-hooks';
import { db, type NoteRecord } from '@/shared/api';
import { newId } from '@/shared/lib';

export const useIdeaNotes = (ideaId: string): NoteRecord[] | undefined =>
  useLiveQuery(
    async () =>
      (await db.notes.where('ideaId').equals(ideaId).toArray()).sort(
        (a, b) => b.createdAt - a.createdAt,
      ),
    [ideaId],
  );

/** Number of notes per idea on a board, used to badge nodes. */
export const useNoteCounts = (boardId: string): Record<string, number> | undefined =>
  useLiveQuery(async () => {
    const counts: Record<string, number> = {};
    await db.notes
      .where('boardId')
      .equals(boardId)
      .each((n) => {
        counts[n.ideaId] = (counts[n.ideaId] ?? 0) + 1;
      });
    return counts;
  }, [boardId]);

export const addNote = async (
  boardId: string,
  ideaId: string,
  text: string,
): Promise<NoteRecord> => {
  const note: NoteRecord = { id: newId(), boardId, ideaId, text, createdAt: Date.now() };
  await db.notes.add(note);
  return note;
};

export const updateNote = (id: string, text: string): Promise<number> =>
  db.notes.update(id, { text });

export const removeNote = (id: string): Promise<void> => db.notes.delete(id);
