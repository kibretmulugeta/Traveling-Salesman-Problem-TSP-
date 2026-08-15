/**
 * Portfolio presentation section: "About This Project"
 */
import React from 'react';
import { Cpu, Award, CheckCircle2 } from 'lucide-react';

export function AboutSection() {
  const techTags = [
    'JavaScript',
    'React 19',
    'Vite',
    'HTML5 Canvas',
    'Web Workers',
    'Genetic Algorithms',
    'Simulated Annealing',
    'Ant Colony Optimization',
    'Particle Swarm Optimization',
    '2-opt Local Search',
    'Held-Karp Dynamic Programming',
    'Recharts Data Viz'
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">
            Traveling Salesman Problem — Interactive Optimization Lab
          </h2>
          <p className="text-xs text-cyan-400 font-medium">
            Visualizing Classical Heuristics and Metaheuristic Optimization in Real Time
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-sans">
        An interactive optimization laboratory that visualizes how classical heuristics and population-based metaheuristics approach the Traveling Salesman Problem. Users can watch routes evolve in real time, inspect convergence behavior, compare algorithms, and experiment with optimization hyperparameters.
      </p>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {techTags.map((tag, idx) => (
          <span
            key={idx}
            className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
