/**
 * Hook for persisting and retrieving experiment history in localStorage.
 */
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'tsp_lab_experiment_history_v1';

export function useExperimentHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load experiment history from localStorage:', e);
    }
  }, []);

  const saveExperiment = (experimentData) => {
    const newEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      ...experimentData
    };
    const updated = [newEntry, ...history.slice(0, 49)]; // Store up to 50 runs
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save experiment:', e);
    }
  };

  const deleteExperiment = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete experiment:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear experiment history:', e);
    }
  };

  return {
    history,
    saveExperiment,
    deleteExperiment,
    clearHistory
  };
}
