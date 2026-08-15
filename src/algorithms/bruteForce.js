/**
 * Brute Force Exact Solver for TSP.
 * Evaluates all unique Hamiltonian cycles.
 * Safe limit: N <= 9 cities (8! / 2 = 20,160 permutations).
 */
import { BaseAlgorithm } from './BaseAlgorithm.js';

export class BruteForceAlgorithm extends BaseAlgorithm {
  constructor() {
    super('Brute Force (Exact)', 'brute_force');
    this.permutations = [];
    this.permIndex = 0;
  }

  initialize(cities, params = {}, rng = Math.random) {
    super.initialize(cities, params, rng);
    const n = cities.length;

    if (n > 9) {
      throw new Error(`Brute Force safety limit exceeded! Selected ${n} cities, max allowed is 9.`);
    }

    // Fix first city at index 0 to avoid symmetric cyclic shifts
    const rest = Array.from({ length: n - 1 }, (_, i) => i + 1);
    this.permutations = [];
    this.generatePermutations(rest, 0, n - 2);

    this.permIndex = 0;
    this.bestDistance = Infinity;
    this.bestRoute = [];

    const firstRoute = [0, ...this.permutations[0]];
    const firstDist = this.evaluateRoute(firstRoute);
    this.currentRoute = firstRoute;
    this.currentDistance = firstDist;
    this.initialDistance = firstDist;

    this.updateBest(firstRoute, firstDist, `Started Brute Force evaluation of ${this.permutations.length} permutations.`);
  }

  generatePermutations(arr, l, r) {
    if (l === r) {
      this.permutations.push([...arr]);
    } else {
      for (let i = l; i <= r; i++) {
        [arr[l], arr[i]] = [arr[i], arr[l]];
        this.generatePermutations(arr, l + 1, r);
        [arr[l], arr[i]] = [arr[i], arr[l]];
      }
    }
  }

  step() {
    if (this.isFinished) {
      return this.getState();
    }

    if (this.permIndex >= this.permutations.length) {
      this.isFinished = true;
      this.lastStepDescription = `Brute Force search completed! Optimal distance proven: ${this.bestDistance.toFixed(2)}`;
      return this.getState();
    }

    // Process a chunk of permutations per step for speed while animating
    const chunkSize = Math.max(1, Math.floor(this.permutations.length / 50));
    const limit = Math.min(this.permIndex + chunkSize, this.permutations.length);

    while (this.permIndex < limit) {
      const p = this.permutations[this.permIndex];
      const route = [0, ...p];
      const dist = this.evaluateRoute(route);

      this.currentRoute = route;
      this.currentDistance = dist;
      this.iteration++;

      this.updateBest(
        route,
        dist,
        `Permutation ${this.permIndex + 1}/${this.permutations.length}: Found new optimal candidate! Distance: ${dist.toFixed(2)}`
      );

      this.permIndex++;
    }

    if (this.permIndex >= this.permutations.length) {
      this.isFinished = true;
      this.lastStepDescription = `Brute Force search completed! Exact minimum distance: ${this.bestDistance.toFixed(2)}`;
    } else {
      this.lastStepDescription = `Evaluated ${this.permIndex}/${this.permutations.length} permutations. Current best: ${this.bestDistance.toFixed(2)}`;
    }

    return this.getState();
  }
}
