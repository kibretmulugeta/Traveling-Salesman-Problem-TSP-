/**
 * Nearest Neighbor Heuristic Algorithm for TSP.
 * Constructs route greedily by selecting nearest unvisited city at each step.
 */
import { BaseAlgorithm } from './BaseAlgorithm.js';

export class NearestNeighborAlgorithm extends BaseAlgorithm {
  constructor() {
    super('Nearest Neighbor', 'nearest_neighbor');
    this.startCityIndex = 0;
    this.visitedSet = new Set();
    this.route = [];
  }

  initialize(cities, params = {}, rng = Math.random) {
    super.initialize(cities, params, rng);
    this.startCityIndex = params.startCity !== undefined ? Math.min(params.startCity, cities.length - 1) : 0;
    this.route = [this.startCityIndex];
    this.visitedSet = new Set([this.startCityIndex]);

    this.currentRoute = [...this.route];
    this.bestRoute = [...this.route];
    this.currentDistance = 0;
    this.bestDistance = Infinity;
    this.lastStepDescription = `Started Nearest Neighbor from City ${this.startCityIndex + 1}.`;
  }

  step() {
    if (this.isFinished) {
      return this.getState();
    }

    const n = this.cities.length;
    if (this.route.length < n) {
      const currentCity = this.route[this.route.length - 1];
      let nearestIndex = -1;
      let minDistance = Infinity;

      for (let j = 0; j < n; j++) {
        if (!this.visitedSet.has(j)) {
          const dist = this.matrix[currentCity][j];
          if (dist < minDistance) {
            minDistance = dist;
            nearestIndex = j;
          }
        }
      }

      if (nearestIndex !== -1) {
        this.route.push(nearestIndex);
        this.visitedSet.add(nearestIndex);
        this.iteration++;
        this.currentRoute = [...this.route];
        this.currentDistance = this.evaluateRoute(this.currentRoute);

        this.lastStepDescription = `Iteration ${this.iteration}: Added City ${nearestIndex + 1} (dist ${minDistance.toFixed(1)}) as nearest unvisited neighbor.`;
      }
    } else {
      // Completed visiting all cities, close the Hamiltonian cycle
      this.isFinished = true;
      this.iteration++;
      this.currentRoute = [...this.route];
      const dist = this.evaluateRoute(this.currentRoute);
      this.currentDistance = dist;
      this.initialDistance = dist;
      this.updateBest(this.currentRoute, dist, `Completed Nearest Neighbor tour. Total distance: ${dist.toFixed(2)}`);
    }

    return this.getState();
  }
}
