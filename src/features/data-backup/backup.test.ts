import { db } from '@/shared/api';
import { addNote } from '@/entities/note';
import { createBoard } from '@/features/board-create';
import { exportBackup, importBackup } from './backup';

beforeEach(async () => {
  await db.boards.clear();
  await db.ideas.clear();
});

describe('backup', () => {
  it('round-trips data through export and import', async () => {
    const boardId = await createBoard('Roundtrip');
    const [root] = await db.ideas.where('boardId').equals(boardId).toArray();
    await addNote(boardId, root.id, 'a note');
    const backup = await exportBackup();
    await db.boards.clear();
    await db.ideas.clear();

    expect(await importBackup(JSON.parse(JSON.stringify(backup)))).toBe(1);
    expect(await db.boards.count()).toBe(1);
    expect(await db.ideas.count()).toBe(1);
    expect(await db.notes.count()).toBe(1);
  });

  it('accepts backups made before notes and descriptions existed', async () => {
    const old = {
      app: 'brainstorming-tool',
      version: 1,
      boards: [{ id: 'b', title: 'Old', createdAt: 1, updatedAt: 1 }],
      ideas: [
        { id: 'i', boardId: 'b', parentId: null, text: 'Old', x: 0, y: 0, color: 0, createdAt: 1 },
      ],
    };
    expect(await importBackup(old)).toBe(1);
    expect((await db.ideas.get('i'))?.description).toBe('');
  });

  it('rejects invalid files without touching the database', async () => {
    await expect(importBackup({ app: 'other' })).rejects.toThrow();
    expect(await db.boards.count()).toBe(0);
  });
});
