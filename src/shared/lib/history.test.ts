import { db } from '@/shared/api';
import { useHistory } from './history';

const idea = (id: string, text: string) => ({
  id,
  boardId: 'b',
  parentId: null,
  text,
  description: '',
  x: 0,
  y: 0,
  color: 0,
  collapsed: false,
  tags: [],
  createdAt: 1,
});

beforeEach(async () => {
  await Promise.all([db.ideas.clear(), db.notes.clear(), db.links.clear()]);
  useHistory.setState({ past: {}, future: {} });
});

describe('history', () => {
  it('undoes and redoes a change to a board', async () => {
    await db.ideas.add(idea('i', 'one'));
    await useHistory.getState().record('b');
    await db.ideas.update('i', { text: 'two' });

    await useHistory.getState().undo('b');
    expect((await db.ideas.get('i'))?.text).toBe('one');

    await useHistory.getState().redo('b');
    expect((await db.ideas.get('i'))?.text).toBe('two');
  });

  it('clears the redo stack when a new change is recorded', async () => {
    await db.ideas.add(idea('i', 'one'));
    await useHistory.getState().record('b');
    await db.ideas.update('i', { text: 'two' });
    await useHistory.getState().undo('b');
    await useHistory.getState().record('b');
    expect(useHistory.getState().future['b']).toEqual([]);
  });

  it('does nothing when there is nothing to undo', async () => {
    await db.ideas.add(idea('i', 'one'));
    await useHistory.getState().undo('b');
    expect((await db.ideas.get('i'))?.text).toBe('one');
  });
});
