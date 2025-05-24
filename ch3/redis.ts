import Redis from "ioredis";
import { getRandomKey, keyValueGen } from "./value-gen";
import { measurementParameters, MeasurementResults } from "./Measurement";

export async function benchmarkRedis(): Promise<MeasurementResults> {
  const insertionTimesMs: number[] = [];
  const lookupTimesMs: number[] = [];

  const redis = new Redis({
    port: 6666,
    host: "localhost",
    lazyConnect: false
  });

  const totalStart = process.hrtime.bigint();
  const gen = keyValueGen(measurementParameters.total);

  const numberOfBatches = measurementParameters.total / measurementParameters.batchSize;
  let lastPct = -1;

  try {
    for (let batch = 0; batch < numberOfBatches; ++batch) {

      const pct = Math.floor(100*batch/numberOfBatches);
      if (pct !== lastPct) {
        lastPct = pct;
        console.log(`${pct} % done`);
      }

      const pipeline = redis.pipeline();

      const kvPairs: string[] = [];
      for (let i = 0; i < measurementParameters.batchSize; ++i) {
        const [key, value] = gen.next().value;
        kvPairs.push(key, value);
      }

      const insertStart = process.hrtime.bigint();
      await pipeline.mset(...kvPairs);
      await pipeline.exec();
      insertionTimesMs.push(Number(process.hrtime.bigint() - insertStart) / 1e6);

      const lookupStart = process.hrtime.bigint();
      const result = await redis.get(getRandomKey((batch + 1)*measurementParameters.batchSize));
      if (result === null || result.length < 5) throw new Error(`Lookup failed: ${result}`);
      lookupTimesMs.push(Number(process.hrtime.bigint() - lookupStart) / 1e6);
    }
  } finally {
    await redis.quit();           // graceful shutdown
  }

  const totalElapsedMs = Number(process.hrtime.bigint() - totalStart) / 1e6;

  return {
    insertionTimesMs,
    lookupTimesMs,
    totalTimeMs: totalElapsedMs
  };
}
