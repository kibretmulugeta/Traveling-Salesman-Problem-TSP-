/**
 * Dynamic parameter panel providing custom hyperparameter controls for each algorithm.
 */
import React from 'react';
import { Sliders } from 'lucide-react';

export function ParameterPanel({ selectedAlgorithm, algorithmParams, setAlgorithmParams, onReset }) {
  const updateParam = (key, value) => {
    setAlgorithmParams((prev) => ({
      ...prev,
      [key]: value
    }));
    onReset();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          Algorithm Hyperparameters
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">Live Configuration</span>
      </div>

      {/* Genetic Algorithm Parameters */}
      {selectedAlgorithm === 'genetic_algorithm' && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Pop Size ({algorithmParams.popSize})</label>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={algorithmParams.popSize}
              onChange={(e) => updateParam('popSize', parseInt(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Generations ({algorithmParams.maxGenerations})</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={algorithmParams.maxGenerations}
              onChange={(e) => updateParam('maxGenerations', parseInt(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Mutation Rate ({algorithmParams.mutationRate})</label>
            <input
              type="range"
              min="0.01"
              max="0.30"
              step="0.01"
              value={algorithmParams.mutationRate}
              onChange={(e) => updateParam('mutationRate', parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Crossover Rate ({algorithmParams.crossoverRate})</label>
            <input
              type="range"
              min="0.50"
              max="0.99"
              step="0.05"
              value={algorithmParams.crossoverRate}
              onChange={(e) => updateParam('crossoverRate', parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Elitism ({algorithmParams.elitismCount})</label>
            <input
              type="number"
              min="1"
              max="10"
              value={algorithmParams.elitismCount}
              onChange={(e) => updateParam('elitismCount', parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Selection Method</label>
            <select
              value={algorithmParams.selectionMethod}
              onChange={(e) => updateParam('selectionMethod', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
            >
              <option value="tournament">Tournament</option>
              <option value="roulette">Roulette Wheel</option>
            </select>
          </div>
        </div>
      )}

      {/* Simulated Annealing Parameters */}
      {selectedAlgorithm === 'simulated_annealing' && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Initial Temp ({algorithmParams.initialTemp})</label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={algorithmParams.initialTemp}
              onChange={(e) => updateParam('initialTemp', parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Cooling Rate ({algorithmParams.coolingRate})</label>
            <input
              type="range"
              min="0.900"
              max="0.999"
              step="0.001"
              value={algorithmParams.coolingRate}
              onChange={(e) => updateParam('coolingRate', parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Min Temp ({algorithmParams.minTemp})</label>
            <input
              type="number"
              step="0.001"
              value={algorithmParams.minTemp}
              onChange={(e) => updateParam('minTemp', parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Max Iterations ({algorithmParams.maxIterations})</label>
            <input
              type="number"
              step="500"
              value={algorithmParams.maxIterations}
              onChange={(e) => updateParam('maxIterations', parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
            />
          </div>
        </div>
      )}

      {/* ACO Parameters */}
      {selectedAlgorithm === 'ant_colony' && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Number of Ants ({algorithmParams.numAnts})</label>
            <input
              type="range"
              min="5"
              max="50"
              value={algorithmParams.numAnts}
              onChange={(e) => updateParam('numAnts', parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Evaporation Rate ({algorithmParams.evaporationRate})</label>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={algorithmParams.evaporationRate}
              onChange={(e) => updateParam('evaporationRate', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Alpha (Pheromone Weight: {algorithmParams.alpha})</label>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.5"
              value={algorithmParams.alpha}
              onChange={(e) => updateParam('alpha', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Beta (Heuristic Weight: {algorithmParams.beta})</label>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={algorithmParams.beta}
              onChange={(e) => updateParam('beta', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      )}

      {/* PSO Parameters */}
      {selectedAlgorithm === 'particle_swarm' && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Particles ({algorithmParams.numParticles})</label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={algorithmParams.numParticles}
              onChange={(e) => updateParam('numParticles', parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Inertia Weight w ({algorithmParams.w})</label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={algorithmParams.w}
              onChange={(e) => updateParam('w', parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Cognitive c1 ({algorithmParams.c1})</label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.2"
              value={algorithmParams.c1}
              onChange={(e) => updateParam('c1', parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Social c2 ({algorithmParams.c2})</label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.2"
              value={algorithmParams.c2}
              onChange={(e) => updateParam('c2', parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      )}

      {/* 2-opt Parameters */}
      {selectedAlgorithm === 'two_opt' && (
        <div className="text-xs text-slate-400">
          <p>2-opt systematically evaluates all O(N²) edge pairs. No extra parameters required.</p>
        </div>
      )}

      {/* Exact Solvers */}
      {(selectedAlgorithm === 'brute_force' || selectedAlgorithm === 'held_karp') && (
        <div className="text-xs text-slate-400">
          <p>Exact solvers guarantee mathematical optimality without probabilistic parameters.</p>
        </div>
      )}
    </div>
  );
}
