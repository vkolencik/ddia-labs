import { Client } from "pg";
import { keyValueGen } from "./value-gen";
import { MeasurementResults, measurementParameters } from "./measurement";

const pg = new Client({ user: "postgres", password: "pass", port: 5432 });

export async function benchmarkPostgres(): Promise<MeasurementResults> {
  const insertionTimesMs: number[] = [];
  const lookupTimesMs: number[] = [];
  await pg.connect();
  await pg.query("DROP TABLE IF EXISTS kv; CREATE TABLE kv(key text primary key, value text)");
  const start = process.hrtime.bigint();
  const gen = keyValueGen(measurementParameters.total);

  for (let batch = 0; batch < measurementParameters.total / measurementParameters.batchSize; ++batch) {
    const pairs = Array.from({ length: measurementParameters.batchSize }, () => gen.next().value);
    // Use multi-row INSERT
    const placeholders = pairs.map((_, i) => `($${2 * i + 1}, $${2 * i + 2})`).join(",");
    const params = pairs.flat();

    const startInsert = process.hrtime.bigint();
    await pg.query(`INSERT INTO kv (key, value) VALUES ${placeholders}`, params);
    insertionTimesMs.push(Number(process.hrtime.bigint() - startInsert) / 1e6);

    const startLookup = process.hrtime.bigint();
    await pg.query(`SELECT key, value FROM kv WHERE key = $1`, [pairs[0][0]]);
    lookupTimesMs.push(Number(process.hrtime.bigint() - startLookup) / 1e6);
  }

  const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
  console.log(`Postgres: Inserted ${measurementParameters.total} keys in ${elapsed} ms`);
  await pg.end();

  return {
    insertionTimesMs,
    lookupTimesMs,
    totalTimeMs: elapsed
  }
}
