/**
 * Main control panel for selecting algorithms, presets, seeds, and city generation.
 */
import React from 'react';
import { ALGORITHMS } from '../algorithms/index.js';
import { PRESETS, generateRandomCities, generatePresetCities } from '../core/presets.js';
import { MapPin, RefreshCw, Key, Settings, AlertTriangle } from 'lucide-react';

export function ControlPanel({
  selectedAlgorithm,
  setSelectedAlgorithm,
  cities,
  setCities,
  seed,
  setSeed,
  onReset
}) {
  const currentAlgoObj = ALGORITHMS.find((a) => a.id === selectedAlgorithm);
  const isCityCountWarning = currentAlgoObj?.maxCities && cities.length > currentAlgoObj.maxCities;

  const handlePresetSelect = (e) => {
    const presetId = e.target.value;
    if (!presetId) return;
    const newCities = generatePresetCities(presetId, 800, 500);
    setCities(newCities);
    onReset();
  };

  const handleRandomGenerate = (count) => {
    const newCities = generateRandomCities(count, 800, 500, 40);
    setCities(newCities);
    onReset();
  };

  const handleGenerateSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000).toString();
    setSeed(newSeed);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          Problem Setup & Controls
        </h2>
        <span className="text-[11px] font-mono text-slate-400">Step 1 of 3</span>
      </div>

      {/* 1. Algorithm Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-300">Optimization Algorithm</label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => {
            setSelectedAlgorithm(e.target.value);
            onReset();
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 transition"
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name} ({algo.category})
            </option>
          ))}
        </select>
        {currentAlgoObj && (
          <p className="text-[11px] text-slate-400 italic">{currentAlgoObj.description}</p>
        )}
      </div>

      {/* City Count Warning for Exact Solvers */}
      {isCityCountWarning && (
        <div className="bg-amber-950/60 border border-amber-500/40 rounded-lg p-2.5 flex items-start gap-2 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{currentAlgoObj.name} Safety Guard:</span> Selected {cities.length} cities exceeds max recommended limit of {currentAlgoObj.maxCities}. Please select fewer cities for exact solvers.
          </div>
        </div>
      )}

      {/* 2. City Dataset Controls */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          City Datasets & Presets
        </label>

        {/* Preset Selector */}
        <select
          onChange={handlePresetSelect}
          defaultValue=""
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="" disabled>
            Select Preset Map...
          </option>
          {PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>

        {/* Quick Random Buttons */}
        <div className="grid grid-cols-6 gap-1 mt-1">
          {[5, 10, 20, 50, 100, 200].map((count) => (
            <button
              key={count}
              onClick={() => handleRandomGenerate(count)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] font-semibold rounded border border-slate-700/60 transition"
              title={`Generate ${count} random cities`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Random Seed for Reproducibility */}
      <div className="flex flex-col gap-1.5 border-t border-slate-800/80 pt-3">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-purple-400" />
          Random Seed (Reproducibility)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. 42 (Optional)"
            value={seed}
            onChange={(e) => {
              setSeed(e.target.value);
              onReset();
            }}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleGenerateSeed}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Generate Random Seed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
