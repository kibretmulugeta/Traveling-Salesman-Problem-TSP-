/**
 * 2-opt Local Search Algorithm for TSP.
 * Iteratively replaces two non-adjacent edges if the swapped tour reduces total distance.
 */
import { BaseAlgorithm } from './BaseAlgorithm.js';
import { generateRandomRoute, twoOptSwap } from '../core/routeUtils.js';

export class TwoOptAlgorithm extends BaseAlgorithm {
  constructor() {
    super('2-opt Local Search', 'two_opt');
    this.maxIterations = 2000;
    this.currentI = 0;
    this.currentK = 1;
    this.improvedInPass = false;
    this.activeSwapPair = null; // [i, k] for canvas animation
  }

  initialize(cities, params = {}, rng = Math.random) {
    super.initialize(cities, params, rng);
    this.maxIterations = params.maxIterations || 2000;

    this.currentRoute = generateRandomRoute(cities.length, this.rng);
    this.currentDistance = this.evaluateRoute(this.currentRoute);
    this.initialDistance = this.currentDistance;

    this.bestRoute = [...this.currentRoute];
    this.bestDistance = this.currentDistance;

    this.currentI = 0;
    this.currentK = 2;
    this.improvedInPass = false;
    this.activeSwapPair = null;

    this.lastStepDescription = `Initialized 2-opt search with initial distance ${this.currentDistance.toFixed(2)}.`;
  }

  step() {
    if (this.isFinished) {
      return this.getState();
    }

    const n = this.cities.length;
    if (n <= 3 || this.iteration >= this.maxIterations) {
      this.isFinished = true;
      this.activeSwapPair = null;
      this.lastStepDescription = `2-opt finished. Reached max iterations or minimal cities.`;
      return this.getState();
    }

    this.iteration++;

    // Evaluate 2-opt move for current edge pair (i, k)
    const i = this.currentI;
    const k = this.currentK;

    this.activeSwapPair = [i, k];

    const candidateRoute = twoOptSwap(this.currentRoute, i, k);
    const candidateDist = this.evaluateRoute(candidateRoute);

    let improved = false;
    if (candidateDist < this.currentDistance - 1e-6) {
      const diff = this.currentDistance - candidateDist;
      this.currentRoute = candidateRoute;
      this.currentDistance = candidateDist;
      this.improvedInPass = true;
      improved = true;

      this.updateBest(
        candidateRoute,
        candidateDist,
        `Iter ${this.iteration}: Swapped edges (${i}, ${k}). Reduced tour length by ${diff.toFixed(2)}.`
      );
    } else {
      this.lastStepDescription = `Iter ${this.iteration}: Checked edge swap (${i}, ${k}). No distance gain.`;
    }

    // Advance pointers to next edge pair
    this.currentK++;
    if (this.currentK >= n) {
      this.currentI++;
      this.currentK = this.currentI + 2;
    }

    // If full pass completed
    if (this.currentI >= n - 1) {
      if (!this.improvedInPass) {
        // Local minimum reached! No edges could be swapped to improve tour length.
        this.isFinished = true;
        this.activeSwapPair = null;
        this.lastStepDescription = `2-opt Local Search reached local optimum! Total distance: ${this.bestDistance.toFixed(2)}`;
      } else {
        // Reset pass pointers for another sweep
        this.currentI = 0;
        this.currentK = 2;
        this.improvedInPass = false;
      }
    }

    return this.getState();
  }

  getState() {
    const base = super.getState();
    return {
      ...base,
      activeSwapPair: this.activeSwapPair
    };
  }
}
