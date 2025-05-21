import Redis from "ioredis";
import { keyValueGen } from "./value-gen";
const redis = new Redis(6666, "localhost");

const batchSize = 1000
const total = 1_000_000;

async function benchmarkRedis() {
  const start = Date.now();
  const gen = keyValueGen(total);
  for (let batch = 0; batch < total / batchSize; ++batch) {
    const pipeline = redis.pipeline();
    for (let i = 0; i < batchSize; ++i) {
      const [key, value] = gen.next().value;
      pipeline.set(key, value);
    }
    await pipeline.exec();
  }
  const elapsed = Date.now() - start;
  console.log(`Redis: Inserted ${total} keys in ${elapsed} ms`);
  redis.disconnect();
}

benchmarkRedis();