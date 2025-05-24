import { generateChart, generateTwoLineChart, generateXYChart } from "./chart";
import { get95thPercentile } from "./math";
import { benchmarkPostgres } from "./postgres";
import { benchmarkRedis } from "./redis";
import fs from 'fs';

async function main() {

    const resultsPostgres = await benchmarkPostgres();

    const xValues = [...resultsPostgres.insertionTimesMs.keys()];

    console.log(`Postgres benchmark finished, total time ${resultsPostgres.totalTimeMs} ms`);

    await generateChart(resultsPostgres.insertionTimesMs, {
        title: 'Postgres insertion time',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/postgresInsertion.png',
        yMax: get95thPercentile(resultsPostgres.insertionTimesMs) * 1.2
    });
    
    await generateChart(resultsPostgres.lookupTimesMs, {
        title: 'Postgres lookup time',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/postgresLookup.png',
        yMax: get95thPercentile(resultsPostgres.lookupTimesMs) * 1.2
    });

    const resultsRedis = await benchmarkRedis();

    console.log(`Redis benchmark finished, total time ${resultsRedis.totalTimeMs} ms`);

    await generateChart(resultsRedis.insertionTimesMs, {
        title: 'Redis insertion time',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/redisInsertion.png',
        yMax: get95thPercentile(resultsRedis.insertionTimesMs) * 1.2

    });

    await generateChart(resultsRedis.lookupTimesMs, {
        title: 'Redis lookup time',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/redisLookup.png',
        yMax: get95thPercentile(resultsRedis.lookupTimesMs) * 1.2
    });
}

main();
