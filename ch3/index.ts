import { generateChart, generateTwoLineChart, generateXYChart } from "./chart";
import { benchmarkPostgres } from "./postgres";
import { benchmarkRedis } from "./redis";

async function main() {

    const resultsPostgres = await benchmarkPostgres();

    const xValues = [...resultsPostgres.insertionTimesMs.keys()];

    console.log(`Postgres benchmark finished, total time ${resultsPostgres.totalTimeMs} ms`);

    await generateChart(resultsPostgres.insertionTimesMs, {
        title: 'Postgres insertion time',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/postgresInsertion.png'
    });
    
    await generateChart(resultsPostgres.lookupTimesMs, {
        title: 'Postgres lookup time',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/postgresLookup.png'
    });

    const resultsRedis = await benchmarkRedis();

    console.log(`Redis benchmark finished, total time ${resultsRedis.totalTimeMs} ms`);

    await generateChart(resultsRedis.insertionTimesMs, {
        title: 'Redis insertion time',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/redisInsertion.png'
    });

    await generateChart(resultsRedis.lookupTimesMs, {
        title: 'Redis lookup time',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/redisLookup.png'
    });
}

main();
