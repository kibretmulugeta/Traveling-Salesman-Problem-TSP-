/**
 * Experiment History Panel. Allows users to view, compare, delete, or clear saved TSP experiment runs stored in localStorage.
 */
import React from 'react';
import { History, Trash2, Calendar, Award, Clock } from 'lucide-react';
import { formatDistance, formatTime } from '../core/metrics.js';

export function HistoryPanel({ history, onDelete, onClear }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2">
        <History className="w-8 h-8 text-slate-600 mb-1" />
        <h3 className="text-sm font-semibold text-slate-300">No Saved Experiment History</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Run optimization experiments in the Visualizer Lab and click Export/Save to persist your runs here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100">Saved Experiment History</h2>
        </div>

        <button
          onClick={onClear}
          className="text-xs px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 hover:bg-red-900/50 transition flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {history.map((item) => (
          <div key={item.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-cyan-400">{item.algorithmName}</span>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition"
                  title="Delete experiment entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mb-3">
                <Calendar className="w-3 h-3 text-slate-500" />
                {new Date(item.timestamp).toLocaleString()}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block font-sans">Cities</span>
                  <span className="text-slate-200 font-bold">{item.citiesCount}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block font-sans">Best Distance</span>
                  <span className="text-cyan-400 font-bold">{formatDistance(item.bestDistance)}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block font-sans">Iterations</span>
                  <span className="text-purple-400 font-bold">{item.iteration}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block font-sans">Elapsed Time</span>
                  <span className="text-blue-400 font-bold">{formatTime(item.elapsedTime)}</span>
                </div>
              </div>
            </div>

            {item.seed && (
              <div className="text-[10px] font-mono text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2 py-1 rounded">
                Seed: {item.seed}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
