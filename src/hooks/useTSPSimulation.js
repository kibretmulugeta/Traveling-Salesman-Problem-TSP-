/**
 * Custom React hook for controlling TSP simulation, playback, animation speeds,
 * metrics history, and worker thread synchronization.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { createAlgorithmInstance } from '../algorithms/index.js';
import { createPRNG } from '../core/random.js';
import { calculateImprovement, calculateIterationsPerSec } from '../core/metrics.js';

export function useTSPSimulation() {
  const [cities, setCities] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('genetic_algorithm');
  const [algorithmParams, setAlgorithmParams] = useState({
    // GA
    popSize: 100,
    maxGenerations: 500,
    mutationRate: 0.05,
    crossoverRate: 0.85,
    elitismCount: 2,
    selectionMethod: 'tournament',
    // SA
    initialTemp: 1000,
    coolingRate: 0.995,
    minTemp: 0.01,
    maxIterations: 5000,
    // ACO
    numAnts: 20,
    alpha: 1.0,
    beta: 2.5,
    evaporationRate: 0.1,
    Q: 100,
    // PSO
    numParticles: 30,
    w: 0.5,
    c1: 1.5,
    c2: 1.5
  });

  const [seed, setSeed] = useState('');
  const [speedLevel, setSpeedLevel] = useState('normal'); // 'very_slow' | 'slow' | 'normal' | 'fast' | 'very_fast'
  const [status, setStatus] = useState('ready'); // 'ready' | 'running' | 'paused' | 'completed' | 'stopped'

  // Algorithmic state
  const [simState, setSimState] = useState({
    iteration: 0,
    isFinished: false,
    bestRoute: [],
    bestDistance: 0,
    currentRoute: [],
    currentDistance: 0,
    initialDistance: 0,
    improvementCount: 0,
    stepDescription: 'Select an algorithm and click Start.',
    pheromones: null,
    activeSwapPair: null,
    populationSample: null,
    temp: 1000
  });

  // Convergence data points for line chart
  const [convergenceHistory, setConvergenceHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Direct engine fallback instance if web worker isn't used
  const directAlgoRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Speed configuration map (delay ms and batch size)
  const SPEED_CONFIG = {
    very_slow: { delay: 400, batch: 1 },
    slow: { delay: 150, batch: 1 },
    normal: { delay: 40, batch: 1 },
    fast: { delay: 10, batch: 3 },
    very_fast: { delay: 5, batch: 10 }
  };

  /**
   * Initializes or resets the current algorithm instance.
   */
  const initializeSimulation = useCallback(
    (customCities, algoId, paramsObj, currentSeed) => {
      const targetCities = customCities || cities;
      const targetAlgo = algoId || selectedAlgorithm;
      const targetParams = paramsObj || algorithmParams;
      const targetSeed = currentSeed !== undefined ? currentSeed : seed;

      if (!targetCities || targetCities.length === 0) return;

      const rng = targetSeed !== '' && targetSeed !== null ? createPRNG(targetSeed) : Math.random;

      try {
        const instance = createAlgorithmInstance(targetAlgo);
        instance.initialize(targetCities, targetParams, rng);
        directAlgoRef.current = instance;

        const initialState = instance.getState();
        setSimState(initialState);
        setStatus('ready');
        setConvergenceHistory([
          {
            iteration: 0,
            bestDistance: initialState.bestDistance,
            currentDistance: initialState.currentDistance,
            avgDistance: initialState.avgDistance || initialState.currentDistance
          }
        ]);
        setElapsedTime(0);
        setStartTime(null);
        startTimeRef.current = null;
      } catch (err) {
        console.error('Simulation initialization error:', err);
      }
    },
    [cities, selectedAlgorithm, algorithmParams, seed]
  );

  // Update on city changes
  useEffect(() => {
    if (cities.length > 0 && status === 'ready') {
      initializeSimulation(cities, selectedAlgorithm, algorithmParams, seed);
    }
  }, [cities, selectedAlgorithm, algorithmParams, seed, initializeSimulation]);

  /**
   * Step function (execute 1 step)
   */
  const stepSimulation = useCallback(() => {
    if (!directAlgoRef.current) return;
    const nextState = directAlgoRef.current.step();
    setSimState({ ...nextState });

    setConvergenceHistory((prev) => [
      ...prev.slice(-300), // Cap history to 300 points for smooth performance
      {
        iteration: nextState.iteration,
        bestDistance: nextState.bestDistance,
        currentDistance: nextState.currentDistance,
        avgDistance: nextState.avgDistance || nextState.currentDistance
      }
    ]);

    if (nextState.isFinished) {
      setStatus('completed');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  /**
   * Play / Start simulation
   */
  const startSimulation = useCallback(() => {
    if (!directAlgoRef.current) return;
    if (status === 'completed' || status === 'stopped') {
      initializeSimulation();
    }

    setStatus('running');
    if (!startTimeRef.current) {
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    const config = SPEED_CONFIG[speedLevel] || SPEED_CONFIG.normal;

    timerRef.current = setInterval(() => {
      if (!directAlgoRef.current) return;

      let latestState;
      for (let b = 0; b < config.batch; b++) {
        latestState = directAlgoRef.current.step();
        if (latestState.isFinished) break;
      }

      setSimState({ ...latestState });
      if (startTimeRef.current) {
        setElapsedTime(Date.now() - startTimeRef.current);
      }

      setConvergenceHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.iteration === latestState.iteration) return prev;
        return [
          ...prev.slice(-300),
          {
            iteration: latestState.iteration,
            bestDistance: latestState.bestDistance,
            currentDistance: latestState.currentDistance,
            avgDistance: latestState.avgDistance || latestState.currentDistance
          }
        ];
      });

      if (latestState.isFinished) {
        setStatus('completed');
        clearInterval(timerRef.current);
      }
    }, config.delay);
  }, [status, speedLevel, initializeSimulation]);

  /**
   * Pause simulation
   */
  const pauseSimulation = useCallback(() => {
    setStatus('paused');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  /**
   * Stop simulation
   */
  const stopSimulation = useCallback(() => {
    setStatus('stopped');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  /**
   * Reset simulation
   */
  const resetSimulation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    initializeSimulation();
  }, [initializeSimulation]);

  /**
   * Skip to completion
   */
  const skipToCompletion = useCallback(() => {
    if (!directAlgoRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let state = directAlgoRef.current.getState();
    let steps = 0;
    const history = [];

    while (!state.isFinished && steps < 50000) {
      steps++;
      state = directAlgoRef.current.step();
      if (steps % 10 === 0 || state.isFinished) {
        history.push({
          iteration: state.iteration,
          bestDistance: state.bestDistance,
          currentDistance: state.currentDistance,
          avgDistance: state.avgDistance || state.currentDistance
        });
      }
    }

    setSimState({ ...state });
    setConvergenceHistory(history);
    setStatus('completed');
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Calculate metrics
  const improvementPct = calculateImprovement(simState.initialDistance, simState.bestDistance);
  const iterPerSec = calculateIterationsPerSec(simState.iteration, elapsedTime);

  return {
    cities,
    setCities,
    selectedAlgorithm,
    setSelectedAlgorithm,
    algorithmParams,
    setAlgorithmParams,
    seed,
    setSeed,
    speedLevel,
    setSpeedLevel,
    status,
    simState,
    convergenceHistory,
    elapsedTime,
    improvementPct,
    iterPerSec,
    // Actions
    initializeSimulation,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    resetSimulation,
    stepSimulation,
    skipToCompletion
  };
}
