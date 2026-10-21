import { db } from '@/shared/api';
import { createBoard } from '@/features/board-create';
import { exportBackup, importBackup } from './backup';

beforeEach(async () => {
  await db.boards.clear();
  await db.ideas.clear();
});

describe('backup', () => {
  it('round-trips data through export and import', async () => {
    await createBoard('Roundtrip');
    const backup = await exportBackup();
    await db.boards.clear();
    await db.ideas.clear();

    expect(await importBackup(JSON.parse(JSON.stringify(backup)))).toBe(1);
    expect(await db.boards.count()).toBe(1);
    expect(await db.ideas.count()).toBe(1);
  });

  it('rejects invalid files without touching the database', async () => {
    await expect(importBackup({ app: 'other' })).rejects.toThrow();
    expect(await db.boards.count()).toBe(0);
  });
});
