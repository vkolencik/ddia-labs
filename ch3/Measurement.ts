export const measurementParameters = {
  batchSize: 1000/100,
  total: 1_000_000/100
}

export type MeasurementResults = {
  insertionTimesMs: number[];
  lookupTimesMs: number[];
  totalTimeMs: number;
};
