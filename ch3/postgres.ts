import { Client } from "pg";
import { getRandomKey, keyValueGen } from "./value-gen";
import { measurementParameters, MeasurementResults } from "./Measurement";

const pg = new Client({ user: "postgres", password: "pass", port: 5432 });

export async function benchmarkPostgres(): Promise<MeasurementResults> {
  const insertionTimesMs: number[] = [];
  const lookupTimesMs: number[] = [];
  await pg.connect();
  await pg.query("DROP TABLE IF EXISTS kv; CREATE TABLE kv(key text primary key, value text)");
  const start = process.hrtime.bigint();
  const gen = keyValueGen(measurementParameters.total);

  const numberOfBatches = measurementParameters.total / measurementParameters.batchSize;
  let lastPct = -1;

  for (let batch = 0; batch < numberOfBatches; ++batch) {

    const pct = Math.floor(100 * batch / numberOfBatches);
    if (pct !== lastPct) {
      lastPct = pct;
      console.log(`${pct} % done`);
    }

    const pairs = Array.from({ length: measurementParameters.batchSize }, () => gen.next().value);

    // Use multi-row INSERT
    const placeholders = pairs.map((_, i) => `($${2 * i + 1}, $${2 * i + 2})`).join(",");
    const params = pairs.flat();

    const startInsert = process.hrtime.bigint();
    await pg.query(`INSERT INTO kv (key, value) VALUES ${placeholders}`, params);
    insertionTimesMs.push(Number(process.hrtime.bigint() - startInsert) / 1e6);

    const startLookup = process.hrtime.bigint();
    const result = await pg.query(`SELECT key, value FROM kv WHERE key = $1`, [getRandomKey((batch + 1)*measurementParameters.batchSize)]);
    if (result.rows[0].value.length < 5) throw new Error(`Lookup failed: ${JSON.stringify(result)}`);
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
