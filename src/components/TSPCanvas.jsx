/**
 * Interactive 2D Canvas Component for Traveling Salesman Problem (TSP).
 * Renders node points, interactive click/drag handlers, glowing routes,
 * directional arrows, ACO pheromone heatmap trails, GA population previews,
 * and 2-opt active edge swap highlights.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff, Layers, MousePointer, Plus, Trash2 } from 'lucide-react';

export function TSPCanvas({
  cities,
  setCities,
  simState,
  selectedAlgorithm,
  showPheromones,
  setShowPheromones,
  showPopulation,
  setShowPopulation,
  showDirectionArrows = true,
  interactiveMode = 'drag' // 'drag' | 'add' | 'remove'
}) {
  const canvasRef = useRef(null);
  const [draggedCityIndex, setDraggedCityIndex] = useState(null);
  const [hoveredCityIndex, setHoveredCityIndex] = useState(null);

  const width = 800;
  const height = 500;

  // Handle Retina/High-DPI Display Canvas Scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background Grid
    drawBackgroundGrid(ctx, width, height);

    if (!cities || cities.length === 0) {
      drawEmptyMessage(ctx, width, height);
      return;
    }

    // 2. ACO Pheromone Heatmap Trail Overlay
    if (showPheromones && selectedAlgorithm === 'ant_colony' && simState?.pheromones) {
      drawPheromoneTrails(ctx, cities, simState.pheromones);
    }

    // 3. GA Population Sample Preview Overlay
    if (showPopulation && selectedAlgorithm === 'genetic_algorithm' && simState?.populationSample) {
      drawPopulationSample(ctx, cities, simState.populationSample);
    }

    // 4. Candidate / Current Route
    if (simState?.currentRoute && simState.currentRoute.length > 1) {
      drawRoute(ctx, cities, simState.currentRoute, '#f59e0b', 2, false, false, [4, 4]);
    }

    // 5. 2-opt Candidate Edge Swap Highlight
    if (selectedAlgorithm === 'two_opt' && simState?.activeSwapPair && simState.currentRoute) {
      drawTwoOptSwapHighlight(ctx, cities, simState.currentRoute, simState.activeSwapPair);
    }

    // 6. Best Route (Primary Glowing Line)
    if (simState?.bestRoute && simState.bestRoute.length > 1) {
      drawRoute(ctx, cities, simState.bestRoute, '#06b6d4', 3.5, true, showDirectionArrows, []);
    }

    // 7. Render Cities (Nodes)
    cities.forEach((city, index) => {
      const isStart = index === 0;
      const isHovered = index === hoveredCityIndex;
      const isDragged = index === draggedCityIndex;
      drawCityNode(ctx, city, index, isStart, isHovered, isDragged);
    });

  }, [cities, simState, selectedAlgorithm, showPheromones, showPopulation, showDirectionArrows, hoveredCityIndex, draggedCityIndex]);

  // Canvas Helper Functions
  function drawBackgroundGrid(ctx, w, h) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const step = 40;
    for (let x = 0; x < w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  function drawEmptyMessage(ctx, w, h) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click canvas to add cities or generate random dataset', w / 2, h / 2);
  }

  function drawCityNode(ctx, city, index, isStart, isHovered, isDragged) {
    const radius = isHovered || isDragged ? 9 : 7;

    // Glowing outer shadow
    ctx.save();
    ctx.shadowBlur = isStart ? 16 : isHovered ? 14 : 8;
    ctx.shadowColor = isStart ? '#3b82f6' : '#06b6d4';

    // Circle Body
    ctx.beginPath();
    ctx.arc(city.x, city.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isStart ? '#3b82f6' : isDragged ? '#ef4444' : '#0ea5e9';
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();

    // Start City Pulse Ring
    if (isStart) {
      ctx.beginPath();
      ctx.arc(city.x, city.y, radius + 5, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Node Label / Index
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${index + 1}`, city.x, city.y - radius - 6);
  }

  function drawRoute(ctx, cities, route, color, width, glow = false, arrows = false, dash = []) {
    if (!route || route.length < 2) return;
    const n = route.length;

    ctx.save();
    if (glow) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = color;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);

    ctx.beginPath();
    const first = cities[route[0]];
    if (!first) return;

    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < n; i++) {
      const c = cities[route[i]];
      if (c) ctx.lineTo(c.x, c.y);
    }
    // Close loop back to starting city
    ctx.lineTo(first.x, first.y);
    ctx.stroke();

    // Draw directional arrows
    if (arrows && n > 2) {
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      for (let i = 0; i < n; i++) {
        const from = cities[route[i]];
        const to = cities[route[(i + 1) % n]];
        if (from && to) {
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const angle = Math.atan2(to.y - from.y, to.x - from.x);
          drawArrowHead(ctx, midX, midY, angle, 6);
        }
      }
    }
    ctx.restore();
  }

  function drawArrowHead(ctx, x, y, angle, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size / 1.8);
    ctx.lineTo(-size, size / 1.8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawPheromoneTrails(ctx, cities, pheromones) {
    const n = cities.length;
    let maxTau = 0.001;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (pheromones[i] && pheromones[i][j] > maxTau) {
          maxTau = pheromones[i][j];
        }
      }
    }

    ctx.save();
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const tau = pheromones[i] ? pheromones[i][j] : 0;
        const normalized = Math.min(1.0, tau / maxTau);

        if (normalized > 0.05) {
          const alpha = Math.max(0.08, normalized * 0.7);
          const lineWidth = 0.5 + normalized * 3.5;

          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`; // Violet glow
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(cities[i].x, cities[i].y);
          ctx.lineTo(cities[j].x, cities[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function drawPopulationSample(ctx, cities, populationSample) {
    populationSample.forEach((route, idx) => {
      const colors = ['rgba(236, 72, 153, 0.25)', 'rgba(34, 197, 94, 0.25)', 'rgba(234, 179, 8, 0.25)'];
      drawRoute(ctx, cities, route, colors[idx % colors.length], 1.5, false, false, [2, 2]);
    });
  }

  function drawTwoOptSwapHighlight(ctx, cities, route, activeSwapPair) {
    const [i, k] = activeSwapPair;
    if (i < 0 || k >= route.length) return;

    const cityA = cities[route[i]];
    const cityB = cities[route[(i + 1) % route.length]];
    const cityC = cities[route[k]];
    const cityD = cities[route[(k + 1) % route.length]];

    if (!cityA || !cityB || !cityC || !cityD) return;

    ctx.save();
    ctx.strokeStyle = '#ef4444'; // Red highlight for swapped edges
    ctx.lineWidth = 4;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(cityA.x, cityA.y);
    ctx.lineTo(cityC.x, cityC.y);
    ctx.moveTo(cityB.x, cityB.y);
    ctx.lineTo(cityD.x, cityD.y);
    ctx.stroke();
    ctx.restore();
  }

  // Interactive Mouse Handlers
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Check if clicked an existing city
    const clickedIndex = cities.findIndex((c) => Math.hypot(c.x - x, c.y - y) <= 12);

    if (interactiveMode === 'remove' || (clickedIndex !== -1 && (e.shiftKey || interactiveMode === 'remove'))) {
      if (clickedIndex !== -1) {
        setCities(cities.filter((_, idx) => idx !== clickedIndex));
      }
      return;
    }

    if (clickedIndex === -1 && (interactiveMode === 'add' || e.altKey)) {
      // Add new city
      const newCity = {
        id: cities.length,
        name: `City ${cities.length + 1}`,
        x,
        y
      };
      setCities([...cities, newCity]);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedIndex = cities.findIndex((c) => Math.hypot(c.x - x, c.y - y) <= 12);
    if (clickedIndex !== -1 && interactiveMode === 'drag') {
      setDraggedCityIndex(clickedIndex);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const hoveredIndex = cities.findIndex((c) => Math.hypot(c.x - x, c.y - y) <= 12);
    setHoveredCityIndex(hoveredIndex !== -1 ? hoveredIndex : null);

    if (draggedCityIndex !== null) {
      // Update dragged city location
      const updated = cities.map((c, idx) => (idx === draggedCityIndex ? { ...c, x, y } : c));
      setCities(updated);
    }
  };

  const handleMouseUp = () => {
    setDraggedCityIndex(null);
  };

  return (
    <div className="relative flex flex-col items-center bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-2xl overflow-hidden w-full">
      {/* Canvas Header & Toggles Bar */}
      <div className="flex flex-wrap items-center justify-between w-full mb-3 px-2 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interactive 2D Map</span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
            {cities.length} Cities
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* ACO Pheromone Toggle */}
          {selectedAlgorithm === 'ant_colony' && (
            <button
              onClick={() => setShowPheromones(!showPheromones)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition font-medium ${
                showPheromones
                  ? 'bg-purple-900/60 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Ant Pheromone Heatmap"
            >
              {showPheromones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Pheromone Heatmap
            </button>
          )}

          {/* GA Population Preview Toggle */}
          {selectedAlgorithm === 'genetic_algorithm' && (
            <button
              onClick={() => setShowPopulation(!showPopulation)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition font-medium ${
                showPopulation
                  ? 'bg-pink-900/60 text-pink-300 border border-pink-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Population Candidates Preview"
            >
              <Layers className="w-3.5 h-3.5" />
              Population Preview
            </button>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative cursor-crosshair rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* City Hover Tooltip */}
        {hoveredCityIndex !== null && cities[hoveredCityIndex] && (
          <div
            className="absolute pointer-events-none bg-slate-900/90 border border-cyan-500/40 backdrop-blur text-slate-200 text-xs px-2.5 py-1 rounded shadow-lg font-mono z-10"
            style={{
              left: Math.min(width - 120, cities[hoveredCityIndex].x + 15),
              top: Math.max(10, cities[hoveredCityIndex].y - 30)
            }}
          >
            <div className="font-semibold text-cyan-400">{cities[hoveredCityIndex].name}</div>
            <div className="text-[10px] text-slate-400">
              ({cities[hoveredCityIndex].x}, {cities[hoveredCityIndex].y})
            </div>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="flex items-center justify-between w-full mt-2 text-[11px] text-slate-400 px-2 font-mono">
        <div>💡 Click to add city | Drag to move | Shift+Click to remove</div>
        <div>Start City: <span className="text-blue-400 font-semibold">City 1</span></div>
      </div>
    </div>
  );
}
