/**
 * Web Worker for running TSP optimization calculations asynchronously
 * off the UI main thread.
 */

import { createAlgorithmInstance } from '../algorithms/index.js';
import { createPRNG } from '../core/random.js';

let algoInstance = null;
let isRunning = false;
let runTimer = null;
let speedDelay = 50; // ms between worker updates

self.onmessage = function (e) {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT': {
      const { cities, algorithmId, params, seed } = payload;
      const rng = seed !== undefined && seed !== null && seed !== '' ? createPRNG(seed) : Math.random;

      algoInstance = createAlgorithmInstance(algorithmId);
      algoInstance.initialize(cities, params, rng);

      if (runTimer) clearInterval(runTimer);
      isRunning = false;

      self.postMessage({
        type: 'STATE_UPDATE',
        payload: algoInstance.getState()
      });
      break;
    }

    case 'STEP': {
      if (!algoInstance) return;
      const count = payload?.count || 1;
      let state;
      for (let i = 0; i < count; i++) {
        state = algoInstance.step();
        if (state.isFinished) break;
      }
      self.postMessage({
        type: 'STATE_UPDATE',
        payload: state
      });
      break;
    }

    case 'RUN': {
      if (!algoInstance) return;
      speedDelay = payload?.speedDelay ?? 50;
      isRunning = true;

      if (runTimer) clearInterval(runTimer);

      const batchSteps = payload?.batchSteps ?? 1;

      runTimer = setInterval(() => {
        if (!isRunning || !algoInstance) {
          clearInterval(runTimer);
          return;
        }

        let state;
        for (let b = 0; b < batchSteps; b++) {
          state = algoInstance.step();
          if (state.isFinished) break;
        }

        self.postMessage({
          type: 'STATE_UPDATE',
          payload: state
        });

        if (state.isFinished) {
          isRunning = false;
          clearInterval(runTimer);
          self.postMessage({ type: 'COMPLETE', payload: state });
        }
      }, Math.max(5, speedDelay));

      break;
    }

    case 'PAUSE': {
      isRunning = false;
      if (runTimer) clearInterval(runTimer);
      if (algoInstance) {
        self.postMessage({
          type: 'STATE_UPDATE',
          payload: algoInstance.getState()
        });
      }
      break;
    }

    case 'RESET': {
      isRunning = false;
      if (runTimer) clearInterval(runTimer);
      if (algoInstance) {
        algoInstance.reset();
        self.postMessage({
          type: 'STATE_UPDATE',
          payload: algoInstance.getState()
        });
      }
      break;
    }

    default:
      break;
  }
};
