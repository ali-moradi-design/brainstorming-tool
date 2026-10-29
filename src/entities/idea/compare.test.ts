import type { IdeaRecord } from '@/shared/api';
import { isSameIdea } from './compare';

const idea: IdeaRecord = {
  id: '1',
  boardId: 'b',
  parentId: null,
  text: 'Root',
  description: '',
  x: 0,
  y: 0,
  color: 0,
  collapsed: false,
  tags: ['a', 'b'],
  createdAt: 1,
};

it('treats two loads with the same values as the same idea', () => {
  expect(isSameIdea(idea, { ...idea, tags: [...idea.tags] })).toBe(true);
  expect(isSameIdea(idea, { ...idea, x: 5 })).toBe(false);
  expect(isSameIdea(idea, { ...idea, tags: ['a'] })).toBe(false);
  expect(isSameIdea(idea, { ...idea, text: 'Other' })).toBe(false);
});
