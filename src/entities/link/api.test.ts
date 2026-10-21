import { db } from '@/shared/api';
import { addLink } from './api';

beforeEach(() => db.links.clear());

it('rejects self-links and duplicates in either direction', async () => {
  expect(await addLink('b', 'a', 'a')).toBe(false);
  expect(await addLink('b', 'a', 'c')).toBe(true);
  expect(await addLink('b', 'a', 'c')).toBe(false);
  expect(await addLink('b', 'c', 'a')).toBe(false);
  expect(await db.links.count()).toBe(1);
});
