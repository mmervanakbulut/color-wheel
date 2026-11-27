/**
 * @file src/activities/route-game/config.js
 * @description Rota & Algoritma oyunu için karakter temaları, elmaslı 5x5 & 8x8 haritalar ve BFS doğrulayıcı.
 */

export const ROUTE_THEMES = [
  {
    id: 'cat',
    name: 'Minik Kedi',
    heroIcon: '🐱',
    targetIcon: '🐟',
    obstacleIcon: '💧',
    storyHint: 'Elmasları toplayıp kediyi suya değmeden balığa ulaştır!',
    winMessage: 'Miyav! Kedi elmasları topladı ve balığa kavuştu!',
  },
  {
    id: 'bee',
    name: 'Sevimli Arı',
    heroIcon: '🐝',
    targetIcon: '🌻',
    obstacleIcon: '🪨',
    storyHint: 'Elmasları toplayıp arıyı taşlara çarpmadan çiçeğe ulaştır!',
    winMessage: 'Harika! Arı elmasları topladı ve çiçeğe ulaştı!',
  },
  {
    id: 'robot',
    name: 'Akıllı Robot',
    heroIcon: '🤖',
    targetIcon: '🔋',
    obstacleIcon: '🧱',
    storyHint: 'Elmasları toplayıp robotu duvarlara çarpmadan pile ulaştır!',
    winMessage: 'Süpersin! Robot elmasları topladı ve tam şarj oldu!',
  },
  {
    id: 'space',
    name: 'Uzay Kaşifi',
    heroIcon: '🚀',
    targetIcon: '🪐',
    obstacleIcon: '☄️',
    storyHint: 'Elmasları toplayıp roketi göktaşlarına çarpmadan gezegene ulaştır!',
    winMessage: 'Muhteşem! Roket elmasları topladı ve gezegene indi!',
  },
];

export const DIRECTION_VECTORS = {
  UP: { dr: -1, dc: 0, label: 'Yukarı', arrow: '⬆️' },
  DOWN: { dr: 1, dc: 0, label: 'Aşağı', arrow: '⬇️' },
  LEFT: { dr: 0, dc: -1, label: 'Sol', arrow: '⬅️' },
  RIGHT: { dr: 0, dc: 1, label: 'Sağ', arrow: '➡️' },
};

// S=Başlangıç, T=Hedef, G=Elmas (💎), X=Engel, .=Boş
export const LEVELS_5X5 = [
  { title: 'Görev 1', grid: ['.....', '.....', '.SGT.', '.....', '.....'] },
  { title: 'Görev 2', grid: ['.....', '..G..', '.S.T.', '.....', '.....'] },
  { title: 'Görev 3', grid: ['..G..', '..X..', '.S.T.', '.....', '.....'] },
  { title: 'Görev 4', grid: ['.S...', '.XX..', '.G.T.', '.....', '.....'] },
  { title: 'Görev 5', grid: ['.G...', '.X.G.', '.S.X.', '...T.', '.....'] },
  { title: 'Görev 6', grid: ['S..G.', '.XX..', '.G.X.', '...T.', '.....'] },
  { title: 'Görev 7', grid: ['.G.X.', '.S.G.', '.X.X.', '...T.', '.....'] },
  { title: 'Görev 8', grid: ['S..G.', '.X.X.', '.G.G.', '.XXX.', '...T.'] },
];

export const LEVELS_8X8 = [
  {
    title: 'Görev 1',
    grid: ['........', '........', '...G....', '..S..T..', '........', '........', '........', '........'],
  },
  {
    title: 'Görev 2',
    grid: ['........', '..G..T..', '..X.....', '........', '..S..G..', '........', '........', '........'],
  },
  {
    title: 'Görev 3',
    grid: ['........', '.S..G...', '....X...', '.G..X...', '......T.', '........', '........', '........'],
  },
  {
    title: 'Görev 4',
    grid: ['........', '...G....', '.S.X..G.', '...X....', '...X..T.', '........', '........', '........'],
  },
  {
    title: 'Görev 5',
    grid: ['....G...', '.S..X...', '.XX.X.G.', '.G..X.T.', '..XXX...', '........', '........', '........'],
  },
  {
    title: 'Görev 6',
    grid: ['S..X..G.', '.X.X..X.', '.G....X.', '.XXXX.X.', '....X.G.', '..X.XXX.', '..X...T.', '........'],
  },
];

export function parseGrid(grid, withGems = true) {
  const size = grid.length;
  let start = { r: 0, c: 0 };
  let target = { r: 0, c: 1 };
  const obstacles = new Set();
  const gems = new Set();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const ch = grid[r][c];
      if (ch === 'S') start = { r, c };
      else if (ch === 'T') target = { r, c };
      else if (ch === 'X') obstacles.add(`${r}-${c}`);
      else if (ch === 'G' && withGems) gems.add(`${r}-${c}`);
    }
  }
  return { size, start, target, obstacles, gems };
}

export function findShortestPathLength(size, from, to, obstacles) {
  const queue = [{ r: from.r, c: from.c, dist: 0 }];
  const visited = new Set([`${from.r}-${from.c}`]);
  const dirs = [{ dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }];

  while (queue.length > 0) {
    const curr = queue.shift();
    if (curr.r === to.r && curr.c === to.c) return curr.dist;

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

export function createVerifiedRandomLevel(size = 8, withGems = true) {
  const minObs = size === 8 ? 8 : 3;
  const extraObs = size === 8 ? 6 : 3;
  const gemGoal = withGems ? (size === 8 ? 2 : 1) : 0;

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
      if (empty[or][oc] === '.') { empty[or][oc] = 'X'; placed++; }
    }

    const gemList = [];
    let gTries = 0;
    while (gemList.length < gemGoal && gTries < 30) {
      gTries++;
      const gr = Math.floor(Math.random() * size);
      const gc = Math.floor(Math.random() * size);
      if (empty[gr][gc] === '.') {
        empty[gr][gc] = 'G';
        gemList.push({ r: gr, c: gc });
      }
    }

    const grid = empty.map((row) => row.join(''));
    const parsed = parseGrid(grid, withGems);
    // Hedef dışında başka hücrelerden geçmeden ulaşılabilir mi kontrol et
    const obsAndTarget = new Set(parsed.obstacles);
    obsAndTarget.add(`${parsed.target.r}-${parsed.target.c}`);

    let valid = true;
    let totalDist = 0;
    let cur = parsed.start;
    for (const g of gemList) {
      const d = findShortestPathLength(size, cur, g, obsAndTarget);
      if (d <= 0) { valid = false; break; }
      totalDist += d;
      cur = g;
    }
    const lastD = findShortestPathLength(size, cur, parsed.target, parsed.obstacles);
    if (valid && lastD > 0 && totalDist + lastD <= (size === 8 ? 18 : 11)) {
      return { title: 'Sürpriz Harita', grid, ...parsed, optimalSteps: totalDist + lastD };
    }
  }

  const fallback = size === 8 ? LEVELS_8X8[2] : LEVELS_5X5[3];
  const parsed = parseGrid(fallback.grid, withGems);
  return { title: 'Sürpriz Harita', grid: fallback.grid, ...parsed, optimalSteps: 8 };
}

export function getPresetLevel(gridSize, index, withGems = true) {
  const list = gridSize === 8 ? LEVELS_8X8 : LEVELS_5X5;
  const safeIdx = ((index % list.length) + list.length) % list.length;
  const raw = list[safeIdx];
  const parsed = parseGrid(raw.grid, withGems);
  return {
    index: safeIdx,
    total: list.length,
    title: raw.title,
    grid: raw.grid,
    ...parsed,
    optimalSteps: 8,
  };
}
