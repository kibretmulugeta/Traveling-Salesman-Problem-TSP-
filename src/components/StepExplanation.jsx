/**
 * Educational step-by-step toast / banner explaining algorithmic state transitions.
 */
import React from 'react';
import { Info } from 'lucide-react';

export function StepExplanation({ stepDescription, algorithmName }) {
  if (!stepDescription) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg flex items-start gap-2.5 text-xs text-slate-300">
      <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
        <Info className="w-4 h-4" />
      </div>
      <div className="flex-1 font-mono">
        <span className="text-cyan-400 font-semibold mr-2">[{algorithmName}]</span>
        {stepDescription}
      </div>
    </div>
  );
}
