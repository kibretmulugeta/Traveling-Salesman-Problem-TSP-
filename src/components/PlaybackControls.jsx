/**
 * Interactive animation and simulation controls component.
 */
import React from 'react';
import { Play, Pause, Square, RotateCcw, SkipForward, FastForward, Gauge } from 'lucide-react';

export function PlaybackControls({
  status,
  onStart,
  onPause,
  onStop,
  onReset,
  onStep,
  onSkip,
  speedLevel,
  setSpeedLevel
}) {
  const isRunning = status === 'running';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
      {/* Primary Action Buttons */}
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/25 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            {status === 'paused' ? 'Resume' : 'Start Optimization'}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-500/25 transition"
          >
            <Pause className="w-4 h-4 fill-current" />
            Pause
          </button>
        )}

        {/* Step-by-Step Execution */}
        <button
          onClick={onStep}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          title="Execute single step"
        >
          <SkipForward className="w-3.5 h-3.5" />
          Step
        </button>

        {/* Stop */}
        <button
          onClick={onStop}
          disabled={status === 'ready' || status === 'stopped'}
          className="p-2 bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400 disabled:opacity-40 rounded-lg border border-slate-700 transition"
          title="Stop Optimization"
        >
          <Square className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Skip to End */}
        <button
          onClick={onSkip}
          disabled={status === 'completed'}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-purple-900/40 text-purple-300 disabled:opacity-40 text-xs font-semibold rounded-lg border border-slate-700 transition"
          title="Skip animation to completion"
        >
          <FastForward className="w-3.5 h-3.5" />
          Complete
        </button>
      </div>

      {/* Speed Slider Control */}
      <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
        <Gauge className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-semibold text-slate-400">Speed:</span>
        <div className="flex items-center gap-1">
          {[
            { id: 'very_slow', label: 'Very Slow' },
            { id: 'slow', label: 'Slow' },
            { id: 'normal', label: 'Normal' },
            { id: 'fast', label: 'Fast' },
            { id: 'very_fast', label: 'Very Fast' }
          ].map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSpeedLevel(sp.id)}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition ${
                speedLevel === sp.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
