const factor = 1_000
export const measurementParameters = {
  batchSize: factor,
  total: 25000 * factor
}

export type MeasurementResults = {
  insertionTimesMs: number[];
  lookupTimesMs: number[];
  totalTimeMs: number;
};
