import type { IdeaRecord } from '@/shared/api';

/** True when two loads of an idea hold the same values (live queries return fresh objects). */
export const isSameIdea = (a: IdeaRecord, b: IdeaRecord): boolean =>
  (Object.keys(a) as (keyof IdeaRecord)[]).every((k) =>
    k === 'tags' ? a.tags.join('\n') === b.tags.join('\n') : Object.is(a[k], b[k]),
  ) && Object.keys(a).length === Object.keys(b).length;
