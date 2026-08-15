/**
 * Navigation Header for Traveling Salesman Problem Interactive Lab.
 */
import React from 'react';
import { Play, Sparkles, BarChart3, HelpCircle, BookOpen, Download, History, Cpu } from 'lucide-react';

export function Header({
  activeTab,
  setActiveTab,
  onRunDemo,
  onOpenMathModal,
  onOpenAlgoInfoModal,
  onOpenExportModal
}) {
  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-40 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              TSP Optimization Lab
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Production AI Suite
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Interactive Visualization & Metaheuristic Optimization Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('visualization')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'visualization'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Visualizer Lab
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Comparison Lab
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'benchmark'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Benchmark Scaling
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
        </nav>

        {/* Quick Action Tools */}
        <div className="flex items-center gap-2">
          {/* Demo Button */}
          <button
            onClick={onRunDemo}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:brightness-110 transition shadow-md shadow-emerald-500/20"
            title="One-click automatic demo run"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Demo
          </button>

          {/* Math Info */}
          <button
            onClick={onOpenMathModal}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition"
            title="TSP Mathematical Foundation"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Algorithm Info */}
          <button
            onClick={onOpenAlgoInfoModal}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition"
            title="Algorithm Explanations & Pseudocode"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExportModal}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition"
            title="Export Data / Canvas PNG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
