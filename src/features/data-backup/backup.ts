import { z } from 'zod';
import { db } from '@/shared/api';

/** Upper bounds so a hostile or corrupt file cannot exhaust memory or fill the database. */
export const MAX_BACKUP_BYTES = 10 * 1024 * 1024;
const id = z.string().min(1).max(64);
const time = z.number().int().nonnegative();
const coord = z.number().min(-1e6).max(1e6);

const backupSchema = z.object({
  app: z.literal('brainstorming-tool'),
  version: z.literal(1),
  boards: z
    .array(z.object({ id, title: z.string().max(200), createdAt: time, updatedAt: time }))
    .max(2_000),
  ideas: z
    .array(
      z.object({
        id,
        boardId: id,
        parentId: id.nullable(),
        text: z.string().max(500),
        description: z.string().max(20_000).default(''),
        collapsed: z.boolean().default(false),
        tags: z.array(z.string().max(48)).max(30).default([]),
        x: coord,
        y: coord,
        color: z.number().int().min(0).max(4),
        createdAt: time,
      }),
    )
    .max(50_000),
  notes: z
    .array(
      z.object({
        id,
        boardId: id,
        ideaId: id,
        text: z.string().max(20_000),
        createdAt: time,
      }),
    )
    .max(50_000)
    .default([]),
  links: z
    .array(
      z.object({
        id,
        boardId: id,
        fromId: id,
        toId: id,
        createdAt: time,
      }),
    )
    .max(50_000)
    .default([]),
});

export type Backup = z.infer<typeof backupSchema>;

export const exportBackup = async (): Promise<Backup> => ({
  app: 'brainstorming-tool',
  version: 1,
  boards: await db.boards.toArray(),
  ideas: await db.ideas.toArray(),
  notes: await db.notes.toArray(),
  links: await db.links.toArray(),
});

/** Merges a backup into the database (same ids are overwritten). Throws on invalid input. */
export const importBackup = async (raw: unknown): Promise<number> => {
  const data = backupSchema.parse(raw);
  await db.transaction('rw', db.boards, db.ideas, db.notes, db.links, async () => {
    await db.boards.bulkPut(data.boards);
    await db.ideas.bulkPut(data.ideas);
    await db.notes.bulkPut(data.notes);
    await db.links.bulkPut(data.links);
  });
  return data.ideas.length;
};
