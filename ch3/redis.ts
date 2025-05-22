import Redis from "ioredis";
import { keyValueGen } from "./value-gen";
import { MeasurementResults, measurementParameters } from "./measurement";

const redis = new Redis(6666, "localhost", {});

export async function benchmarkRedis(): Promise<MeasurementResults> {
  const insertionTimesMs: number[] = [];
  const lookupTimesMs: number[] = [];

  const start = Date.now();
  const gen = keyValueGen(measurementParameters.total);
  try {
    for (let batch = 0; batch < measurementParameters.total / measurementParameters.batchSize; ++batch) {
      const pipeline = redis.pipeline();
      let firstKey = null;

      for (let i = 0; i < measurementParameters.batchSize; ++i) {
        const [key, value] = gen.next().value;
        if (firstKey === null) firstKey = key;
        pipeline.set(key, value);
      }
      const startInsert = Date.now();
      await pipeline.exec();
      insertionTimesMs.push(Date.now() - startInsert);

      const startLookup = Date.now();
      // await redis.get(firstKey!);
      lookupTimesMs.push(Date.now() - startLookup);
    }
  } finally {
    // redis.quit();
  }

  const elapsed = Date.now() - start;

  return {
    insertionTimesMs,
    lookupTimesMs,
    totalTimeMs: elapsed
  }
}

benchmarkRedis();