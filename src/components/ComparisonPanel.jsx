/**
 * Algorithm Comparison Laboratory.
 * Runs multiple selected optimization algorithms on identical city dataset & seed,
 * comparing distance, execution time, and iterations side-by-side.
 */
import React, { useState } from 'react';
import { ALGORITHMS, createAlgorithmInstance } from '../algorithms/index.js';
import { createPRNG } from '../core/random.js';
import { formatDistance, formatTime, calculateImprovement } from '../core/metrics.js';
import { Play, BarChart2, CheckCircle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function ComparisonPanel({ cities, seed }) {
  const [selectedAlgoIds, setSelectedAlgoIds] = useState([
    'nearest_neighbor',
    'genetic_algorithm',
    'simulated_annealing',
    'ant_colony',
    'two_opt'
  ]);

  const [comparisonResults, setComparisonResults] = useState([]);
  const [isRunningComparison, setIsRunningComparison] = useState(false);

  const toggleAlgoSelection = (id) => {
    if (selectedAlgoIds.includes(id)) {
      if (selectedAlgoIds.length > 1) {
        setSelectedAlgoIds(selectedAlgoIds.filter((item) => item !== id));
      }
    } else {
      setSelectedAlgoIds([...selectedAlgoIds, id]);
    }
  };

  const runComparison = () => {
    if (!cities || cities.length === 0) return;
    setIsRunningComparison(true);
    setComparisonResults([]);

    setTimeout(() => {
      const results = [];

      selectedAlgoIds.forEach((algoId) => {
        const algoObj = ALGORITHMS.find((a) => a.id === algoId);
        if (!algoObj) return;

        // Skip exact solvers if city count exceeds safe limit
        if (algoObj.isExact && cities.length > algoObj.maxCities) {
          results.push({
            id: algoId,
            name: algoObj.name,
            bestDistance: null,
            executionTime: null,
            iterations: 0,
            improvement: 0,
            status: `Skipped (Exceeds max city limit of ${algoObj.maxCities})`
          });
          return;
        }

        const rng = seed ? createPRNG(seed) : Math.random;
        const instance = createAlgorithmInstance(algoId);

        try {
          instance.initialize(cities, {}, rng);
          const t0 = performance.now();

          let state = instance.getState();
          let steps = 0;
          const maxSteps = algoId === 'simulated_annealing' ? 5000 : 500;

          while (!state.isFinished && steps < maxSteps) {
            steps++;
            state = instance.step();
          }

          const t1 = performance.now();
          const execTime = t1 - t0;
          const improvement = calculateImprovement(state.initialDistance, state.bestDistance);

          results.push({
            id: algoId,
            name: algoObj.name,
            bestDistance: state.bestDistance,
            initialDistance: state.initialDistance,
            executionTime: execTime,
            iterations: state.iteration,
            improvement,
            status: 'Completed'
          });
        } catch (err) {
          results.push({
            id: algoId,
            name: algoObj.name,
            bestDistance: null,
            executionTime: null,
            iterations: 0,
            improvement: 0,
            status: `Error: ${err.message}`
          });
        }
      });

      setComparisonResults(results);
      setIsRunningComparison(false);
    }, 100);
  };

  // Prepare chart dataset
  const chartData = comparisonResults
    .filter((r) => r.bestDistance !== null)
    .map((r) => ({
      name: r.name,
      'Best Distance': Number(r.bestDistance.toFixed(2)),
      'Exec Time (ms)': Number(r.executionTime.toFixed(1))
    }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-5 w-full">
      {/* Title & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            Algorithm Comparison Laboratory
          </h2>
          <p className="text-xs text-slate-400">
            Benchmark multiple optimization algorithms side-by-side on identical dataset ({cities.length} cities).
          </p>
        </div>

        <button
          onClick={runComparison}
          disabled={isRunningComparison || cities.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition"
        >
          {isRunningComparison ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Running Comparison...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Run Comparison Benchmark
            </>
          )}
        </button>
      </div>

      {/* Checkbox Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-300">Select Algorithms to Compare:</span>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((algo) => {
            const isSelected = selectedAlgoIds.includes(algo.id);
            return (
              <button
                key={algo.id}
                onClick={() => toggleAlgoSelection(algo.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {isSelected && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                {algo.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Table */}
      {comparisonResults.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Algorithm</th>
                  <th className="p-3">Best Distance</th>
                  <th className="p-3">Execution Time</th>
                  <th className="p-3">Iterations</th>
                  <th className="p-3">Improvement %</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {comparisonResults.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-3 font-sans font-bold text-slate-200">{res.name}</td>
                    <td className="p-3 text-cyan-400 font-bold">
                      {res.bestDistance ? formatDistance(res.bestDistance) : 'N/A'}
                    </td>
                    <td className="p-3 text-blue-400">
                      {res.executionTime !== null ? formatTime(res.executionTime) : 'N/A'}
                    </td>
                    <td className="p-3 text-purple-400">{res.iterations}</td>
                    <td className="p-3 text-emerald-400">+{res.improvement}%</td>
                    <td className="p-3 text-slate-400 font-sans text-[11px]">{res.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Chart Visualization */}
          {chartData.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-300 mb-3">Distance Comparison Bar Chart</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Best Distance" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Educational Disclaimer */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            💡 <span className="font-semibold text-slate-300">Optimization Insight:</span> Performance depends on algorithm parameters, dataset topology, starting seed, and iteration budget. Heuristics offer trade-offs between execution speed and solution quality.
          </div>
        </div>
      )}
    </div>
  );
}
