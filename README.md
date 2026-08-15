# Traveling Salesman Problem — Interactive Optimization Lab

> **Visualizing Classical Heuristics and Metaheuristic Optimization in Real Time**

An interactive optimization laboratory and visual analytics platform that demonstrates how classical heuristics, population-based metaheuristics, local search, and dynamic programming exact solvers solve the **Traveling Salesman Problem (TSP)** through **real-time animated 2D canvas visualization**.

---

## 🌟 Portfolio Overview

This project serves as a production-quality portfolio demonstration of **computational optimization, algorithm visual analytics, high-performance web development, and non-blocking background workers**.

- **Interactive 2D Visualization Canvas**: Smooth 60 FPS rendering with node dragging, manual city placement, glowing route overlays, directional route arrows, ACO ant pheromone heatmap trails, and GA candidate population previews.
- **8 Core Optimization Algorithms**:
  1. **Nearest Neighbor**: Fast greedy heuristic.
  2. **Genetic Algorithm (GA)**: Permutation chromosomes, Ordered Crossover (OX), 2-opt inversion & swap mutation, tournament selection, elitism.
  3. **Simulated Annealing (SA)**: Metropolis acceptance probability \(P = e^{-\Delta E / T}\), exponential cooling schedule.
  4. **Ant Colony Optimization (ACO)**: Pheromone matrix \(\tau_{ij}\), heuristic matrix \(\eta_{ij} = 1/d_{ij}\), trail evaporation & deposition.
  5. **Particle Swarm Optimization (PSO)**: Discrete permutation PSO with swap sequence velocities attracted to \(pBest\) and \(gBest\).
  6. **2-opt Local Search**: Exhaustive edge replacement local search with active swap pair highlighting.
  7. **Brute Force (Exact)**: Exhaustive evaluation of all \((N-1)!/2\) permutations for \(N \le 9\).
  8. **Held-Karp (Exact DP)**: Dynamic Programming exact solver in \(O(N^2 2^N)\) time for \(N \le 15\).
- **Multi-Algorithm Comparison Laboratory**: Side-by-side benchmarking of algorithms on identical city topologies and seeds.
- **Problem Size Scaling Benchmark**: Performance scaling across 10 to 200 cities.
- **Reproducible Stochastic Runs**: Seedable Mulberry32 Pseudo-Random Number Generator (PRNG).
- **Data Export & Persistence**: Export to JSON datasets, CSV tables, high-resolution Canvas PNG snapshots, and `localStorage` experiment logs.

---

## 📐 Mathematical Formulation

Given a set of \(N\) cities with coordinates \((x_i, y_i)\), find a minimum-length closed tour (Hamiltonian cycle) visiting every city exactly once:

$$\text{Minimize } L = \sum_{i=0}^{N-1} d(\text{route}[i], \text{route}[(i+1) \bmod N])$$

where Euclidean distance is given by:

$$d(i, j) = \sqrt{(x_i - x_j)^2 + (y_i - y_j)^2}$$

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone or navigate to the project directory
cd tsm

# Install dependencies
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

### 3. Automated Test Suite

```bash
npm test
```

Executes Vitest unit tests verifying route validity, Euclidean metrics, crossover, mutation, ACO pheromone updates, and exact solver optimum correctness.

### 4. Production Build

```bash
npm run build
```

Generates optimized bundle in `dist/`.

---

## 🛠️ Architecture & Tech Stack

- **Frontend Core**: React 19, JavaScript (ESNext), Vite 6
- **Styling**: Vanilla CSS + Tailwind CSS v4 (Glassmorphism, dark engineering theme)
- **Visualization**: HTML5 2D Canvas Engine with Retina/DPI scaling
- **Data Visualization**: Recharts (Convergence line charts & Comparison bar charts)
- **Icons**: Lucide React
- **Testing**: Vitest + jsdom

---

## 🏆 Key Features Showcase

1. **One-Click Demo Mode**: Click **"Run Demo"** in the top navbar to instantly initialize a 20-city cluster map, run the Genetic Algorithm, and view real-time convergence.
2. **Pheromone Heatmap Toggle**: When ACO is active, toggle **Pheromone Heatmap** to visualize glowing purple intensity lines showing ant pheromone accumulation on optimal paths.
3. **Step-by-Step Execution**: Use the **Step** button to advance the algorithm by a single discrete operation, accompanied by natural-language step explanations.
4. **Comparison Mode**: Run multiple algorithms on identical city coordinates to evaluate solution distance, execution time (ms), and % improvement.

---

## 📄 License

MIT License &copy; 2026 TSP Optimization Lab.
