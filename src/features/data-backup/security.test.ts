import { db } from '@/shared/api';
import { importBackup } from './backup';

const idea = (over: Record<string, unknown> = {}) => ({
  id: 'i1',
  boardId: 'b1',
  parentId: null,
  text: 'ok',
  x: 0,
  y: 0,
  color: 0,
  createdAt: 1,
  ...over,
});
const backup = (over: Record<string, unknown> = {}) => ({
  app: 'brainstorming-tool',
  version: 1,
  boards: [{ id: 'b1', title: 'T', createdAt: 1, updatedAt: 1 }],
  ideas: [idea()],
  ...over,
});

beforeEach(async () => {
  await Promise.all([db.boards.clear(), db.ideas.clear(), db.notes.clear(), db.links.clear()]);
});

describe('backup import hardening', () => {
  it.each([
    ['an oversized text', backup({ ideas: [idea({ text: 'x'.repeat(501) })] })],
    ['an oversized description', backup({ ideas: [idea({ description: 'x'.repeat(20_001) })] })],
    ['a color outside the palette', backup({ ideas: [idea({ color: 99 })] })],
    ['non-finite coordinates', backup({ ideas: [idea({ x: 1e12 })] })],
    ['an overlong id', backup({ ideas: [idea({ id: 'x'.repeat(65) })] })],
    ['too many tags', backup({ ideas: [idea({ tags: Array(31).fill('t') })] })],
    ['wrong field types', backup({ ideas: [idea({ text: { $ne: null } })] })],
    ['a foreign app marker', { ...backup(), app: 'other' }],
    ['a non-object payload', 'drop table'],
    ['null', null],
  ])('rejects %s and writes nothing', async (_, payload) => {
    await expect(importBackup(payload)).rejects.toThrow();
    expect(await db.ideas.count()).toBe(0);
    expect(await db.boards.count()).toBe(0);
  });

  it('strips unknown and prototype-polluting keys', async () => {
    const raw = JSON.parse(
      '{"app":"brainstorming-tool","version":1,"__proto__":{"polluted":true},"boards":[],"ideas":[{"id":"i1","boardId":"b1","parentId":null,"text":"t","x":0,"y":0,"color":0,"createdAt":1,"constructor":{"prototype":{"polluted":true}},"extra":"x"}]}',
    );
    await importBackup(raw);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(await db.ideas.get('i1')).not.toHaveProperty('extra');
  });

  it('stores markup as inert text', async () => {
    const payload = '<img src=x onerror=alert(1)><script>alert(2)</script>';
    await importBackup(backup({ ideas: [idea({ text: payload })] }));
    expect((await db.ideas.get('i1'))?.text).toBe(payload);
  });
});
