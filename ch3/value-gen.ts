export function* keyValueGen(size: number): Generator<[string, string]> {
  for (let i = 0; i < size; ++i) {
    const key = `key${i.toString().padStart(7, '0')}`;
    const value = Math.random().toString(36).slice(2, 34); // ~32-char random
    yield [key, value];
  }
}