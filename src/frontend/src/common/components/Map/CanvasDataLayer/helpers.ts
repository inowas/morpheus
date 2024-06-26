/**
 * Calculate grades or thresholds for a legend from a 2D array of data.
 * Uses quantiles to handle diverse data ranges effectively.
 * @param data - The 2D array of numerical data.
 * @param numGrades - The number of grades or thresholds to calculate.
 * @returns An array of thresholds.
 */
export const calculateQuantileThresholds = (data: number[][], numGrades: number): number[] => {
  // Flatten the 2D array into a 1D array
  const flattenedData = data.flat();


  // Handle edge cases
  if (0 === flattenedData.length) {
    return [];
  }

  const unique = [...new Set(flattenedData)];
  unique.sort((a, b) => a - b);

  const dMin = Math.min(...unique) - Math.abs(Math.min(...unique) * 0.1);
  const dMax = Math.max(...unique) + Math.abs(Math.max(...unique) * 0.1);
  const thresholds = [dMin];

  for (let i = 1; i < numGrades - 1; i++) {
    thresholds.push(dMin + (dMax - dMin) * i / numGrades);
  }

  thresholds.push(dMax);

  return thresholds;
};
