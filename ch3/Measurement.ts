export const measurementParameters = {
  batchSize: 1_000,
  total: 50_000_000
}

export type MeasurementResults = {
  insertionTimesMs: number[];
  lookupTimesMs: number[];
  totalTimeMs: number;
};
