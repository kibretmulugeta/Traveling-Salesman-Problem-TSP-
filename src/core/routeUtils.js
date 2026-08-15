/**
 * Route permutation and validation utility functions for TSP.
 */

/**
 * Validates that a route represents a mathematically complete Hamiltonian cycle:
 * 1. Contains exactly `numCities` elements.
 * 2. Visits every integer from 0 to numCities - 1 exactly once.
 * @param {number[]} route 
 * @param {number} numCities 
 * @returns {boolean}
 */
export function isValidRoute(route, numCities) {
  if (!Array.isArray(route) || route.length !== numCities) {
    return false;
  }
  const visited = new Set(route);
  if (visited.size !== numCities) {
    return false;
  }
  for (let i = 0; i < numCities; i++) {
    if (!visited.has(i)) return false;
  }
  return true;
}

/**
 * Generates a random permutation of city indices [0, 1, ..., numCities-1].
 * @param {number} numCities 
 * @param {Function} [rng] Optional random function returning number in [0, 1)
 * @returns {number[]}
 */
export function generateRandomRoute(numCities, rng = Math.random) {
  const route = Array.from({ length: numCities }, (_, i) => i);
  for (let i = numCities - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [route[i], route[j]] = [route[j], route[i]];
  }
  return route;
}

/**
 * Performs a 2-opt swap on a route between indices i and k (reverses segment route[i..k]).
 * @param {number[]} route 
 * @param {number} i 
 * @param {number} k 
 * @returns {number[]} New route after 2-opt edge swap
 */
export function twoOptSwap(route, i, k) {
  const newRoute = route.slice(0, i);
  const reversedSegment = route.slice(i, k + 1).reverse();
  const rest = route.slice(k + 1);
  return newRoute.concat(reversedSegment, rest);
}

/**
 * Swaps two elements in a route.
 * @param {number[]} route 
 * @param {number} i 
 * @param {number} j 
 * @returns {number[]}
 */
export function swapElements(route, i, j) {
  const newRoute = [...route];
  [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
  return newRoute;
}

/**
 * Inverts a random subsegment of the route.
 * @param {number[]} route 
 * @param {number} i 
 * @param {number} j 
 * @returns {number[]}
 */
export function invertSegment(route, i, j) {
  const start = Math.min(i, j);
  const end = Math.max(i, j);
  return twoOptSwap(route, start, end);
}
