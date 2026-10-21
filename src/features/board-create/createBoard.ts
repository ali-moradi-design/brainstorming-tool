import { radialLayout } from '@/entities/idea';
import { db, type IdeaRecord } from '@/shared/api';
import { newId } from '@/shared/lib';
import type { TemplateBranch } from './templates';

const BRANCH_COLORS = [1, 2, 4, 3];

/** Creates a board with a root idea (named after the board) and, optionally, template branches. */
export const createBoard = async (
  title: string,
  branches: TemplateBranch[] = [],
): Promise<string> => {
  const now = Date.now();
  const boardId = newId();
  const base = { boardId, description: '', collapsed: false, tags: [], x: 0, y: 0 };
  const ideas: IdeaRecord[] = [
    { ...base, id: newId(), parentId: null, text: title, color: 3, createdAt: now },
  ];

  branches.forEach((branch, i) => {
    const color = BRANCH_COLORS[i % BRANCH_COLORS.length];
    const parent: IdeaRecord = {
      ...base,
      id: newId(),
      parentId: ideas[0].id,
      text: branch.label,
      color,
      createdAt: now + ideas.length,
    };
    ideas.push(parent);
    for (const item of branch.items ?? [])
      ideas.push({
        ...base,
        id: newId(),
        parentId: parent.id,
        text: item,
        color,
        createdAt: now + ideas.length,
      });
  });

  const positions = radialLayout(ideas);
  for (const idea of ideas) Object.assign(idea, positions.get(idea.id));

  await db.transaction('rw', db.boards, db.ideas, async () => {
    await db.boards.add({ id: boardId, title, createdAt: now, updatedAt: now });
    await db.ideas.bulkAdd(ideas);
  });
  return boardId;
};
