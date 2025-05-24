
export function getPercentile(data: number[], percentile: number = 0.999) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Input must be a non-empty array of numbers');
  }
  
  // Filter out non-numeric values and sort
  const sorted = data
    .filter(n => typeof n === 'number' && !isNaN(n))
    .sort((a, b) => a - b);
  
  if (sorted.length === 0) {
    throw new Error('Array must contain at least one valid number');
  }
  
  // Calculate 95th percentile using linear interpolation method
  const index = percentile * (sorted.length - 1);
  
  if (Number.isInteger(index)) {
    return sorted[index];
  } else {
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }
}