/**
 * Ant Colony Optimization (ACO) Algorithm for TSP.
 * Simulates artificial ants depositing pheromones along candidate paths.
 */
import { BaseAlgorithm } from './BaseAlgorithm.js';

export class AntColonyOptimization extends BaseAlgorithm {
  constructor() {
    super('Ant Colony Optimization', 'ant_colony');
    this.numAnts = 20;
    this.alpha = 1.0; // Pheromone importance
    this.beta = 2.5;  // Heuristic importance
    this.evaporationRate = 0.1; // rho (0 - 1)
    this.Q = 100;
    this.maxIterations = 200;

    this.pheromones = null;
    this.heuristics = null;
    this.iterationBestRoute = [];
    this.iterationBestDistance = Infinity;
  }

  initialize(cities, params = {}, rng = Math.random) {
    super.initialize(cities, params, rng);
    this.numAnts = params.numAnts || 20;
    this.alpha = params.alpha !== undefined ? params.alpha : 1.0;
    this.beta = params.beta !== undefined ? params.beta : 2.5;
    this.evaporationRate = params.evaporationRate !== undefined ? params.evaporationRate : 0.1;
    this.Q = params.Q || 100;
    this.maxIterations = params.maxIterations || 200;

    const n = cities.length;

    // Initialize Heuristic Matrix eta = 1 / distance
    this.heuristics = Array.from({ length: n }, () => new Float64Array(n));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && this.matrix[i][j] > 0) {
          this.heuristics[i][j] = 1.0 / this.matrix[i][j];
        } else {
          this.heuristics[i][j] = 0;
        }
      }
    }

    // Initial pheromone tau0 = 1.0
    const initialTau = 1.0;
    this.pheromones = Array.from({ length: n }, () => new Float64Array(n).fill(initialTau));

    this.lastStepDescription = `Initialized ACO with ${this.numAnts} ants, α=${this.alpha}, β=${this.beta}, ρ=${this.evaporationRate}.`;
  }

  constructAntTour(startCity) {
    const n = this.cities.length;
    const tour = [startCity];
    const visited = new Set([startCity]);

    let curr = startCity;
    while (tour.length < n) {
      // Calculate probabilities for unvisited neighbors
      let sumProb = 0;
      const probabilities = new Float64Array(n);

      for (let j = 0; j < n; j++) {
        if (!visited.has(j)) {
          const tau = Math.pow(this.pheromones[curr][j], this.alpha);
          const eta = Math.pow(this.heuristics[curr][j], this.beta);
          const prob = tau * eta;
          probabilities[j] = prob;
          sumProb += prob;
        }
      }

      // Select next city using roulette wheel selection
      let nextCity = -1;
      if (sumProb > 0) {
        let rand = this.rng() * sumProb;
        for (let j = 0; j < n; j++) {
          if (!visited.has(j)) {
            rand -= probabilities[j];
            if (rand <= 0) {
              nextCity = j;
              break;
            }
          }
        }
      }

      // Fallback if precision error occurs
      if (nextCity === -1) {
        for (let j = 0; j < n; j++) {
          if (!visited.has(j)) {
            nextCity = j;
            break;
          }
        }
      }

      tour.push(nextCity);
      visited.add(nextCity);
      curr = nextCity;
    }

    return tour;
  }

  step() {
    if (this.isFinished) {
      return this.getState();
    }

    if (this.iteration >= this.maxIterations) {
      this.isFinished = true;
      this.lastStepDescription = `ACO completed after ${this.maxIterations} iterations. Best distance: ${this.bestDistance.toFixed(2)}`;
      return this.getState();
    }

    this.iteration++;
    const n = this.cities.length;

    // 1. Construct tours for all ants
    const antTours = [];
    const antDistances = [];
    let iterBestDist = Infinity;
    let iterBestIdx = 0;

    for (let k = 0; k < this.numAnts; k++) {
      const startCity = k % n;
      const tour = this.constructAntTour(startCity);
      const dist = this.evaluateRoute(tour);

      antTours.push(tour);
      antDistances.push(dist);

      if (dist < iterBestDist) {
        iterBestDist = dist;
        iterBestIdx = k;
      }
    }

    this.iterationBestRoute = [...antTours[iterBestIdx]];
    this.iterationBestDistance = iterBestDist;
    this.currentRoute = [...antTours[iterBestIdx]];
    this.currentDistance = iterBestDist;

    if (this.initialDistance === Infinity) {
      this.initialDistance = iterBestDist;
    }

    // 2. Evaporate Pheromones
    const rho = this.evaporationRate;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.pheromones[i][j] = (1.0 - rho) * this.pheromones[i][j];
      }
    }

    // 3. Deposit Pheromones from ant tours
    for (let k = 0; k < this.numAnts; k++) {
      const tour = antTours[k];
      const dist = antDistances[k];
      const deltaTau = this.Q / dist;

      for (let i = 0; i < n; i++) {
        const u = tour[i];
        const v = tour[(i + 1) % n];
        this.pheromones[u][v] += deltaTau;
        this.pheromones[v][u] += deltaTau;
      }
    }

    // 4. Extra reinforcement for global best route
    if (this.bestRoute.length > 0) {
      const bestDelta = (2 * this.Q) / this.bestDistance;
      for (let i = 0; i < n; i++) {
        const u = this.bestRoute[i];
        const v = this.bestRoute[(i + 1) % n];
        this.pheromones[u][v] += bestDelta;
        this.pheromones[v][u] += bestDelta;
      }
    }

    const isNewBest = this.updateBest(
      this.iterationBestRoute,
      this.iterationBestDistance,
      `Iter ${this.iteration}: Found new global best ant route! Distance: ${iterBestDist.toFixed(2)}`
    );

    if (!isNewBest) {
      this.lastStepDescription = `Iteration ${this.iteration}: Ant colony best tour distance ${iterBestDist.toFixed(2)}`;
    }

    return this.getState();
  }

  getState() {
    const base = super.getState();
    return {
      ...base,
      numAnts: this.numAnts,
      alpha: this.alpha,
      beta: this.beta,
      evaporationRate: this.evaporationRate,
      iterationBestDistance: this.iterationBestDistance,
      // Provide copy of pheromone matrix for Canvas intensity visualization
      pheromones: this.pheromones
        ? this.pheromones.map((row) => Array.from(row))
        : null
    };
  }
}
