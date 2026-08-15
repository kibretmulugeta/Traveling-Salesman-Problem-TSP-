import { describe, it, expect } from 'vitest';
import { euclideanDistance, calculateRouteLength, createDistanceMatrix } from '../core/distance.js';
import { isValidRoute, generateRandomRoute, twoOptSwap } from '../core/routeUtils.js';
import { NearestNeighborAlgorithm } from '../algorithms/nearestNeighbor.js';
import { GeneticAlgorithm } from '../algorithms/geneticAlgorithm.js';
import { SimulatedAnnealingAlgorithm } from '../algorithms/simulatedAnnealing.js';
import { AntColonyOptimization } from '../algorithms/antColonyOptimization.js';
import { ParticleSwarmOptimization } from '../algorithms/particleSwarmOptimization.js';
import { TwoOptAlgorithm } from '../algorithms/twoOpt.js';
import { BruteForceAlgorithm } from '../algorithms/bruteForce.js';
import { HeldKarpAlgorithm } from '../algorithms/heldKarp.js';

describe('TSP Distance & Route Utilities', () => {
  it('calculates 2D Euclidean distance correctly', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 3, y: 4 };
    expect(euclideanDistance(p1, p2)).toBe(5);
  });

  it('validates complete Hamiltonian cycle permutations', () => {
    expect(isValidRoute([0, 1, 2, 3], 4)).toBe(true);
    expect(isValidRoute([0, 1, 2, 2], 4)).toBe(false); // Duplicate
    expect(isValidRoute([0, 1, 2], 4)).toBe(false);    // Incomplete
  });

  it('performs 2-opt edge swap correctly', () => {
    const route = [0, 1, 2, 3, 4];
    const swapped = twoOptSwap(route, 1, 3);
    expect(swapped).toEqual([0, 3, 2, 1, 4]);
    expect(isValidRoute(swapped, 5)).toBe(true);
  });
});

describe('TSP Core Optimization Algorithms', () => {
  const sampleCities = [
    { id: 0, name: 'C1', x: 0, y: 0 },
    { id: 1, name: 'C2', x: 0, y: 100 },
    { id: 2, name: 'C3', x: 100, y: 100 },
    { id: 3, name: 'C4', x: 100, y: 0 },
    { id: 4, name: 'C5', x: 50, y: 50 }
  ];

  it('Nearest Neighbor produces valid Hamiltonian route', () => {
    const nn = new NearestNeighborAlgorithm();
    nn.initialize(sampleCities);
    let state = nn.getState();
    while (!state.isFinished) {
      state = nn.step();
    }
    expect(isValidRoute(state.bestRoute, 5)).toBe(true);
    expect(state.bestDistance).toBeGreaterThan(0);
  });

  it('Genetic Algorithm evolves valid routes', () => {
    const ga = new GeneticAlgorithm();
    ga.initialize(sampleCities, { popSize: 20, maxGenerations: 20 });
    let state = ga.getState();
    for (let i = 0; i < 15; i++) {
      state = ga.step();
    }
    expect(isValidRoute(state.bestRoute, 5)).toBe(true);
  });

  it('Simulated Annealing produces valid routes', () => {
    const sa = new SimulatedAnnealingAlgorithm();
    sa.initialize(sampleCities, { initialTemp: 500, maxIterations: 50 });
    let state = sa.getState();
    for (let i = 0; i < 20; i++) {
      state = sa.step();
    }
    expect(isValidRoute(state.bestRoute, 5)).toBe(true);
  });

  it('Ant Colony Optimization produces valid ant routes and pheromones', () => {
    const aco = new AntColonyOptimization();
    aco.initialize(sampleCities, { numAnts: 5, maxIterations: 10 });
    let state = aco.getState();
    state = aco.step();
    expect(isValidRoute(state.bestRoute, 5)).toBe(true);
    expect(state.pheromones).not.toBeNull();
  });

  it('PSO produces valid permutation routes', () => {
    const pso = new ParticleSwarmOptimization();
    pso.initialize(sampleCities, { numParticles: 10, maxIterations: 10 });
    let state = pso.getState();
    state = pso.step();
    expect(isValidRoute(state.bestRoute, 5)).toBe(true);
  });

  it('2-opt local search finishes with valid route', () => {
    const opt = new TwoOptAlgorithm();
    opt.initialize(sampleCities);
    let state = opt.getState();
    for (let i = 0; i < 10; i++) {
      if (state.isFinished) break;
      state = opt.step();
    }
    expect(isValidRoute(state.bestRoute, 5)).toBe(true);
  });

  it('Exact solvers (Brute Force and Held-Karp) produce identical optimal tour length', () => {
    const bf = new BruteForceAlgorithm();
    bf.initialize(sampleCities);
    let bfState = bf.getState();
    while (!bfState.isFinished) {
      bfState = bf.step();
    }

    const hk = new HeldKarpAlgorithm();
    hk.initialize(sampleCities);
    let hkState = hk.getState();
    while (!hkState.isFinished) {
      hkState = hk.step();
    }

    expect(bfState.bestDistance).toBeCloseTo(hkState.bestDistance, 2);
  });
});
