import { z } from 'zod';
import { db } from '@/shared/api';

const backupSchema = z.object({
  app: z.literal('brainstorming-tool'),
  version: z.literal(1),
  boards: z.array(
    z.object({ id: z.string(), title: z.string(), createdAt: z.number(), updatedAt: z.number() }),
  ),
  ideas: z.array(
    z.object({
      id: z.string(),
      boardId: z.string(),
      parentId: z.string().nullable(),
      text: z.string(),
      description: z.string().default(''),
      collapsed: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      x: z.number(),
      y: z.number(),
      color: z.number().int().min(0).max(4),
      createdAt: z.number(),
    }),
  ),
  notes: z
    .array(
      z.object({
        id: z.string(),
        boardId: z.string(),
        ideaId: z.string(),
        text: z.string(),
        createdAt: z.number(),
      }),
    )
    .default([]),
  links: z
    .array(
      z.object({
        id: z.string(),
        boardId: z.string(),
        fromId: z.string(),
        toId: z.string(),
        createdAt: z.number(),
      }),
    )
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
