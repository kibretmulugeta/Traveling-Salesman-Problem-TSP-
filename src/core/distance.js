/**
 * Distance utilities for Traveling Salesman Problem (TSP) calculations.
 */

/**
 * Calculates the 2D Euclidean distance between two points (cities).
 * d(i, j) = sqrt((x_i - x_j)^2 + (y_i - y_j)^2)
 * @param {{x: number, y: number}} p1
 * @param {{x: number, y: number}} p2
 * @returns {number}
 */
export function euclideanDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the total route length of a Hamiltonian cycle visiting every city
 * and returning back to the starting city.
 * @param {number[]} route Array of city indices forming the path order
 * @param {Array<{x: number, y: number}>} cities Array of city objects
 * @returns {number}
 */
export function calculateRouteLength(route, cities) {
  if (!route || route.length === 0 || !cities || cities.length === 0) return 0;
  
  let totalLength = 0;
  const n = route.length;
  for (let i = 0; i < n; i++) {
    const fromCity = cities[route[i]];
    const toCity = cities[route[(i + 1) % n]];
    totalLength += euclideanDistance(fromCity, toCity);
  }
  return totalLength;
}

/**
 * Pre-calculates an N x N distance matrix for fast lookups.
 * @param {Array<{x: number, y: number}>} cities
 * @returns {number[][]}
 */
export function createDistanceMatrix(cities) {
  const n = cities.length;
  const matrix = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        const dist = euclideanDistance(cities[i], cities[j]);
        matrix[i][j] = dist;
        matrix[j][i] = dist;
      }
    }
  }
  return matrix;
}

/**
 * Fast lookup from precalculated matrix
 * @param {number[][]} matrix
 * @param {number[]} route
 * @returns {number}
 */
export function calculateRouteLengthFromMatrix(route, matrix) {
  if (!route || route.length === 0 || !matrix) return 0;
  let total = 0;
  const n = route.length;
  for (let i = 0; i < n; i++) {
    total += matrix[route[i]][route[(i + 1) % n]];
  }
  return total;
}
