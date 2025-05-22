export const measurementParameters = {
  batchSize: 1000,
  total: 1_000_000
}

export type MeasurementResults = {
  insertionTimesMs: number[];
  lookupTimesMs: number[];
  totalTimeMs: number;
};
