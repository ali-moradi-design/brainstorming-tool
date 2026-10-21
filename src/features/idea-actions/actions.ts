import {
  addIdea,
  childPosition,
  listIdeas,
  moveIdeas,
  removeIdeaTree,
  radialLayout,
} from '@/entities/idea';
import { touchBoard } from '@/entities/board';
import { addLink } from '@/entities/link';
import { recordChange } from '@/shared/lib';
import { updateIdea } from '@/entities/idea';

/** Adds a child below `parentId` and returns its id. */
export const addChild = async (
  boardId: string,
  parentId: string,
  text: string,
): Promise<string | null> => {
  const ideas = await listIdeas(boardId);
  const parent = ideas.find((i) => i.id === parentId);
  if (!parent) return null;
  await recordChange(boardId);
  // Adding a child to a collapsed idea would hide it immediately, so expand first.
  if (parent.collapsed) await updateIdea(parent.id, { collapsed: false });
  const idea = await addIdea({
    boardId,
    parentId,
    text,
    color: parent.color,
    ...childPosition(ideas, parent),
  });
  await touchBoard(boardId);
  return idea.id;
};

/** Adds a sibling next to `ideaId`; the root has no siblings, so it gets a child instead. */
export const addSibling = async (
  boardId: string,
  ideaId: string,
  text: string,
): Promise<string | null> => {
  const idea = (await listIdeas(boardId)).find((i) => i.id === ideaId);
  if (!idea) return null;
  return addChild(boardId, idea.parentId ?? idea.id, text);
};

export const deleteIdea = async (boardId: string, ideaId: string): Promise<void> => {
  const idea = (await listIdeas(boardId)).find((i) => i.id === ideaId);
  if (!idea || idea.parentId === null) return; // the root idea cannot be deleted
  await recordChange(boardId);
  await removeIdeaTree(boardId, ideaId);
  await touchBoard(boardId);
};

export const tidyBoard = async (boardId: string): Promise<void> => {
  await recordChange(boardId);
  await moveIdeas(radialLayout(await listIdeas(boardId)));
  await touchBoard(boardId);
};

/** Links two ideas that are not parent and child. Returns false for duplicates and self-links. */
export const linkIdeas = async (
  boardId: string,
  fromId: string,
  toId: string,
): Promise<boolean> => {
  await recordChange(boardId);
  const created = await addLink(boardId, fromId, toId);
  if (created) await touchBoard(boardId);
  return created;
};

export const toggleCollapsed = async (ideaId: string, collapsed: boolean): Promise<void> => {
  await updateIdea(ideaId, { collapsed });
};
