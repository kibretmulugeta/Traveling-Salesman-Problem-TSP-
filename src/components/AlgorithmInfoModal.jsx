/**
 * Educational Modal showcasing deep dive explanations, strengths, weaknesses,
 * and pseudocode for every TSP optimization algorithm.
 */
import React, { useState } from 'react';
import { X, HelpCircle, Code, CheckCircle2, XCircle } from 'lucide-react';
import { ALGORITHMS } from '../algorithms/index.js';

export function AlgorithmInfoModal({ isOpen, onClose }) {
  const [activeTabId, setActiveTabId] = useState('genetic_algorithm');

  if (!isOpen) return null;

  const algoDetails = {
    nearest_neighbor: {
      overview: 'Nearest Neighbor is a greedy heuristic that constructs a tour step-by-step by starting at a designated city and repeatedly visiting the nearest unvisited neighbor.',
      strengths: ['Extremely fast O(N²)', 'Easy to understand and implement', 'Good baseline initial solution for metaheuristics'],
      weaknesses: ['Can produce sub-optimal tours with overlapping edges', 'Can get trapped into long jumps at the final unvisited cities'],
      pseudocode: `1. Select starting city C
2. Mark C as visited and add to route
3. While unvisited cities exist:
   a. Find unvisited city U with min distance to current city
   b. Add U to route, mark as visited
4. Return to starting city C`
    },
    genetic_algorithm: {
      overview: 'Genetic Algorithm (GA) is a population-based metaheuristic inspired by natural selection. Candidate tours (chromosomes) undergo selection, ordered crossover, mutation, and elitism across generations.',
      strengths: ['Global exploration capacity avoids local optima', 'Highly adaptable to large problem sizes', 'Maintains diverse population of high-quality solutions'],
      weaknesses: ['Requires tuning of hyperparameters (mutation, crossover)', 'Higher memory footprint for large populations'],
      pseudocode: `1. Initialize population of random route permutations
2. Evaluate fitness (1 / total distance)
3. For each generation:
   a. Retain top elitist routes
   b. Select parent routes via Tournament / Roulette selection
   c. Perform Ordered Crossover (OX) to create offspring
   d. Apply 2-opt Inversion / Swap Mutation
   e. Evaluate new population fitness
4. Return global best route`
    },
    simulated_annealing: {
      overview: 'Simulated Annealing (SA) models the physical cooling process of molten metals. It explores candidate neighbor routes, accepting worse moves probabilistically according to Metropolis criteria as temperature drops.',
      strengths: ['Escapes local minima using Metropolis probability P = exp(-ΔE/T)', 'Low memory usage (single route tracking)', 'Guaranteed asymptotic convergence to global optimum with slow cooling'],
      weaknesses: ['Performance heavily dependent on cooling schedule', 'Can take many iterations to converge'],
      pseudocode: `1. Set initial temperature T0 and initial route S
2. While T > T_min and iter < max_iter:
   a. Generate neighbor S' using 2-opt edge swap
   b. Calculate Δ = dist(S') - dist(S)
   c. If Δ < 0: accept S'
      Else: accept S' with probability exp(-Δ / T)
   d. Cool temperature T = α * T
3. Return best route found`
    },
    ant_colony: {
      overview: 'Ant Colony Optimization (ACO) is a swarm intelligence technique inspired by foraging ants. Artificial ants deposit pheromone trails on edges, reinforcing shorter tours over successive iterations.',
      strengths: ['Heatmap visualization highlights prominent route pathways', 'Combines greedy distance heuristic with collective memory', 'Effective for complex graph topologies'],
      weaknesses: ['Pheromone matrix updates require O(N² * num_ants) per iteration', 'Requires tuning alpha, beta, and evaporation rate'],
      pseudocode: `1. Initialize pheromone matrix τ_ij = τ0
2. For each iteration:
   a. Each ant constructs tour probabilistically using τ_ij^α * η_ij^β
   b. Compute tour distances
   c. Evaporate pheromones: τ_ij = (1 - ρ) * τ_ij
   d. Deposit pheromones: τ_ij += Q / L_k for edges in ant tours
3. Return global best ant tour`
    },
    particle_swarm: {
      overview: 'Particle Swarm Optimization (PSO) for permutation TSP models particles moving through a solution space. Velocities are represented as sequences of basic swap operations attracted toward personal best (pBest) and global best (gBest).',
      strengths: ['Leverages collective swarm velocity', 'Combines cognitive personal memory with social global memory', 'Fast iteration throughput'],
      weaknesses: ['Continuous PSO equations must be mapped to discrete swap sequences', 'Can experience premature swarm convergence'],
      pseudocode: `1. Initialize particle positions (permutations) and velocities (swap sequences)
2. Evaluate personal bests (pBest) and global best (gBest)
3. For each iteration:
   a. Compute swap sequences to pBest (c1) and gBest (c2)
   b. Update particle velocities with inertia weight w
   c. Apply swap sequences to update particle position routes
   d. Update pBest and gBest
4. Return gBest route`
    },
    two_opt: {
      overview: '2-opt is a local search algorithm that uncrosses self-intersecting route segments by removing two edges and reconnecting the tour in reverse order.',
      strengths: ['Eliminates crossing edges efficiently', 'Provides clean, crisp route improvements', 'Guaranteed local optimum'],
      weaknesses: ['Trapped in local optima without stochastic perturbations', 'Requires O(N²) edge pair evaluations per pass'],
      pseudocode: `1. Start with initial route S
2. Repeat until no further improvements:
   For edge pair (i, k):
     a. Swap edges: S' = twoOptSwap(S, i, k)
     b. If dist(S') < dist(S):
        S = S', mark improvement
3. Return local optimal route S`
    },
    brute_force: {
      overview: 'Brute Force exhaustively tests all (N-1)!/2 valid unique permutations, guaranteeing exact global minimum distance.',
      strengths: ['100% mathematically proven exact optimum', 'No random seed or parameter tuning needed'],
      weaknesses: ['O(N!) factorial time complexity', 'Infeasible for N > 9 cities'],
      pseudocode: `1. Fix starting city 0
2. Generate all (N-1)! permutations of remaining cities
3. Evaluate exact total length for each permutation
4. Return route with absolute minimum length`
    },
    held_karp: {
      overview: 'Held-Karp uses Dynamic Programming to compute exact minimum TSP tour in O(N² 2^N) time using bitmask subset states.',
      strengths: ['Exponential speedup over brute force O(N!)', '100% exact mathematical optimality guarantee'],
      weaknesses: ['O(N 2^N) memory space required', 'Infeasible for N > 15 cities'],
      pseudocode: `1. Define memo[mask][u] = min cost to visit subset mask ending at u
2. Base case: memo[1][0] = 0
3. For subset sizes 2 to N:
   For each mask and ending city u:
     memo[mask][u] = min_v (memo[mask \ {u}][v] + dist(v, u))
4. Reconstruct optimal cycle from DP parent pointers`
    }
  };

  const currentDetails = algoDetails[activeTabId];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Optimization Algorithm Reference Guide</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setActiveTabId(algo.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTabId === algo.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>

        {/* Details Content */}
        {currentDetails && (
          <div className="flex flex-col gap-4 text-xs text-slate-300">
            {/* Overview */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-400 mb-1 text-sm">Overview</h4>
              <p>{currentDetails.overview}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h5 className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Key Strengths
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {currentDetails.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h5 className="font-bold text-red-400 flex items-center gap-1.5 mb-2">
                  <XCircle className="w-4 h-4" /> Trade-offs & Limitations
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {currentDetails.weaknesses.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pseudocode */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-1.5 font-mono">
                <Code className="w-4 h-4" /> Pseudocode / Algorithmic Flow
              </h4>
              <pre className="font-mono text-[11px] text-slate-300 bg-slate-900 p-3 rounded border border-slate-800 leading-relaxed overflow-x-auto">
                {currentDetails.pseudocode}
              </pre>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
