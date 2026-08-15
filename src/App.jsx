/**
 * Master Application Component for Traveling Salesman Problem Interactive Lab.
 */
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTSPSimulation } from './hooks/useTSPSimulation.js';
import { useExperimentHistory } from './hooks/useExperimentHistory.js';
import { generatePresetCities } from './core/presets.js';
import { ALGORITHMS } from './algorithms/index.js';

import { Header } from './components/Header.jsx';
import { TSPCanvas } from './components/TSPCanvas.jsx';
import { ControlPanel } from './components/ControlPanel.jsx';
import { ParameterPanel } from './components/ParameterPanel.jsx';
import { PlaybackControls } from './components/PlaybackControls.jsx';
import { StatisticsPanel } from './components/StatisticsPanel.jsx';
import { ConvergenceChart } from './components/ConvergenceChart.jsx';
import { StepExplanation } from './components/StepExplanation.jsx';
import { ComparisonPanel } from './components/ComparisonPanel.jsx';
import { BenchmarkPanel } from './components/BenchmarkPanel.jsx';
import { HistoryPanel } from './components/HistoryPanel.jsx';
import { ExportModal } from './components/ExportModal.jsx';
import { MathEducationModal } from './components/MathEducationModal.jsx';
import { AlgorithmInfoModal } from './components/AlgorithmInfoModal.jsx';
import { PheromoneLegend } from './components/PheromoneLegend.jsx';
import { AboutSection } from './components/AboutSection.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('visualization');
  const [showPheromones, setShowPheromones] = useState(true);
  const [showPopulation, setShowPopulation] = useState(true);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [isAlgoInfoOpen, setIsAlgoInfoOpen] = useState(false);

  const { history, saveExperiment, deleteExperiment, clearHistory } = useExperimentHistory();

  const {
    cities,
    setCities,
    selectedAlgorithm,
    setSelectedAlgorithm,
    algorithmParams,
    setAlgorithmParams,
    seed,
    setSeed,
    speedLevel,
    setSpeedLevel,
    status,
    simState,
    convergenceHistory,
    elapsedTime,
    improvementPct,
    iterPerSec,
    initializeSimulation,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    resetSimulation,
    stepSimulation,
    skipToCompletion
  } = useTSPSimulation();

  // Load default preset on initial mount
  useEffect(() => {
    const initialCities = generatePresetCities('two_clusters', 800, 500);
    setCities(initialCities);
  }, []);

  // Trigger celebration & auto-save to history on completion
  useEffect(() => {
    if (status === 'completed' && simState.bestDistance > 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });

      const algoObj = ALGORITHMS.find((a) => a.id === selectedAlgorithm);
      saveExperiment({
        algorithmId: selectedAlgorithm,
        algorithmName: algoObj ? algoObj.name : selectedAlgorithm,
        citiesCount: cities.length,
        bestDistance: simState.bestDistance,
        initialDistance: simState.initialDistance,
        iteration: simState.iteration,
        elapsedTime,
        seed: seed || null
      });
    }
  }, [status]);

  // One-click Demo runner
  const handleRunDemo = () => {
    setActiveTab('visualization');
    const demoCities = generatePresetCities('two_clusters', 800, 500);
    setCities(demoCities);
    setSelectedAlgorithm('genetic_algorithm');
    setSeed('42');
    setTimeout(() => {
      startSimulation();
    }, 150);
  };

  const selectedAlgoObj = ALGORITHMS.find((a) => a.id === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunDemo={handleRunDemo}
        onOpenMathModal={() => setIsMathOpen(true)}
        onOpenAlgoInfoModal={() => setIsAlgoInfoOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl w-full mx-auto p-4 flex-1 flex flex-col gap-5">
        {/* Tab 1: Visualizer Lab */}
        {activeTab === 'visualization' && (
          <div className="flex flex-col gap-4">
            {/* Top KPIs Dashboard */}
            <StatisticsPanel
              status={status}
              citiesCount={cities.length}
              selectedAlgorithmName={selectedAlgoObj ? selectedAlgoObj.name : selectedAlgorithm}
              simState={simState}
              elapsedTime={elapsedTime}
              improvementPct={improvementPct}
              iterPerSec={iterPerSec}
            />

            {/* Main Visualizer Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left Column: Control Panels (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <ControlPanel
                  selectedAlgorithm={selectedAlgorithm}
                  setSelectedAlgorithm={setSelectedAlgorithm}
                  cities={cities}
                  setCities={setCities}
                  seed={seed}
                  setSeed={setSeed}
                  onReset={resetSimulation}
                />

                <ParameterPanel
                  selectedAlgorithm={selectedAlgorithm}
                  algorithmParams={algorithmParams}
                  setAlgorithmParams={setAlgorithmParams}
                  onReset={resetSimulation}
                />
              </div>

              {/* Center & Right Column: Interactive 2D Canvas & Charts (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Playback Controls */}
                <PlaybackControls
                  status={status}
                  onStart={startSimulation}
                  onPause={pauseSimulation}
                  onStop={stopSimulation}
                  onReset={resetSimulation}
                  onStep={stepSimulation}
                  onSkip={skipToCompletion}
                  speedLevel={speedLevel}
                  setSpeedLevel={setSpeedLevel}
                />

                {/* Step Explanation Toast */}
                <StepExplanation
                  stepDescription={simState.stepDescription}
                  algorithmName={selectedAlgoObj ? selectedAlgoObj.name : selectedAlgorithm}
                />

                {/* ACO Pheromone Legend */}
                <PheromoneLegend
                  showPheromones={showPheromones}
                  selectedAlgorithm={selectedAlgorithm}
                />

                {/* 2D Interactive Canvas */}
                <TSPCanvas
                  cities={cities}
                  setCities={setCities}
                  simState={simState}
                  selectedAlgorithm={selectedAlgorithm}
                  showPheromones={showPheromones}
                  setShowPheromones={setShowPheromones}
                  showPopulation={showPopulation}
                  setShowPopulation={setShowPopulation}
                />

                {/* Real-time Convergence Line Graph */}
                <ConvergenceChart
                  history={convergenceHistory}
                  selectedAlgorithm={selectedAlgorithm}
                />
              </div>
            </div>

            {/* About Section */}
            <AboutSection />
          </div>
        )}

        {/* Tab 2: Algorithm Comparison Laboratory */}
        {activeTab === 'comparison' && (
          <ComparisonPanel cities={cities} seed={seed} />
        )}

        {/* Tab 3: Benchmark Scaling Laboratory */}
        {activeTab === 'benchmark' && (
          <BenchmarkPanel />
        )}

        {/* Tab 4: Experiment History */}
        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onDelete={deleteExperiment}
            onClear={clearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 text-center py-3 text-xs text-slate-500 font-mono">
        Traveling Salesman Problem Interactive Lab &copy; {new Date().getFullYear()} — Advanced Optimization & Visual Analytics Platform
      </footer>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        cities={cities}
        simState={simState}
        selectedAlgorithm={selectedAlgorithm}
        seed={seed}
        elapsedTime={elapsedTime}
      />

      <MathEducationModal
        isOpen={isMathOpen}
        onClose={() => setIsMathOpen(false)}
      />

      <AlgorithmInfoModal
        isOpen={isAlgoInfoOpen}
        onClose={() => setIsAlgoInfoOpen(false)}
      />
    </div>
  );
}
