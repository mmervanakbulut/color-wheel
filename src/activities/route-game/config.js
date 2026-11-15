/**
 * @file src/activities/route-game/config.js
 * @description Rota & Algoritma oyunu için karakter temaları, 5x5 ve 8x8 haritalar ve BFS harita doğrulayıcı.
 */

export const ROUTE_THEMES = [
  {
    id: 'cat',
    name: 'Minik Kedi',
    heroIcon: '🐱',
    targetIcon: '🐟',
    obstacleIcon: '💧',
    storyHint: 'Kediyi su birikintisine değmeden balığa ulaştır!',
    winMessage: 'Miyav! Kedi balığa kavuştu!',
  },
  {
    id: 'bee',
    name: 'Sevimli Arı',
    heroIcon: '🐝',
    targetIcon: '🌻',
    obstacleIcon: '🪨',
    storyHint: 'Arıyı taşlara çarpmadan çiçeğe ulaştır!',
    winMessage: 'Harika! Arı çiçeğe ulaştı ve bal yaptı!',
  },
  {
    id: 'robot',
    name: 'Akıllı Robot',
    heroIcon: '🤖',
    targetIcon: '🔋',
    obstacleIcon: '🧱',
    storyHint: 'Robotu duvarlara çarpmadan pile ulaştır!',
    winMessage: 'Süpersin! Robot tam şarj oldu!',
  },
  {
    id: 'space',
    name: 'Uzay Kaşifi',
    heroIcon: '🚀',
    targetIcon: '🪐',
    obstacleIcon: '☄️',
    storyHint: 'Roketi göktaşlarına çarpmadan gezegene ulaştır!',
    winMessage: 'Muhteşem! Roket yeni gezegene indi!',
  },
];

export const DIRECTION_VECTORS = {
  UP: { dr: -1, dc: 0, label: 'Yukarı', arrow: '⬆️' },
  DOWN: { dr: 1, dc: 0, label: 'Aşağı', arrow: '⬇️' },
  LEFT: { dr: 0, dc: -1, label: 'Sol', arrow: '⬅️' },
  RIGHT: { dr: 0, dc: 1, label: 'Sağ', arrow: '➡️' },
};

export const LEVELS_5X5 = [
  { title: 'Görev 1', grid: ['.....', '.....', '.ST..', '.....', '.....'] },
  { title: 'Görev 2', grid: ['.....', '.....', '.S.T.', '.....', '.....'] },
  { title: 'Görev 3', grid: ['.....', '..T..', '.....', '..S..', '.....'] },
  { title: 'Görev 4', grid: ['.....', '.S...', '.....', '.T...', '.....'] },
  { title: 'Görev 5', grid: ['.....', '.....', '.SXT.', '.....', '.....'] },
  { title: 'Görev 6', grid: ['.....', '.S.X.', '...X.', '...T.', '.....'] },
  { title: 'Görev 7', grid: ['.....', '.S.X.', '.X...', '...XT', '.....'] },
  { title: 'Görev 8', grid: ['S..X.', '.X.X.', '.X...', '.XXX.', '...T.'] },
];

export const LEVELS_8X8 = [
  {
    title: 'Görev 1',
    grid: [
      '........',
      '........',
      '........',
      '..S..T..',
      '........',
      '........',
      '........',
      '........',
    ],
  },
  {
    title: 'Görev 2',
    grid: [
      '........',
      '..T.....',
      '........',
      '........',
      '..S.....',
      '........',
      '........',
      '........',
    ],
  },
  {
    title: 'Görev 3',
    grid: [
      '........',
      '.S......',
      '....X...',
      '....X...',
      '......T.',
      '........',
      '........',
      '........',
    ],
  },
  {
    title: 'Görev 4',
    grid: [
      '........',
      '........',
      '.S.X....',
      '...X....',
      '...X..T.',
      '........',
      '........',
      '........',
    ],
  },
  {
    title: 'Görev 5',
    grid: [
      '........',
      '.S..X...',
      '.XX.X...',
      '....X.T.',
      '..XXX...',
      '........',
      '........',
      '........',
    ],
  },
  {
    title: 'Görev 6',
    grid: [
      'S..X....',
      '.X.X..X.',
      '.X....X.',
      '.XXXX.X.',
      '....X...',
      '..X.XXX.',
      '..X...T.',
      '........',
    ],
  },
];

export function parseGrid(grid) {
  const size = grid.length;
  let start = { r: 0, c: 0 };
  let target = { r: 0, c: 1 };
  const obstacles = new Set();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const ch = grid[r][c];
      if (ch === 'S') start = { r, c };
      else if (ch === 'T') target = { r, c };
      else if (ch === 'X') obstacles.add(`${r}-${c}`);
    }
  }
  return { size, start, target, obstacles };
}

export function findShortestPathLength(size, start, target, obstacles) {
  const queue = [{ r: start.r, c: start.c, dist: 0 }];
  const visited = new Set([`${start.r}-${start.c}`]);
  const dirs = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  while (queue.length > 0) {
    const curr = queue.shift();
    if (curr.r === target.r && curr.c === target.c) return curr.dist;

    for (const d of dirs) {
      const nr = curr.r + d.dr;
      const nc = curr.c + d.dc;
      const key = `${nr}-${nc}`;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !obstacles.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push({ r: nr, c: nc, dist: curr.dist + 1 });
      }
    }
  }
  return -1;
}

export function createVerifiedRandomLevel(size = 8) {
  const minDist = size === 8 ? 4 : 2;
  const maxDist = size === 8 ? 14 : 9;
  const minObs = size === 8 ? 8 : 3;
  const extraObs = size === 8 ? 7 : 3;

  for (let attempt = 0; attempt < 60; attempt++) {
    const empty = Array.from({ length: size }, () => Array(size).fill('.'));
    const sr = Math.floor(Math.random() * size);
    const sc = Math.floor(Math.random() * Math.max(2, Math.floor(size / 3)));
    const tr = Math.floor(Math.random() * size);
    const tc = size - 1 - Math.floor(Math.random() * Math.max(2, Math.floor(size / 3)));

    empty[sr][sc] = 'S';
    empty[tr][tc] = 'T';

    const obsCount = minObs + Math.floor(Math.random() * extraObs);
    let placed = 0;
    while (placed < obsCount) {
      const or = Math.floor(Math.random() * size);
      const oc = Math.floor(Math.random() * size);
      if (empty[or][oc] === '.') {
        empty[or][oc] = 'X';
        placed++;
      }
    }

    const grid = empty.map((row) => row.join(''));
    const parsed = parseGrid(grid);
    const dist = findShortestPathLength(size, parsed.start, parsed.target, parsed.obstacles);

    if (dist >= minDist && dist <= maxDist) {
      return {
        title: 'Sürpriz Harita',
        grid,
        ...parsed,
        optimalSteps: dist,
      };
    }
  }

  const fallback = size === 8 ? LEVELS_8X8[2] : LEVELS_5X5[4];
  const parsed = parseGrid(fallback.grid);
  return {
    title: 'Sürpriz Harita',
    grid: fallback.grid,
    ...parsed,
    optimalSteps: findShortestPathLength(parsed.size, parsed.start, parsed.target, parsed.obstacles),
  };
}

export function getPresetLevel(gridSize, index) {
  const list = gridSize === 8 ? LEVELS_8X8 : LEVELS_5X5;
  const safeIdx = ((index % list.length) + list.length) % list.length;
  const raw = list[safeIdx];
  const parsed = parseGrid(raw.grid);
  return {
    index: safeIdx,
    total: list.length,
    title: raw.title,
    grid: raw.grid,
    ...parsed,
    optimalSteps: findShortestPathLength(parsed.size, parsed.start, parsed.target, parsed.obstacles),
  };
}
