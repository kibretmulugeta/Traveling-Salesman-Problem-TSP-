/**
 * Preset datasets and city generation utilities for the TSP Lab.
 * Coordinates are normalized to canvas viewBox boundaries (typically 800x500).
 */

import { createPRNG, randomFloat } from './random.js';

export const PRESETS = [
  { id: 'random_10', name: '10 Cities (Random)', cityCount: 10, type: 'random' },
  { id: 'random_20', name: '20 Cities (Random)', cityCount: 20, type: 'random' },
  { id: 'random_50', name: '50 Cities (Random)', cityCount: 50, type: 'random' },
  { id: 'random_100', name: '100 Cities (Random)', cityCount: 100, type: 'random' },
  { id: 'random_200', name: '200 Cities (Random)', cityCount: 200, type: 'random' },
  { id: 'circle', name: 'Small Circle (16 Cities)', cityCount: 16, type: 'circle' },
  { id: 'two_clusters', name: 'Two Clusters (30 Cities)', cityCount: 30, type: 'clusters' },
  { id: 'grid', name: 'Grid Layout (25 Cities)', cityCount: 25, type: 'grid' },
  { id: 'us_cities', name: 'US Major Cities (20 Cities)', cityCount: 20, type: 'geo_us' },
  { id: 'eu_cities', name: 'European Cities (18 Cities)', cityCount: 18, type: 'geo_eu' },
  { id: 'concentric', name: 'Concentric Circles (32 Cities)', cityCount: 32, type: 'concentric' },
  { id: 'star_difficult', name: 'Difficult Star Pattern (24 Cities)', cityCount: 24, type: 'star' }
];

/**
 * Generates random city coordinates within specified width & height.
 * @param {number} count 
 * @param {number} width 
 * @param {number} height 
 * @param {number} margin 
 * @param {Function} [rng] 
 * @returns {Array<{id: number, name: string, x: number, y: number}>}
 */
export function generateRandomCities(count, width = 800, height = 500, margin = 40, rng = Math.random) {
  const cities = [];
  const minDist = Math.max(12, 350 / Math.sqrt(count));
  let attempts = 0;

  while (cities.length < count && attempts < count * 200) {
    attempts++;
    const x = Math.round(margin + rng() * (width - 2 * margin));
    const y = Math.round(margin + rng() * (height - 2 * margin));

    // Ensure minimum distance to avoid overlapping city dots
    let tooClose = false;
    for (let c of cities) {
      const dist = Math.hypot(c.x - x, c.y - y);
      if (dist < minDist) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose || attempts > count * 150) {
      cities.push({
        id: cities.length,
        name: `City ${cities.length + 1}`,
        x,
        y
      });
    }
  }

  return cities;
}

/**
 * Loads or generates cities based on a preset ID.
 * @param {string} presetId 
 * @param {number} width 
 * @param {number} height 
 * @param {Function} [rng] 
 * @returns {Array<{id: number, name: string, x: number, y: number}>}
 */
export function generatePresetCities(presetId, width = 800, height = 500, rng = Math.random) {
  const cx = width / 2;
  const cy = height / 2;

  switch (presetId) {
    case 'circle': {
      const count = 16;
      const radius = Math.min(width, height) * 0.35;
      return Array.from({ length: count }, (_, i) => {
        const angle = (2 * Math.PI * i) / count;
        return {
          id: i,
          name: `Circle Node ${i + 1}`,
          x: Math.round(cx + radius * Math.cos(angle)),
          y: Math.round(cy + radius * Math.sin(angle))
        };
      });
    }

    case 'two_clusters': {
      const count1 = 15;
      const count2 = 15;
      const cluster1X = width * 0.3;
      const cluster1Y = height * 0.5;
      const cluster2X = width * 0.7;
      const cluster2Y = height * 0.5;
      const radius = 90;

      const cities = [];
      for (let i = 0; i < count1; i++) {
        const angle = rng() * 2 * Math.PI;
        const r = rng() * radius;
        cities.push({
          id: cities.length,
          name: `West-C${i + 1}`,
          x: Math.round(cluster1X + r * Math.cos(angle)),
          y: Math.round(cluster1Y + r * Math.sin(angle))
        });
      }
      for (let i = 0; i < count2; i++) {
        const angle = rng() * 2 * Math.PI;
        const r = rng() * radius;
        cities.push({
          id: cities.length,
          name: `East-C${i + 1}`,
          x: Math.round(cluster2X + r * Math.cos(angle)),
          y: Math.round(cluster2Y + r * Math.sin(angle))
        });
      }
      return cities;
    }

    case 'grid': {
      const rows = 5;
      const cols = 5;
      const paddingX = width / (cols + 1);
      const paddingY = height / (rows + 1);
      const cities = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cities.push({
            id: cities.length,
            name: `Grid ${r + 1},${c + 1}`,
            x: Math.round(paddingX * (c + 1)),
            y: Math.round(paddingY * (r + 1))
          });
        }
      }
      return cities;
    }

    case 'us_cities': {
      const rawGeo = [
        { name: 'New York', x: 700, y: 180 },
        { name: 'Los Angeles', x: 120, y: 320 },
        { name: 'Chicago', x: 550, y: 200 },
        { name: 'Houston', x: 450, y: 410 },
        { name: 'Phoenix', x: 220, y: 350 },
        { name: 'Philadelphia', x: 690, y: 200 },
        { name: 'San Antonio', x: 430, y: 430 },
        { name: 'San Diego', x: 140, y: 360 },
        { name: 'Dallas', x: 460, y: 370 },
        { name: 'San Jose', x: 100, y: 260 },
        { name: 'Austin', x: 440, y: 415 },
        { name: 'Seattle', x: 130, y: 90 },
        { name: 'Denver', x: 330, y: 240 },
        { name: 'Washington DC', x: 670, y: 220 },
        { name: 'Boston', x: 730, y: 150 },
        { name: 'Miami', x: 680, y: 460 },
        { name: 'Atlanta', x: 580, y: 340 },
        { name: 'Las Vegas', x: 190, y: 290 },
        { name: 'St. Louis', x: 500, y: 250 },
        { name: 'Minneapolis', x: 480, y: 150 }
      ];
      return rawGeo.map((item, idx) => ({ id: idx, name: item.name, x: item.x, y: item.y }));
    }

    case 'eu_cities': {
      const rawGeo = [
        { name: 'London', x: 260, y: 180 },
        { name: 'Paris', x: 300, y: 250 },
        { name: 'Berlin', x: 450, y: 160 },
        { name: 'Madrid', x: 180, y: 410 },
        { name: 'Rome', x: 470, y: 390 },
        { name: 'Amsterdam', x: 330, y: 170 },
        { name: 'Vienna', x: 510, y: 270 },
        { name: 'Prague', x: 470, y: 230 },
        { name: 'Brussels', x: 310, y: 200 },
        { name: 'Warsaw', x: 560, y: 180 },
        { name: 'Stockholm', x: 510, y: 80 },
        { name: 'Copenhagen', x: 430, y: 130 },
        { name: 'Lisbon', x: 110, y: 430 },
        { name: 'Athens', x: 670, y: 450 },
        { name: 'Dublin', x: 190, y: 160 },
        { name: 'Zurich', x: 370, y: 280 },
        { name: 'Munich', x: 420, y: 270 },
        { name: 'Budapest', x: 550, y: 280 }
      ];
      return rawGeo.map((item, idx) => ({ id: idx, name: item.name, x: item.x, y: item.y }));
    }

    case 'concentric': {
      const innerCount = 10;
      const outerCount = 22;
      const rInner = 80;
      const rOuter = 190;
      const cities = [];

      for (let i = 0; i < innerCount; i++) {
        const angle = (2 * Math.PI * i) / innerCount;
        cities.push({
          id: cities.length,
          name: `Inner ${i + 1}`,
          x: Math.round(cx + rInner * Math.cos(angle)),
          y: Math.round(cy + rInner * Math.sin(angle))
        });
      }
      for (let i = 0; i < outerCount; i++) {
        const angle = (2 * Math.PI * i) / outerCount;
        cities.push({
          id: cities.length,
          name: `Outer ${i + 1}`,
          x: Math.round(cx + rOuter * Math.cos(angle)),
          y: Math.round(cy + rOuter * Math.sin(angle))
        });
      }
      return cities;
    }

    case 'star_difficult': {
      const points = 12;
      const rOuter = 210;
      const rInner = 60;
      const cities = [];

      for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI * i) / points;
        const r = i % 2 === 0 ? rOuter : rInner;
        cities.push({
          id: i,
          name: `Star ${i + 1}`,
          x: Math.round(cx + r * Math.cos(angle)),
          y: Math.round(cy + r * Math.sin(angle))
        });
      }
      return cities;
    }

    default: {
      const presetObj = PRESETS.find((p) => p.id === presetId);
      const count = presetObj ? presetObj.cityCount : 20;
      return generateRandomCities(count, width, height, 40, rng);
    }
  }
}
