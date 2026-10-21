import Dexie, { type EntityTable } from 'dexie';

export interface BoardRecord {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface IdeaRecord {
  id: string;
  boardId: string;
  /** `null` marks the root idea of a board. */
  parentId: string | null;
  text: string;
  /** Short description shown in the details panel. */
  description: string;
  x: number;
  y: number;
  /** Index into the idea color palette (see `--idea-N-*` tokens). */
  color: number;
  createdAt: number;
}

/** A free-form note attached to an idea (an idea can have many). */
export interface NoteRecord {
  id: string;
  boardId: string;
  ideaId: string;
  text: string;
  createdAt: number;
}

type BrainstormDB = Dexie & {
  boards: EntityTable<BoardRecord, 'id'>;
  ideas: EntityTable<IdeaRecord, 'id'>;
  notes: EntityTable<NoteRecord, 'id'>;
};

export const db = new Dexie('brainstorming-tool') as BrainstormDB;

// Add a new `db.version(n)` with an `upgrade` step for every schema change.
db.version(1).stores({
  boards: 'id, updatedAt',
  ideas: 'id, boardId, parentId',
});

db.version(2)
  .stores({ notes: 'id, boardId, ideaId' })
  .upgrade((tx) =>
    tx
      .table('ideas')
      .toCollection()
      .modify((idea) => {
        idea.description = '';
      }),
  );
