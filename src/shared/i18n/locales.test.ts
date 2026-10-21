import en from './locales/en.json';
import es from './locales/es.json';
import fa from './locales/fa.json';

const flatten = (obj: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? flatten(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );

describe('locales', () => {
  it.each([
    ['es', es],
    ['fa', fa],
  ])('%s has exactly the same keys as en', (_, locale) => {
    expect(flatten(locale).sort()).toEqual(flatten(en).sort());
  });
});
