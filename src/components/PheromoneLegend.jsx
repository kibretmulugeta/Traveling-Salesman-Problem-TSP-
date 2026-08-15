/**
 * Legend badge explaining ACO Pheromone intensity heatmap.
 */
import React from 'react';

export function PheromoneLegend({ showPheromones, selectedAlgorithm }) {
  if (!showPheromones || selectedAlgorithm !== 'ant_colony') return null;

  return (
    <div className="bg-purple-950/80 border border-purple-800/60 rounded-xl p-3 shadow-lg flex items-center justify-between text-xs text-purple-200">
      <div className="flex items-center gap-2 font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
        ACO Pheromone Heatmap Intensity Scale:
      </div>
      <div className="flex items-center gap-4 text-[11px] font-mono">
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5 bg-purple-900 inline-block"></span> Weak Trail
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-1 bg-purple-500 inline-block shadow-sm shadow-purple-400"></span> Strong Trail
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-1.5 bg-purple-300 inline-block shadow-md shadow-purple-300"></span> Global Best Path
        </span>
      </div>
    </div>
  );
}
