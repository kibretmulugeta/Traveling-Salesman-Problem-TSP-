/**
 * Simulated Annealing (SA) Algorithm for TSP.
 * Explores solution space by accepting moves based on Metropolis criteria as temperature drops.
 */
import { BaseAlgorithm } from './BaseAlgorithm.js';
import { generateRandomRoute, twoOptSwap, swapElements } from '../core/routeUtils.js';

export class SimulatedAnnealingAlgorithm extends BaseAlgorithm {
  constructor() {
    super('Simulated Annealing', 'simulated_annealing');
    this.temp = 1000;
    this.initialTemp = 1000;
    this.minTemp = 0.01;
    this.coolingRate = 0.995;
    this.maxIterations = 5000;
    this.acceptedMoves = 0;
    this.rejectedMoves = 0;
    this.lastDecision = 'accepted'; // 'accepted' | 'rejected' | 'best'
  }

  initialize(cities, params = {}, rng = Math.random) {
    super.initialize(cities, params, rng);
    this.initialTemp = params.initialTemp || 1000;
    this.temp = this.initialTemp;
    this.minTemp = params.minTemp || 0.01;
    this.coolingRate = params.coolingRate || 0.995;
    this.maxIterations = params.maxIterations || 5000;
    this.acceptedMoves = 0;
    this.rejectedMoves = 0;

    this.currentRoute = generateRandomRoute(cities.length, this.rng);
    this.currentDistance = this.evaluateRoute(this.currentRoute);
    this.initialDistance = this.currentDistance;

    this.bestRoute = [...this.currentRoute];
    this.bestDistance = this.currentDistance;

    this.lastStepDescription = `Initialized SA with T0=${this.initialTemp}, cooling rate=${this.coolingRate}.`;
  }

  step() {
    if (this.isFinished) {
      return this.getState();
    }

    if (this.temp <= this.minTemp || this.iteration >= this.maxIterations) {
      this.isFinished = true;
      this.lastStepDescription = `SA completed at Temp ${this.temp.toFixed(4)}. Best distance: ${this.bestDistance.toFixed(2)}`;
      return this.getState();
    }

    this.iteration++;
    const n = this.cities.length;

    // 1. Generate neighbor using 2-opt edge swap or node swap
    const i = Math.floor(this.rng() * n);
    const j = Math.floor(this.rng() * n);
    const start = Math.min(i, j);
    const end = Math.max(i, j);

    let candidateRoute;
    if (end - start > 1) {
      candidateRoute = twoOptSwap(this.currentRoute, start, end);
    } else {
      candidateRoute = swapElements(this.currentRoute, i, j);
    }

    const candidateDistance = this.evaluateRoute(candidateRoute);
    const delta = candidateDistance - this.currentDistance;

    // 2. Metropolis Acceptance Criteria
    let accept = false;
    if (delta < 0) {
      accept = true;
    } else {
      const prob = Math.exp(-delta / this.temp);
      if (this.rng() < prob) {
        accept = true;
      }
    }

    if (accept) {
      this.currentRoute = candidateRoute;
      this.currentDistance = candidateDistance;
      this.acceptedMoves++;

      const isNewBest = this.updateBest(
        candidateRoute,
        candidateDistance,
        `Iter ${this.iteration}: Temp ${this.temp.toFixed(1)}° - New best route found! Dist: ${candidateDistance.toFixed(2)}`
      );

      this.lastDecision = isNewBest ? 'best' : 'accepted';
      if (!isNewBest) {
        this.lastStepDescription = `Iter ${this.iteration}: Accepted candidate move (dist ${candidateDistance.toFixed(1)}, Δ: ${delta > 0 ? '+' : ''}${delta.toFixed(1)}). Temp: ${this.temp.toFixed(1)}°`;
      }
    } else {
      this.rejectedMoves++;
      this.lastDecision = 'rejected';
      this.lastStepDescription = `Iter ${this.iteration}: Rejected worse move (Δ: +${delta.toFixed(1)}). Temp: ${this.temp.toFixed(1)}°`;
    }

    // 3. Cool down temperature
    this.temp *= this.coolingRate;

    return this.getState();
  }

  getState() {
    const base = super.getState();
    return {
      ...base,
      temp: this.temp,
      initialTemp: this.initialTemp,
      minTemp: this.minTemp,
      coolingRate: this.coolingRate,
      acceptedMoves: this.acceptedMoves,
      rejectedMoves: this.rejectedMoves,
      lastDecision: this.lastDecision
    };
  }
}
