/**
 * Optimization metrics, formatting, and performance utilities.
 */

/**
 * Calculates improvement percentage between initial and current best distance.
 * @param {number} initialDistance 
 * @param {number} bestDistance 
 * @returns {number} Percentage improvement (0 - 100)
 */
export function calculateImprovement(initialDistance, bestDistance) {
  if (!initialDistance || initialDistance <= 0 || !bestDistance) return 0;
  if (bestDistance >= initialDistance) return 0;
  const improvement = ((initialDistance - bestDistance) / initialDistance) * 100;
  return Number(improvement.toFixed(2));
}

/**
 * Formats a distance number to 2 decimal places with comma separation.
 * @param {number} distance 
 * @returns {string}
 */
export function formatDistance(distance) {
  if (distance === undefined || distance === null || isNaN(distance)) return '0.00';
  return Number(distance).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Formats milliseconds into human readable time format (e.g. "1.23s" or "450ms").
 * @param {number} ms 
 * @returns {string}
 */
export function formatTime(ms) {
  if (!ms || ms <= 0) return '0 ms';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

/**
 * Formats iteration rate (iterations per second).
 * @param {number} iterations 
 * @param {number} elapsedMs 
 * @returns {number}
 */
export function calculateIterationsPerSec(iterations, elapsedMs) {
  if (!elapsedMs || elapsedMs <= 0) return 0;
  const rate = (iterations / elapsedMs) * 1000;
  return Math.round(rate);
}
