/**
 * @file src/activities/pixel-coding/config.js
 * @description Piksel Kodlama renk sabitleri, renk karıştırıcı ve kurallı akıllı desen üreticisi.
 */

import { EASY_PATTERNS, MASTER_PATTERNS } from './patterns';

export { EASY_PATTERNS, MASTER_PATTERNS };

export const PIXEL_COLORS = [
  { code: 1, name: 'Kırmızı', hex: '#EF4444', border: '#B91C1C', text: '#FFFFFF' },
  { code: 2, name: 'Mavi', hex: '#3B82F6', border: '#1D4ED8', text: '#FFFFFF' },
  { code: 3, name: 'Sarı', hex: '#FACC15', border: '#CA8A04', text: '#0F172A' },
  { code: 4, name: 'Yeşil', hex: '#22C55E', border: '#15803D', text: '#FFFFFF' },
  { code: 5, name: 'Mor', hex: '#8B5CF6', border: '#6D28D9', text: '#FFFFFF' },
  { code: 6, name: 'Turuncu', hex: '#F97316', border: '#C2410C', text: '#FFFFFF' },
];

export const COLOR_BY_CODE = Object.fromEntries(PIXEL_COLORS.map((c) => [c.code, c]));

export function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

export function getUsedColorCodes(grid) {
  const used = new Set();
  grid.forEach((row) => row.forEach((val) => { if (val > 0) used.add(val); }));
  return Array.from(used).sort((a, b) => a - b);
}

function shuffleCodes() {
  return [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
}

/**
 * Mevcut tanıdık bir desenin şeklini koruyarak renk ve sayı kodlarını rastgele değiştirir.
 */
export function remixPatternColors(pattern) {
  const used = getUsedColorCodes(pattern.grid);
  const pool = shuffleCodes();
  const map = {};
  used.forEach((oldCode, idx) => {
    map[oldCode] = pool[idx] === oldCode ? pool[(idx + 1) % pool.length] : pool[idx];
  });

  const remixedGrid = pattern.grid.map((row) =>
    row.map((cell) => (cell === 0 ? 0 : map[cell] || cell))
  );

  return {
    ...pattern,
    id: `${pattern.id}-remix-${Date.now()}`,
    grid: remixedGrid,
  };
}

/**
 * Kurallı Simetrik Piksel Karakter / Robot Yüzü üretir (dağınık nokta yerine anlamlı yüz).
 */
function createPixelAvatar(size) {
  const [body, eye, mouth] = shuffleCodes();
  const names = [
    { title: 'Neşeli Robot', icon: '🤖' },
    { title: 'Sevimli Uzaylı', icon: '👾' },
    { title: 'Piksel Canavar', icon: '👹' },
  ];
  const meta = names[Math.floor(Math.random() * names.length)];
  const earsTop = Math.random() < 0.5;

  if (size === 4) {
    return {
      id: `avatar4-${Date.now()}`,
      ...meta,
      grid: [
        earsTop ? [body, 0, 0, body] : [0, body, body, 0],
        [body, eye, eye, body],
        [body, body, body, body],
        [0, mouth, mouth, 0],
      ],
    };
  }

  return {
    id: `avatar5-${Date.now()}`,
    ...meta,
    grid: [
      earsTop ? [body, 0, body, 0, body] : [0, body, body, body, 0],
      [body, eye, body, eye, body],
      [body, body, mouth, body, body],
      [body, mouth, mouth, mouth, body],
      [0, body, 0, body, 0],
    ],
  };
}

/**
 * Kurallı Geometrik Kodlama Deseni üretir (Baklava, Çerçeve, Halı, Yıldız, Merdiven).
 */
function createGeometricMotif(size) {
  const [c1, c2, c3] = shuffleCodes();
  const variant = Math.floor(Math.random() * 4);
  const grid = createEmptyGrid(size);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (variant === 0) {
        // Hedef Çerçeve
        const edge = r === 0 || c === 0 || r === size - 1 || c === size - 1;
        grid[r][c] = edge ? c1 : (r === c || r + c === size - 1 ? c2 : 0);
      } else if (variant === 1) {
        // Dama Halısı
        grid[r][c] = (r + c) % 2 === 0 ? c1 : c2;
      } else if (variant === 2) {
        // Çapraz Yıldız
        if (r === c) grid[r][c] = c1;
        else if (r + c === size - 1) grid[r][c] = c2;
      } else {
        // Renkli Merdiven
        if (r + c >= size - 1) grid[r][c] = (r % 2 === 0) ? c1 : c3;
      }
    }
  }

  const titles = [
    { title: 'Hedef Çerçeve', icon: '🎯' },
    { title: 'Renkli Dama', icon: '🏁' },
    { title: 'Çapraz Yıldız', icon: '✨' },
    { title: 'Kod Merdiveni', icon: '🪜' },
  ];

  return {
    id: `geo-${Date.now()}`,
    ...titles[variant],
    grid,
  };
}

let surpriseStep = 0;

export function createSurprisePattern(size) {
  surpriseStep = (surpriseStep + 1) % 3;
  if (surpriseStep === 0) return createPixelAvatar(size);
  if (surpriseStep === 1) return createGeometricMotif(size);
  const list = size === 4 ? EASY_PATTERNS : MASTER_PATTERNS;
  const pick = list[Math.floor(Math.random() * list.length)];
  return remixPatternColors(pick);
}
