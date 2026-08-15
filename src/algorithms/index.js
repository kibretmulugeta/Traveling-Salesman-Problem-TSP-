/**
 * Factory and registry for all TSP optimization algorithms.
 */
import { NearestNeighborAlgorithm } from './nearestNeighbor.js';
import { GeneticAlgorithm } from './geneticAlgorithm.js';
import { SimulatedAnnealingAlgorithm } from './simulatedAnnealing.js';
import { AntColonyOptimization } from './antColonyOptimization.js';
import { ParticleSwarmOptimization } from './particleSwarmOptimization.js';
import { TwoOptAlgorithm } from './twoOpt.js';
import { BruteForceAlgorithm } from './bruteForce.js';
import { HeldKarpAlgorithm } from './heldKarp.js';

export const ALGORITHMS = [
  {
    id: 'nearest_neighbor',
    name: 'Nearest Neighbor',
    category: 'Heuristic',
    description: 'Fast greedy heuristic selecting the closest unvisited city at each step.',
    isExact: false,
    maxCities: 1000
  },
  {
    id: 'genetic_algorithm',
    name: 'Genetic Algorithm',
    category: 'Metaheuristic',
    description: 'Evolves a population of routes using ordered crossover, mutation, and selection.',
    isExact: false,
    maxCities: 500
  },
  {
    id: 'simulated_annealing',
    name: 'Simulated Annealing',
    category: 'Metaheuristic',
    description: 'Accepts candidate route changes based on temperature and Metropolis probability.',
    isExact: false,
    maxCities: 500
  },
  {
    id: 'ant_colony',
    name: 'Ant Colony Optimization',
    category: 'Metaheuristic',
    description: 'Artificial ants construct tours based on distance heuristics and pheromone trails.',
    isExact: false,
    maxCities: 300
  },
  {
    id: 'particle_swarm',
    name: 'Particle Swarm Optimization',
    category: 'Metaheuristic',
    description: 'Permutation PSO swarm using swap sequences attracted to personal & global bests.',
    isExact: false,
    maxCities: 300
  },
  {
    id: 'two_opt',
    name: '2-opt Local Search',
    category: 'Local Search',
    description: 'Systematically replaces pairs of edges to uncross intersecting route segments.',
    isExact: false,
    maxCities: 500
  },
  {
    id: 'brute_force',
    name: 'Brute Force (Exact)',
    category: 'Exact Solver',
    description: 'Exhaustively tests all permutations. Safe city limit: <= 9 cities.',
    isExact: true,
    maxCities: 9
  },
  {
    id: 'held_karp',
    name: 'Held-Karp (Exact DP)',
    category: 'Exact Solver',
    description: 'Dynamic programming solver guaranteeing mathematical optimum in O(N^2 * 2^N). Safe limit: <= 15 cities.',
    isExact: true,
    maxCities: 15
  }
];

export function createAlgorithmInstance(algorithmId) {
  switch (algorithmId) {
    case 'nearest_neighbor':
      return new NearestNeighborAlgorithm();
    case 'genetic_algorithm':
      return new GeneticAlgorithm();
    case 'simulated_annealing':
      return new SimulatedAnnealingAlgorithm();
    case 'ant_colony':
      return new AntColonyOptimization();
    case 'particle_swarm':
      return new ParticleSwarmOptimization();
    case 'two_opt':
      return new TwoOptAlgorithm();
    case 'brute_force':
      return new BruteForceAlgorithm();
    case 'held_karp':
      return new HeldKarpAlgorithm();
    default:
      return new GeneticAlgorithm();
  }
}
