import { generateChart, generateTwoLineChart } from "./chart";
import { benchmarkPostgres } from "./postgres";

async function main() {
    const resultsPostgres = await benchmarkPostgres();

    const xValues = [...Array(1000).keys()];

    console.log(`Postgres benchmark finished, total time ${resultsPostgres.totalTimeMs} ms`);

    await generateTwoLineChart(xValues, resultsPostgres.insertionTimesMs, xValues, resultsPostgres.lookupTimesMs, {
        label1: 'Insertion time',
        label2: 'Lookup time',
        title: 'Postgres benchmark',
        xAxisLabel: 'Batch no',
        yAxisLabel: 'Time (ms)',
        outputPath: './charts/postgres.png'
    });
}

main();