/**
 * Discrete Particle Swarm Optimization (PSO) for TSP.
 * Positions are city permutations. Velocities are sequences of swap operators (i, j).
 */
import { BaseAlgorithm } from './BaseAlgorithm.js';
import { generateRandomRoute } from '../core/routeUtils.js';

export class ParticleSwarmOptimization extends BaseAlgorithm {
  constructor() {
    super('Particle Swarm Optimization', 'particle_swarm');
    this.numParticles = 30;
    this.maxIterations = 300;
    this.w = 0.5;  // Inertia weight
    this.c1 = 1.5; // Cognitive weight (pBest)
    this.c2 = 1.5; // Social weight (gBest)

    this.particles = [];
  }

  initialize(cities, params = {}, rng = Math.random) {
    super.initialize(cities, params, rng);
    this.numParticles = params.numParticles || 30;
    this.maxIterations = params.maxIterations || 300;
    this.w = params.w !== undefined ? params.w : 0.5;
    this.c1 = params.c1 !== undefined ? params.c1 : 1.5;
    this.c2 = params.c2 !== undefined ? params.c2 : 1.5;

    const n = cities.length;
    this.particles = [];
    let bestDist = Infinity;
    let bestIdx = 0;

    for (let p = 0; p < this.numParticles; p++) {
      const position = generateRandomRoute(n, this.rng);
      const dist = this.evaluateRoute(position);
      const velocity = []; // Array of swap tuples [i, j]

      this.particles.push({
        position: [...position],
        pBest: [...position],
        pBestDistance: dist,
        velocity
      });

      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = p;
      }
    }

    this.initialDistance = bestDist;
    this.currentRoute = [...this.particles[bestIdx].position];
    this.currentDistance = bestDist;

    this.updateBest(
      this.particles[bestIdx].position,
      bestDist,
      `Initialized PSO with ${this.numParticles} particles. Initial best dist: ${bestDist.toFixed(2)}`
    );
  }

  /**
   * Computes sequence of basic swap operations needed to transform `source` route into `target` route.
   */
  getSwapSequence(source, target) {
    const temp = [...source];
    const sequence = [];
    const n = temp.length;

    for (let i = 0; i < n; i++) {
      if (temp[i] !== target[i]) {
        const targetVal = target[i];
        const j = temp.indexOf(targetVal, i);
        if (j > i) {
          // Swap elements at i and j
          [temp[i], temp[j]] = [temp[j], temp[i]];
          sequence.push([i, j]);
        }
      }
    }

    return sequence;
  }

  /**
   * Applies swap sequence to route.
   */
  applySwapSequence(route, sequence) {
    const result = [...route];
    for (let [i, j] of sequence) {
      if (i >= 0 && i < result.length && j >= 0 && j < result.length) {
        [result[i], result[j]] = [result[j], result[i]];
      }
    }
    return result;
  }

  step() {
    if (this.isFinished) {
      return this.getState();
    }

    if (this.iteration >= this.maxIterations) {
      this.isFinished = true;
      this.lastStepDescription = `PSO completed after ${this.maxIterations} iterations. Best distance: ${this.bestDistance.toFixed(2)}`;
      return this.getState();
    }

    this.iteration++;

    let iterBestDist = Infinity;
    let iterBestIdx = 0;

    for (let p = 0; p < this.numParticles; p++) {
      const particle = this.particles[p];

      // 1. Compute velocity components towards pBest and gBest
      const pBestSwaps = this.getSwapSequence(particle.position, particle.pBest);
      const gBestSwaps = this.getSwapSequence(particle.position, this.bestRoute);

      const newVelocity = [];

      // Retain inertia portion of previous velocity
      for (let swap of particle.velocity) {
        if (this.rng() < this.w) {
          newVelocity.push(swap);
        }
      }

      // Add cognitive swaps (c1)
      for (let swap of pBestSwaps) {
        if (this.rng() < this.c1 / 2.0) {
          newVelocity.push(swap);
        }
      }

      // Add social swaps (c2)
      for (let swap of gBestSwaps) {
        if (this.rng() < this.c2 / 2.0) {
          newVelocity.push(swap);
        }
      }

      particle.velocity = newVelocity;

      // 2. Apply new velocity to update particle position
      const newPos = this.applySwapSequence(particle.position, newVelocity);
      const newDist = this.evaluateRoute(newPos);

      particle.position = newPos;

      // 3. Update personal best
      if (newDist < particle.pBestDistance) {
        particle.pBest = [...newPos];
        particle.pBestDistance = newDist;
      }

      if (newDist < iterBestDist) {
        iterBestDist = newDist;
        iterBestIdx = p;
      }
    }

    this.currentRoute = [...this.particles[iterBestIdx].position];
    this.currentDistance = iterBestDist;

    const isNewBest = this.updateBest(
      this.currentRoute,
      this.currentDistance,
      `Iter ${this.iteration}: Found new global best swarm position! Distance: ${iterBestDist.toFixed(2)}`
    );

    if (!isNewBest) {
      this.lastStepDescription = `Iteration ${this.iteration}: Swarm current best position distance ${iterBestDist.toFixed(2)}`;
    }

    return this.getState();
  }

  getState() {
    const base = super.getState();
    return {
      ...base,
      numParticles: this.numParticles,
      w: this.w,
      c1: this.c1,
      c2: this.c2
    };
  }
}
