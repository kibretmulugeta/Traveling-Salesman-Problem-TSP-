/**
 * Held-Karp Dynamic Programming Exact Solver for TSP.
 * Guarantees optimal tour in O(N^2 * 2^N) time.
 * Safe limit: N <= 15 cities.
 */
import { BaseAlgorithm } from './BaseAlgorithm.js';

export class HeldKarpAlgorithm extends BaseAlgorithm {
  constructor() {
    super('Held-Karp (Exact DP)', 'held_karp');
    this.memo = null;
    this.parent = null;
    this.subsets = [];
    this.stepIndex = 0;
  }

  initialize(cities, params = {}, rng = Math.random) {
    super.initialize(cities, params, rng);
    const n = cities.length;

    if (n > 15) {
      throw new Error(`Held-Karp safety limit exceeded! Selected ${n} cities, max allowed for DP solver is 15.`);
    }

    const numStates = 1 << n;
    this.memo = Array.from({ length: numStates }, () => new Float64Array(n).fill(Infinity));
    this.parent = Array.from({ length: numStates }, () => new Int32Array(n).fill(-1));

    // Base case: starting at city 0 with mask (1 << 0)
    this.memo[1][0] = 0;

    // Build subsets grouped by bit counts (popcount)
    this.subsets = [];
    for (let mask = 1; mask < numStates; mask++) {
      if (mask & 1) { // Mask must include starting city 0
        const popCount = this.getPopCount(mask);
        if (!this.subsets[popCount]) this.subsets[popCount] = [];
        this.subsets[popCount].push(mask);
      }
    }

    this.stepIndex = 2; // Start from size 2 subsets up to n
    this.lastStepDescription = `Initialized Held-Karp DP table for ${n} cities (${numStates} subproblems).`;
  }

  getPopCount(n) {
    let count = 0;
    while (n > 0) {
      n &= n - 1;
      count++;
    }
    return count;
  }

  step() {
    if (this.isFinished) {
      return this.getState();
    }

    const n = this.cities.length;

    if (this.stepIndex <= n) {
      const masks = this.subsets[this.stepIndex] || [];
      for (let mask of masks) {
        for (let u = 0; u < n; u++) {
          if (!(mask & (1 << u))) continue;

          const prevMask = mask ^ (1 << u);
          for (let v = 0; v < n; v++) {
            if (!(prevMask & (1 << v))) continue;

            const newDist = this.memo[prevMask][v] + this.matrix[v][u];
            if (newDist < this.memo[mask][u]) {
              this.memo[mask][u] = newDist;
              this.parent[mask][u] = v;
            }
          }
        }
      }

      this.iteration++;
      this.lastStepDescription = `Held-Karp DP: Computed optimal paths for sub-tours of size ${this.stepIndex}/${n}.`;
      this.stepIndex++;
    } else {
      // Reconstruct optimal full Hamiltonian cycle
      const fullMask = (1 << n) - 1;
      let minCost = Infinity;
      let lastNode = -1;

      for (let u = 1; u < n; u++) {
        const cost = this.memo[fullMask][u] + this.matrix[u][0];
        if (cost < minCost) {
          minCost = cost;
          lastNode = u;
        }
      }

      // Trace back route
      const optimalRoute = [];
      let currMask = fullMask;
      let currNode = lastNode;

      while (currNode !== -1) {
        optimalRoute.push(currNode);
        const prevNode = this.parent[currMask][currNode];
        currMask ^= 1 << currNode;
        currNode = prevNode;
      }

      optimalRoute.reverse();

      this.currentRoute = [...optimalRoute];
      this.currentDistance = minCost;
      this.initialDistance = minCost;

      this.updateBest(
        optimalRoute,
        minCost,
        `Held-Karp Exact DP solver completed! Mathematically optimal tour: ${minCost.toFixed(2)}`
      );

      this.isFinished = true;
      this.lastStepDescription = `Held-Karp optimal solution verified: ${minCost.toFixed(2)}`;
    }

    return this.getState();
  }
}
