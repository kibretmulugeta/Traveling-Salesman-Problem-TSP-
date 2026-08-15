/**
 * Mathematical Education Modal explaining TSP objective, Euclidean metrics,
 * NP-hard complexity, and factorial search space growth.
 */
import React from 'react';
import { X, BookOpen, Calculator, AlertOctagon } from 'lucide-react';

export function MathEducationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">TSP Mathematical Foundations & Complexity</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Math Sections */}
        <div className="flex flex-col gap-4 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Section 1: Objective */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
              <Calculator className="w-4 h-4" /> 1. Problem Definition & Objective
            </h4>
            <p>
              The <strong>Traveling Salesman Problem (TSP)</strong> is a classic combinatorial optimization problem. Given a list of cities and pairwise distances between each city pair, find the shortest possible <em>Hamiltonian cycle</em> that visits every city exactly once and returns to the origin city.
            </p>
            <div className="bg-slate-900 p-2.5 rounded font-mono text-[11px] text-cyan-300 border border-slate-800">
              d(i, j) = √((x_i - x_j)² + (y_i - y_j)²)
              <br />
              Total Tour Distance L = ∑ d(route[k], route[k+1]) for k=0 to N-1
            </div>
          </div>

          {/* Section 2: NP-Hard Complexity */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
              <AlertOctagon className="w-4 h-4" /> 2. NP-Hard Nature & Combinatorial Explosion
            </h4>
            <p>
              TSP is strictly <strong>NP-hard</strong>. For a symmetric TSP dataset with N cities, the number of distinct Hamiltonian tours is:
            </p>
            <div className="bg-slate-900 p-2 rounded font-mono text-center text-amber-300 font-bold">
              Total Valid Permutations = (N - 1)! / 2
            </div>
            <p>
              Brute force search becomes computationally intractable as city count grows due to factorial growth:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] mt-1 border border-slate-800">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Cities (N)</th>
                    <th className="p-2">Possible Routes (N-1)!/2</th>
                    <th className="p-2">Brute Force Time at 1B/sec</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr><td className="p-2">5 Cities</td><td className="p-2 text-cyan-400">12</td><td className="p-2 text-emerald-400">12 nanoseconds</td></tr>
                  <tr><td className="p-2">10 Cities</td><td className="p-2 text-cyan-400">181,440</td><td className="p-2 text-emerald-400">0.18 milliseconds</td></tr>
                  <tr><td className="p-2">15 Cities</td><td className="p-2 text-cyan-400">43,589,145,600</td><td className="p-2 text-amber-400">43.5 seconds</td></tr>
                  <tr><td className="p-2">20 Cities</td><td className="p-2 text-cyan-400">60,822,550,204,416,000</td><td className="p-2 text-red-400">1.9 years</td></tr>
                  <tr><td className="p-2">50 Cities</td><td className="p-2 text-cyan-400">3.04 × 10⁶²</td><td className="p-2 text-red-400">10⁴³ times age of universe</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Why Metaheuristics? */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-purple-400 mb-1 text-sm">3. Why Metaheuristics Are Essential</h4>
            <p>
              Because exact evaluation of all permutations is impossible for real-world logistics (e.g. 100+ locations), metaheuristics like <strong>Genetic Algorithms</strong>, <strong>Simulated Annealing</strong>, and <strong>Ant Colony Optimization</strong> efficiently discover near-optimal solutions in milliseconds.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
