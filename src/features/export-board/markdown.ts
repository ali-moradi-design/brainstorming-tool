import { buildOutline } from '@/entities/idea';
import { db } from '@/shared/api';

/** Renders a board as Markdown: an outline of ideas with their descriptions, tags and notes. */
export const boardToMarkdown = async (boardId: string): Promise<string> => {
  const board = await db.boards.get(boardId);
  const ideas = (await db.ideas.where('boardId').equals(boardId).toArray()).sort(
    (a, b) => a.createdAt - b.createdAt,
  );
  const notes = await db.notes.where('boardId').equals(boardId).toArray();
  const links = await db.links.where('boardId').equals(boardId).toArray();
  const text = new Map(ideas.map((i) => [i.id, i.text]));
  const lines: string[] = [`# ${board?.title ?? ''}`, ''];

  for (const { idea, depth } of buildOutline(ideas)) {
    const tags = idea.tags.map((t) => ` #${t}`).join('');
    lines.push(`${'  '.repeat(depth)}- **${idea.text}**${tags}`);
    const pad = '  '.repeat(depth + 1);
    if (idea.description) lines.push(`${pad}${idea.description.replace(/\n+/g, ` `)}`);
    for (const note of notes
      .filter((n) => n.ideaId === idea.id)
      .sort((a, b) => a.createdAt - b.createdAt))
      lines.push(`${pad}- _Note:_ ${note.text.replace(/\n+/g, ' ')}`);
    for (const link of links.filter((l) => l.fromId === idea.id))
      lines.push(`${pad}- _Related:_ ${text.get(link.toId) ?? ''}`);
  }
  return `${lines.join('\n')}\n`;
};
