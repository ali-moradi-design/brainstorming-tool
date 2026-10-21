import { db } from '@/shared/api';

export type SearchHit = {
  kind: 'board' | 'idea' | 'note';
  boardId: string;
  boardTitle: string;
  ideaId: string | null;
  title: string;
  snippet: string;
};

const MAX_HITS = 30;

const snippetOf = (text: string, q: string): string => {
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text.slice(0, 80);
  const from = Math.max(0, i - 25);
  return (from > 0 ? '…' : '') + text.slice(from, i + q.length + 55);
};

/** Searches project titles, idea text/description/tags and notes across all projects. */
export const searchAll = async (rawQuery: string): Promise<SearchHit[]> => {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];
  const [boards, ideas, notes] = await Promise.all([
    db.boards.toArray(),
    db.ideas.toArray(),
    db.notes.toArray(),
  ]);
  const boardTitle = new Map(boards.map((b) => [b.id, b.title]));
  const ideaById = new Map(ideas.map((i) => [i.id, i]));
  const hits: SearchHit[] = [];

  for (const b of boards) {
    if (b.title.toLowerCase().includes(q))
      hits.push({
        kind: 'board',
        boardId: b.id,
        boardTitle: b.title,
        ideaId: null,
        title: b.title,
        snippet: '',
      });
  }
  for (const i of ideas) {
    const haystack = [i.text, i.description, ...i.tags.map((t) => `#${t}`)];
    const match = haystack.find((h) => h.toLowerCase().includes(q));
    if (match !== undefined)
      hits.push({
        kind: 'idea',
        boardId: i.boardId,
        boardTitle: boardTitle.get(i.boardId) ?? '',
        ideaId: i.id,
        title: i.text,
        snippet: match === i.text ? '' : snippetOf(match, q),
      });
  }
  for (const n of notes) {
    if (!n.text.toLowerCase().includes(q)) continue;
    hits.push({
      kind: 'note',
      boardId: n.boardId,
      boardTitle: boardTitle.get(n.boardId) ?? '',
      ideaId: n.ideaId,
      title: ideaById.get(n.ideaId)?.text ?? '',
      snippet: snippetOf(n.text, q),
    });
  }
  return hits.slice(0, MAX_HITS);
};
