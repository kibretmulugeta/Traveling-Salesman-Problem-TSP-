/**
 * Base abstract class defining uniform interface for all TSP algorithms.
 */
import { createDistanceMatrix, calculateRouteLengthFromMatrix } from '../core/distance.js';

export class BaseAlgorithm {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.cities = [];
    this.matrix = null;
    this.params = {};
    this.rng = Math.random;
    this.iteration = 0;
    this.isFinished = false;

    this.bestRoute = [];
    this.bestDistance = Infinity;
    this.currentRoute = [];
    this.currentDistance = Infinity;
    this.initialDistance = Infinity;
    this.improvementCount = 0;
    this.lastStepDescription = 'Initialized algorithm.';
  }

  /**
   * Initializes the algorithm with cities, parameters, and random generator.
   * @param {Array<{x: number, y: number}>} cities 
   * @param {Object} params 
   * @param {Function} [rng] 
   */
  initialize(cities, params = {}, rng = Math.random) {
    this.cities = cities;
    this.matrix = createDistanceMatrix(cities);
    this.params = params;
    this.rng = rng;
    this.iteration = 0;
    this.isFinished = false;
    this.bestRoute = [];
    this.bestDistance = Infinity;
    this.currentRoute = [];
    this.currentDistance = Infinity;
    this.initialDistance = Infinity;
    this.improvementCount = 0;
    this.lastStepDescription = 'Initialized algorithm.';
  }

  /**
   * Executes a single step of optimization. Must be overridden.
   * @returns {Object} Step state result
   */
  step() {
    throw new Error('step() method must be implemented by subclass.');
  }

  /**
   * Returns current execution state snapshot.
   */
  getState() {
    return {
      id: this.id,
      name: this.name,
      iteration: this.iteration,
      isFinished: this.isFinished,
      bestRoute: [...this.bestRoute],
      bestDistance: this.bestDistance,
      currentRoute: [...this.currentRoute],
      currentDistance: this.currentDistance,
      initialDistance: this.initialDistance,
      improvementCount: this.improvementCount,
      stepDescription: this.lastStepDescription
    };
  }

  isComplete() {
    return this.isFinished;
  }

  getBestSolution() {
    return {
      route: [...this.bestRoute],
      distance: this.bestDistance
    };
  }

  getMetrics() {
    return {
      iteration: this.iteration,
      bestDistance: this.bestDistance,
      currentDistance: this.currentDistance,
      improvements: this.improvementCount
    };
  }

  reset() {
    this.iteration = 0;
    this.isFinished = false;
    this.bestRoute = [];
    this.bestDistance = Infinity;
    this.currentRoute = [];
    this.currentDistance = Infinity;
    this.initialDistance = Infinity;
    this.improvementCount = 0;
    this.lastStepDescription = 'Reset algorithm.';
  }

  /**
   * Evaluates route distance fast from cached matrix.
   */
  evaluateRoute(route) {
    return calculateRouteLengthFromMatrix(route, this.matrix);
  }

  /**
   * Updates best solution tracking.
   */
  updateBest(route, dist, description = '') {
    if (dist < this.bestDistance - 1e-6) {
      this.bestDistance = dist;
      this.bestRoute = [...route];
      this.improvementCount++;
      if (description) {
        this.lastStepDescription = description;
      }
      return true;
    }
    return false;
  }
}
