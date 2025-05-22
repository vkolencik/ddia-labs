import { generateChart, generateTwoLineChart } from "./chart";
import { benchmarkPostgres } from "./postgres";
import { benchmarkRedis } from "./redis";

async function main() {
    const xValues = [...Array(1000).keys()];

    const resultsPostgres = await benchmarkPostgres();

    console.log(`Postgres benchmark finished, total time ${resultsPostgres.totalTimeMs} ms`);

    await generateTwoLineChart(xValues, resultsPostgres.insertionTimesMs, xValues, resultsPostgres.lookupTimesMs, {
        label1: 'Insertion time',
        label2: 'Lookup time',
        title: 'Postgres benchmark',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/postgres.png'
    });

    const resultsRedis = await benchmarkRedis();

    console.log(`Redis benchmark finished, total time ${resultsRedis.totalTimeMs} ms`);

    await generateTwoLineChart(xValues, resultsRedis.insertionTimesMs, xValues, resultsRedis.lookupTimesMs, {
        label1: 'Insertion time',
        label2: 'Lookup time',
        title: 'Redis benchmark',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/redis.png'
    });
}

main();
