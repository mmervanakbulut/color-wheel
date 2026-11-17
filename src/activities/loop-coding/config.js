/**
 * @file src/activities/loop-coding/config.js
 * @description Döngü Atölyesi (Harita üzerinde döngü bloklarıyla algoritma) sabitleri ve harita üreticisi.
 */

export const LOOP_THEMES = [
  { id: 'frog', name: 'Kurbağa', hero: '🐸', target: '🪷', obstacle: '🪨' },
  { id: 'robot', name: 'Robot', hero: '🤖', target: '🔋', obstacle: '🚧' },
  { id: 'space', name: 'Uzay', hero: '🚀', target: '🪐', obstacle: '☄️' },
  { id: 'bee', name: 'Arı', hero: '🐝', target: '🌻', obstacle: '🌵' },
];

export const DIR_META = {
  up: { id: 'up', arrow: '⬆️', label: 'Yukarı', dr: -1, dc: 0, color: '#0284C7', bg: '#E0F2FE' },
  down: { id: 'down', arrow: '⬇️', label: 'Aşağı', dr: 1, dc: 0, color: '#7C3AED', bg: '#EDE9FE' },
  left: { id: 'left', arrow: '⬅️', label: 'Sol', dr: 0, dc: -1, color: '#EA580C', bg: '#FFEDD5' },
  right: { id: 'right', arrow: '➡️', label: 'Sağ', dr: 0, dc: 1, color: '#16A34A', bg: '#DCFCE7' },
};

// S=Başlangıç, T=Hedef, #=Engel, .=Boş
export const LEVELS_5X5 = [
  // 1: 4x Sağ (Tek döngü grubu)
  {
    hint: 'Önce ➡️ tuşuna bas, sonra 4× seçerek 4× [➡️] grubunu oluştur!',
    grid: ['#####', 'S...T', '#####', '.....', '.....'],
  },
  // 2: 3x Aşağı -> 3x Sağ (L yolu)
  {
    hint: 'Önce ⬇️ basıp 3× seç, sonra ➡️ basıp 3× seç!',
    grid: ['.S#..', '..#..', '..#..', '....T', '#####'],
  },
  // 3: 4x Sağ -> 3x Aşağı
  {
    hint: '➡️ basıp 4× seç, ardından ⬇️ basıp 3× seç!',
    grid: ['S....', '####.', '...#.', '...#T', '#####'],
  },
  // 4: 2x Aşağı -> 4x Sağ -> 2x Yukarı (U yolu)
  {
    hint: '3 grup oluştur: 2× [⬇️], 4× [➡️] ve 2× [⬆️]!',
    grid: ['S###T', '.###.', '.....', '#####', '.....'],
  },
  // 5: Merdiven (Grup Döngüsü: 3x [Sağ + Aşağı])
  {
    hint: 'Merdiven! Önce ➡️ ve ⬇️ tuşlarına bas, sonra 3× seç: 3× [➡️ ⬇️]!',
    grid: ['S.#..', '..#..', '...#.', '....#', '...T.'],
  },
  // 6: 3x Yukarı -> 4x Sol
  {
    hint: 'Önce ⬆️ basıp 3× seç, sonra ⬅️ basıp 4× seç!',
    grid: ['T....', '####.', '####.', '....S', '#####'],
  },
  // 7: 3x Sağ -> 2x Aşağı -> 3x Sol
  {
    hint: '3× [➡️], 2× [⬇️] ve 3× [⬅️] gruplarını sırayla oluştur!',
    grid: ['.S...', '...#.', '.T...', '#####', '.....'],
  },
  // 8: Merdiven yukarı (3x [Sağ + Yukarı])
  {
    hint: 'Merdiven! Önce ➡️ ve ⬆️ tuşlarına bas, sonra 3× seç: 3× [➡️ ⬆️]!',
    grid: ['...T.', '..#..', '.#...', 'S....', '#####'],
  },
];

export const LEVELS_6X6 = [
  // 1: 5x Sağ -> 4x Aşağı
  {
    hint: '➡️ basıp 5× seç, sonra ⬇️ basıp 4× seç!',
    grid: ['S.....', '#####.', '#####.', '#####.', '.....T', '######'],
  },
  // 2: 4x Aşağı -> 4x Sağ -> 4x Yukarı
  {
    hint: '4× [⬇️], 4× [➡️] ve 4× [⬆️] döngü gruplarını oluştur!',
    grid: ['S.###T', '..###.', '..###.', '..###.', '......', '######'],
  },
  // 3: Merdiven (4x [Sağ + Aşağı])
  {
    hint: 'Önce ➡️ ve ⬇️ bas, sonra 4× seçerek 4× [➡️ ⬇️] grubunu kur!',
    grid: ['S.#...', '..#...', '...#..', '....#.', '....T.', '######'],
  },
  // 4: 3x Sağ -> 3x Aşağı -> 2x Sağ -> 2x Aşağı
  {
    hint: 'Döngü gruplarını sırayla oluşturup hedefe ulaş!',
    grid: ['S...#.', '###.#.', '###.#.', '...T#.', '#####.', '......'],
  },
  // 5: Spiral (4x Sağ -> 4x Aşağı -> 3x Sol -> 2x Yukarı)
  {
    hint: 'Salyangoz yolunu döngü gruplarıyla çöz!',
    grid: ['.S....', '.###..', '.#T#..', '.###..', '......', '######'],
  },
  // 6: Merdiven Yukarı (4x [Sağ + Yukarı])
  {
    hint: 'Önce ➡️ ve ⬆️ bas, sonra 4× seçerek 4× [➡️ ⬆️] grubunu kur!',
    grid: ['....T.', '...#..', '..#...', '.#....', 'S.....', '######'],
  },
];

export function parseLoopLevel(gridStrings) {
  const size = gridStrings.length;
  let start = { r: 0, c: 0 };
  let target = { r: size - 1, c: size - 1 };
  const obstacles = new Set();

  gridStrings.forEach((rowStr, r) => {
    for (let c = 0; c < size; c++) {
      const ch = rowStr[c];
      if (ch === 'S') start = { r, c };
      else if (ch === 'T') target = { r, c };
      else if (ch === '#') obstacles.add(`${r}-${c}`);
    }
  });

  return { size, start, target, obstacles };
}

/**
 * Döngü kullanımına uygun (uzun düz koridorlar veya merdiven) rastgele harita üretir.
 */
export function createRandomLoopLevel(size = 5) {
  const path = new Set();
  let r = Math.random() < 0.5 ? 0 : size - 1;
  let c = 0;
  const start = { r, c };
  path.add(`${r}-${c}`);

  const dr = r === 0 ? 1 : -1;
  const isStair = Math.random() < 0.35;

  if (isStair) {
    const steps = size - 2;
    for (let i = 0; i < steps; i++) {
      c += 1;
      path.add(`${r}-${c}`);
      r += dr;
      path.add(`${r}-${c}`);
    }
  } else {
    const horiz1 = Math.min(size - 1, 2 + Math.floor(Math.random() * (size - 2)));
    while (c < horiz1) {
      c += 1;
      path.add(`${r}-${c}`);
    }
    const vertSteps = 2 + Math.floor(Math.random() * (size - 2));
    for (let i = 0; i < vertSteps && r + dr >= 0 && r + dr < size; i++) {
      r += dr;
      path.add(`${r}-${c}`);
    }
    while (c < size - 1 && Math.random() < 0.7) {
      c += 1;
      path.add(`${r}-${c}`);
    }
  }

  const target = { r, c };
  const obstacles = new Set();
  for (let rr = 0; rr < size; rr++) {
    for (let cc = 0; cc < size; cc++) {
      const key = `${rr}-${cc}`;
      if (!path.has(key) && Math.random() < 0.42) {
        obstacles.add(key);
      }
    }
  }

  return {
    size,
    start,
    target,
    obstacles,
    hint: isStair
      ? 'Merdiven yolu! Grup Döngüsü veya tekrar blokları kullan!'
      : 'Düz koridorları tek bir döngü bloğuyla (3×, 4×) geç!',
  };
}

/**
 * Kullanıcının oluşturduğu döngü gruplarını ({ id, dirs: ['right', 'down'], count: 3 })
 * harita üzerinde yürütülecek tekil adımlara açar.
 */
export function expandProgramToSteps(groups) {
  const steps = [];
  groups.forEach((group, groupIdx) => {
    for (let iter = 1; iter <= group.count; iter++) {
      group.dirs.forEach((dir, dirIdx) => {
        steps.push({
          dir,
          groupIdx,
          dirIdx,
          iter,
          totalIters: group.count,
        });
      });
    }
  });
  return steps;
}
