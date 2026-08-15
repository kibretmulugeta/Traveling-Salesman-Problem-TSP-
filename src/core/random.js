/**
 * Seedable Pseudo-Random Number Generator (PRNG) implementation (Mulberry32).
 * Allows deterministic, reproducible stochastic optimization runs.
 */

/**
 * Creates a deterministic PRNG function based on a seed string or number.
 * @param {number|string} seed 
 * @returns {() => number} Function returning float in range [0, 1)
 */
export function createPRNG(seed) {
  let s = typeof seed === 'string' ? hashString(seed) : (seed | 0);
  if (s === 0) s = 123456789;

  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simple string hash to integer seed
 * @param {string} str 
 * @returns {number}
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

/**
 * Generates a random integer in range [min, max] inclusive using rng.
 * @param {number} min 
 * @param {number} max 
 * @param {Function} [rng] 
 * @returns {number}
 */
export function randomInt(min, max, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Generates a random float in range [min, max) using rng.
 * @param {number} min 
 * @param {number} max 
 * @param {Function} [rng] 
 * @returns {number}
 */
export function randomFloat(min, max, rng = Math.random) {
  return rng() * (max - min) + min;
}
