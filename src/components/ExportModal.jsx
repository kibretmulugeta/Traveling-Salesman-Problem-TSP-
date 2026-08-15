/**
 * Export Modal Component for downloading experiment results in JSON, CSV, or Canvas PNG.
 */
import React from 'react';
import { X, FileJson, FileText, Image, Check } from 'lucide-react';

export function ExportModal({ isOpen, onClose, cities, simState, selectedAlgorithm, seed, elapsedTime }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const exportData = {
    timestamp: new Date().toISOString(),
    algorithm: selectedAlgorithm,
    citiesCount: cities.length,
    seed: seed || null,
    bestDistance: simState.bestDistance,
    initialDistance: simState.initialDistance,
    iterations: simState.iteration,
    elapsedTimeMs: elapsedTime,
    bestRoute: simState.bestRoute,
    cityCoordinates: cities
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tsp_experiment_${selectedAlgorithm}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const headers = ['CityIndex', 'CityName', 'X', 'Y', 'VisitOrderIndex'];
    const rows = cities.map((c, i) => {
      const orderIdx = simState.bestRoute.indexOf(i);
      return [c.id + 1, `"${c.name}"`, c.x, c.y, orderIdx !== -1 ? orderIdx + 1 : 'N/A'];
    });
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tsp_route_${selectedAlgorithm}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `tsp_visualization_${selectedAlgorithm}_${Date.now()}.png`;
    a.click();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100">Export Experiment Results</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Download JSON */}
          <button
            onClick={handleDownloadJSON}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Export JSON Dataset</div>
                <div className="text-[11px] text-slate-400">Full coordinates, parameters, and route history</div>
              </div>
            </div>
          </button>

          {/* Download CSV */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Export CSV Table</div>
                <div className="text-[11px] text-slate-400">Optimal visit order and city coordinates matrix</div>
              </div>
            </div>
          </button>

          {/* Download Canvas PNG */}
          <button
            onClick={handleDownloadPNG}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Download High-Res Snapshot (PNG)</div>
                <div className="text-[11px] text-slate-400">Save 2D Canvas route diagram as image</div>
              </div>
            </div>
          </button>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleCopyJSON}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            {copied ? 'Copied to Clipboard!' : 'Copy Raw JSON'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
