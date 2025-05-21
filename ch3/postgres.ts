import { Client } from "pg";
import { keyValueGen } from "./value-gen";
import { MeasurementResults, measurementParameters } from "./Measurement";

const pg = new Client({ user: "postgres", password: "pass", port: 5432 });

export async function benchmarkPostgres(): Promise<MeasurementResults> {
  const insertionTimesMs: number[] = [];
  const lookupTimesMs: number[] = [];
  await pg.connect();
  await pg.query("DROP TABLE IF EXISTS kv; CREATE TABLE kv(key text primary key, value text)");
  const start = Date.now();
  const gen = keyValueGen(measurementParameters.total);

  for (let batch = 0; batch < measurementParameters.total / measurementParameters.batchSize; ++batch) {
    const pairs = Array.from({ length: measurementParameters.batchSize }, () => gen.next().value);
    // Use multi-row INSERT
    const placeholders = pairs.map((_, i) => `($${2 * i + 1}, $${2 * i + 2})`).join(",");
    const params = pairs.flat();

    const startInsert = Date.now();
    await pg.query(`INSERT INTO kv (key, value) VALUES ${placeholders}`, params);
    insertionTimesMs.push(Date.now() - startInsert);

    const startLookup = Date.now();
    await pg.query(`SELECT key, value FROM kv WHERE key = $1`, [pairs[0][0]]);
    lookupTimesMs.push(Date.now() - startLookup);
  }

  const elapsed = Date.now() - start;
  console.log(`Postgres: Inserted ${measurementParameters.total} keys in ${elapsed} ms`);
  await pg.end();

  return {
    insertionTimesMs,
    lookupTimesMs,
    totalTimeMs: elapsed,

  }
}
