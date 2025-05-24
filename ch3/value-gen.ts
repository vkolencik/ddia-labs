const padding = 9;

function getKey(index: number) {
  return `key${index.toString().padStart(padding, '0')}`
}

export function* keyValueGen(size: number): Generator<[string, string]> {
  for (let i = 0; i < size; ++i) {
    const key = getKey(i);
    const value = Math.random().toString(36).slice(2, 34); // ~32-char random
    yield [key, value];
  }
}

export function getRandomKey(size: number) {
  return getKey(Math.floor(Math.random() * size));
} 