import { webcrypto } from 'node:crypto';
import { TextDecoder, TextEncoder } from 'node:util';
import { deserialize, serialize } from 'node:v8';

// jsdom does not expose these Node globals that Dexie / fake-indexeddb rely on.
Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
  structuredClone: <T>(value: T): T => deserialize(serialize(value)),
});
if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}
