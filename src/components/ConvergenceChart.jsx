/**
 * Real-time convergence chart plotting Best vs Current vs Avg distance over iterations.
 */
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingDown } from 'lucide-react';

export function ConvergenceChart({ history, selectedAlgorithm }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex items-center justify-center h-64 text-slate-500 text-xs font-mono">
        Convergence data will appear here during optimization.
      </div>
    );
  }

  // Downsample data if history is large for ultra smooth chart rendering
  const maxPoints = 100;
  let chartData = history;
  if (history.length > maxPoints) {
    const step = Math.ceil(history.length / maxPoints);
    chartData = history.filter((_, idx) => idx % step === 0 || idx === history.length - 1);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
          Real-Time Convergence Graph
        </h3>
        <span className="text-[10px] font-mono text-slate-400">Best vs Current Distance</span>
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="iteration"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              label={{ value: 'Iteration', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />

            {/* Best Distance */}
            <Line
              type="monotone"
              dataKey="bestDistance"
              name="Best Distance"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

            {/* Current Candidate Distance */}
            <Line
              type="monotone"
              dataKey="currentDistance"
              name="Current Distance"
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              isAnimationActive={false}
            />

            {/* Avg Population Distance (for GA) */}
            {selectedAlgorithm === 'genetic_algorithm' && (
              <Line
                type="monotone"
                dataKey="avgDistance"
                name="Avg Population Dist"
                stroke="#a855f7"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
