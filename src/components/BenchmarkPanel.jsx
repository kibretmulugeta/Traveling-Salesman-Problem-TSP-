/**
 * Scaling Benchmark Laboratory for testing algorithm performance across problem sizes (10 to 200 cities).
 */
import React, { useState } from 'react';
import { ALGORITHMS, createAlgorithmInstance } from '../algorithms/index.js';
import { generateRandomCities } from '../core/presets.js';
import { formatTime, formatDistance } from '../core/metrics.js';
import { Cpu, Play, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function BenchmarkPanel() {
  const [selectedAlgoId, setSelectedAlgoId] = useState('genetic_algorithm');
  const [benchmarkResults, setBenchmarkResults] = useState([]);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const citySizes = [10, 20, 50, 100, 200];

  const runBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkResults([]);

    setTimeout(() => {
      const results = [];
      const algoObj = ALGORITHMS.find((a) => a.id === selectedAlgoId);

      citySizes.forEach((size) => {
        // Skip exact solvers if size exceeds limit
        if (algoObj.isExact && size > algoObj.maxCities) {
          results.push({
            citySize: size,
            execTime: null,
            bestDistance: null,
            status: `Skipped (Exceeds max size ${algoObj.maxCities})`
          });
          return;
        }

        const cities = generateRandomCities(size, 800, 500);
        const instance = createAlgorithmInstance(selectedAlgoId);

        try {
          instance.initialize(cities);
          const t0 = performance.now();

          let state = instance.getState();
          let steps = 0;
          const maxSteps = selectedAlgoId === 'simulated_annealing' ? 3000 : 300;

          while (!state.isFinished && steps < maxSteps) {
            steps++;
            state = instance.step();
          }

          const t1 = performance.now();

          results.push({
            citySize: size,
            execTime: Number((t1 - t0).toFixed(1)),
            bestDistance: Number(state.bestDistance.toFixed(2)),
            status: 'Completed'
          });
        } catch (err) {
          results.push({
            citySize: size,
            execTime: null,
            bestDistance: null,
            status: `Error: ${err.message}`
          });
        }
      });

      setBenchmarkResults(results);
      setIsBenchmarking(false);
    }, 100);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-5 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Scaling Performance Benchmark
          </h2>
          <p className="text-xs text-slate-400">
            Evaluate time complexity and solution quality across scaling dataset sizes (10 to 200 cities).
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isBenchmarking}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition"
        >
          {isBenchmarking ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Running Benchmark...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Run Scaling Benchmark
            </>
          )}
        </button>
      </div>

      {/* Select Algorithm */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-300">Select Algorithm:</label>
        <select
          value={selectedAlgoId}
          onChange={(e) => setSelectedAlgoId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none"
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Benchmark Results */}
      {benchmarkResults.length > 0 && (
        <div className="flex flex-col gap-5">
          {/* Results Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Problem Size</th>
                  <th className="p-3">Execution Time</th>
                  <th className="p-3">Best Distance</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {benchmarkResults.map((res) => (
                  <tr key={res.citySize} className="hover:bg-slate-900/50 transition">
                    <td className="p-3 font-sans font-bold text-slate-200">{res.citySize} Cities</td>
                    <td className="p-3 text-blue-400">{res.execTime !== null ? `${res.execTime} ms` : 'N/A'}</td>
                    <td className="p-3 text-cyan-400">{res.bestDistance !== null ? formatDistance(res.bestDistance) : 'N/A'}</td>
                    <td className="p-3 text-slate-400 font-sans text-[11px]">{res.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scaling Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-300 mb-3">Execution Time Scaling Curve (ms)</h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={benchmarkResults.filter((r) => r.execTime !== null)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="citySize" stroke="#64748b" fontSize={10} label={{ value: 'Number of Cities', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={10} label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="execTime" name="Execution Time (ms)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
