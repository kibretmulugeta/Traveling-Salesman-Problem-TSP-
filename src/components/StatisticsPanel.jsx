/**
 * Real-time statistics dashboard displaying key performance indicators (KPIs).
 */
import React from 'react';
import { formatDistance, formatTime } from '../core/metrics.js';
import { Activity, Clock, TrendingUp, Zap, CheckCircle2, PauseCircle, PlayCircle } from 'lucide-react';

export function StatisticsPanel({
  status,
  citiesCount,
  selectedAlgorithmName,
  simState,
  elapsedTime,
  improvementPct,
  iterPerSec
}) {
  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return (
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">
            <PlayCircle className="w-3 h-3 animate-pulse" /> Running
          </span>
        );
      case 'paused':
        return (
          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">
            <PauseCircle className="w-3 h-3" /> Paused
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
            Ready
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200">Live Optimization Metrics</h2>
        </div>
        {getStatusBadge()}
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Best Distance */}
        <div className="bg-slate-950/80 border border-cyan-500/30 p-2.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Best Distance</span>
          <div className="text-base font-bold text-cyan-400 font-mono mt-1">
            {formatDistance(simState.bestDistance)}
          </div>
        </div>

        {/* Current Distance */}
        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Current Distance</span>
          <div className="text-base font-bold text-slate-200 font-mono mt-1">
            {formatDistance(simState.currentDistance)}
          </div>
        </div>

        {/* Improvement % */}
        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Improvement
          </span>
          <div className="text-base font-bold text-emerald-400 font-mono mt-1">
            +{improvementPct}%
          </div>
        </div>

        {/* Iterations */}
        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Iterations</span>
          <div className="text-base font-bold text-purple-400 font-mono mt-1">
            {simState.iteration.toLocaleString()}
          </div>
        </div>

        {/* Iterations / Sec */}
        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Speed
          </span>
          <div className="text-base font-bold text-amber-400 font-mono mt-1">
            {iterPerSec} <span className="text-[10px] font-normal text-slate-400">iter/s</span>
          </div>
        </div>

        {/* Execution Time */}
        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" /> Elapsed Time
          </span>
          <div className="text-base font-bold text-blue-400 font-mono mt-1">
            {formatTime(elapsedTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
