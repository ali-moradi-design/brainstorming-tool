import { DETAILS_DELAY_MS, useSelection } from './selection';

beforeEach(() => {
  jest.useFakeTimers();
  useSelection.getState().reset();
});
afterEach(() => jest.useRealTimers());

it('opens the details sheet right away by default', () => {
  useSelection.getState().select('a');
  expect(useSelection.getState()).toMatchObject({ selectedId: 'a', detailsId: 'a' });
});

it('waits for the double-click window before opening the sheet from a click on the map', () => {
  const { select } = useSelection.getState();
  select('a', { waitForDoubleClick: true });
  expect(useSelection.getState()).toMatchObject({ selectedId: 'a', detailsId: null });
  jest.advanceTimersByTime(DETAILS_DELAY_MS);
  expect(useSelection.getState().detailsId).toBe('a');

  // Already open: switching ideas does not move anything, so it is immediate.
  select('b', { waitForDoubleClick: true });
  expect(useSelection.getState().detailsId).toBe('b');
});

it('does not open a stale sheet after the selection was cleared', () => {
  const { select } = useSelection.getState();
  select('a', { waitForDoubleClick: true });
  select(null);
  jest.advanceTimersByTime(DETAILS_DELAY_MS);
  expect(useSelection.getState()).toMatchObject({ selectedId: null, detailsId: null });
});
