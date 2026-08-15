/**
 * Genetic Algorithm (GA) for Traveling Salesman Problem.
 * Evolves a population of candidate permutation routes using selection, crossover, mutation, and elitism.
 */
import { BaseAlgorithm } from './BaseAlgorithm.js';
import { generateRandomRoute, twoOptSwap, swapElements, isValidRoute } from '../core/routeUtils.js';

export class GeneticAlgorithm extends BaseAlgorithm {
  constructor() {
    super('Genetic Algorithm', 'genetic_algorithm');
    this.population = [];
    this.fitnesses = [];
    this.distances = [];
    this.popSize = 100;
    this.maxGenerations = 500;
    this.mutationRate = 0.05;
    this.crossoverRate = 0.85;
    this.elitismCount = 2;
    this.selectionMethod = 'tournament'; // 'tournament' | 'roulette'
    this.tournamentSize = 5;
    this.avgDistance = 0;
  }

  initialize(cities, params = {}, rng = Math.random) {
    super.initialize(cities, params, rng);
    this.popSize = params.popSize || 100;
    this.maxGenerations = params.maxGenerations || 500;
    this.mutationRate = params.mutationRate !== undefined ? params.mutationRate : 0.05;
    this.crossoverRate = params.crossoverRate !== undefined ? params.crossoverRate : 0.85;
    this.elitismCount = params.elitismCount !== undefined ? Math.min(params.elitismCount, this.popSize) : 2;
    this.selectionMethod = params.selectionMethod || 'tournament';
    this.tournamentSize = params.tournamentSize || 5;

    const n = cities.length;
    this.population = [];
    for (let i = 0; i < this.popSize; i++) {
      this.population.push(generateRandomRoute(n, this.rng));
    }

    this.evaluatePopulation();
    this.initialDistance = this.bestDistance;
    this.lastStepDescription = `Initialized GA with population size ${this.popSize}.`;
  }

  evaluatePopulation() {
    this.distances = this.population.map((chrom) => this.evaluateRoute(chrom));
    this.fitnesses = this.distances.map((dist) => (dist > 0 ? 1 / dist : 0));

    let sumDist = 0;
    let minDist = Infinity;
    let minIdx = 0;

    for (let i = 0; i < this.popSize; i++) {
      const d = this.distances[i];
      sumDist += d;
      if (d < minDist) {
        minDist = d;
        minIdx = i;
      }
    }

    this.avgDistance = sumDist / this.popSize;
    this.currentRoute = [...this.population[minIdx]];
    this.currentDistance = minDist;

    this.updateBest(
      this.population[minIdx],
      minDist,
      `Gen ${this.iteration}: Found improved route with distance ${minDist.toFixed(2)}`
    );
  }

  selectParent() {
    if (this.selectionMethod === 'roulette') {
      const totalFitness = this.fitnesses.reduce((acc, f) => acc + f, 0);
      let rand = this.rng() * totalFitness;
      for (let i = 0; i < this.popSize; i++) {
        rand -= this.fitnesses[i];
        if (rand <= 0) return this.population[i];
      }
      return this.population[this.popSize - 1];
    } else {
      // Tournament selection
      let bestIdx = -1;
      let bestFit = -Infinity;
      for (let k = 0; k < this.tournamentSize; k++) {
        const randIdx = Math.floor(this.rng() * this.popSize);
        if (this.fitnesses[randIdx] > bestFit) {
          bestFit = this.fitnesses[randIdx];
          bestIdx = randIdx;
        }
      }
      return this.population[bestIdx];
    }
  }

  /**
   * Ordered Crossover (OX) for TSP permutations
   */
  orderedCrossover(parent1, parent2) {
    const n = parent1.length;
    if (this.rng() > this.crossoverRate || n <= 3) {
      return [...parent1];
    }

    const cut1 = Math.floor(this.rng() * n);
    const cut2 = Math.floor(this.rng() * n);
    const start = Math.min(cut1, cut2);
    const end = Math.max(cut1, cut2);

    const child = new Array(n).fill(-1);
    const inChild = new Set();

    for (let i = start; i <= end; i++) {
      child[i] = parent1[i];
      inChild.add(parent1[i]);
    }

    let childPos = (end + 1) % n;
    for (let i = 0; i < n; i++) {
      const p2Pos = (end + 1 + i) % n;
      const val = parent2[p2Pos];
      if (!inChild.has(val)) {
        child[childPos] = val;
        inChild.add(val);
        childPos = (childPos + 1) % n;
      }
    }

    return child;
  }

  mutate(chromosome) {
    if (this.rng() > this.mutationRate) return chromosome;
    const n = chromosome.length;
    if (n <= 3) return chromosome;

    const idx1 = Math.floor(this.rng() * n);
    const idx2 = Math.floor(this.rng() * n);

    if (this.rng() < 0.5) {
      // 2-opt inversion mutation
      return twoOptSwap(chromosome, Math.min(idx1, idx2), Math.max(idx1, idx2));
    } else {
      // Swap mutation
      return swapElements(chromosome, idx1, idx2);
    }
  }

  step() {
    if (this.isFinished) {
      return this.getState();
    }

    if (this.iteration >= this.maxGenerations) {
      this.isFinished = true;
      this.lastStepDescription = `GA completed after ${this.maxGenerations} generations. Best distance: ${this.bestDistance.toFixed(2)}`;
      return this.getState();
    }

    this.iteration++;

    // 1. Sort population by fitness for elitism
    const combined = this.population.map((chrom, i) => ({
      chrom,
      fit: this.fitnesses[i],
      dist: this.distances[i]
    }));
    combined.sort((a, b) => b.fit - a.fit);

    const newPopulation = [];

    // 2. Elitism
    for (let i = 0; i < this.elitismCount; i++) {
      newPopulation.push([...combined[i].chrom]);
    }

    // 3. Reproduce rest of population
    while (newPopulation.length < this.popSize) {
      const parent1 = this.selectParent();
      const parent2 = this.selectParent();
      const child = this.orderedCrossover(parent1, parent2);
      const mutatedChild = this.mutate(child);
      newPopulation.push(mutatedChild);
    }

    this.population = newPopulation;
    this.evaluatePopulation();

    this.lastStepDescription = `Generation ${this.iteration}: Best dist ${this.bestDistance.toFixed(2)}, Avg dist ${this.avgDistance.toFixed(2)}`;

    return this.getState();
  }

  getState() {
    const base = super.getState();
    return {
      ...base,
      popSize: this.popSize,
      mutationRate: this.mutationRate,
      crossoverRate: this.crossoverRate,
      avgDistance: this.avgDistance,
      // Sample 4 population candidates for population overlay preview
      populationSample: this.population.slice(0, 5)
    };
  }
}
