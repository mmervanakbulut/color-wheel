/**
 * @file src/activities/debug-coding/config.js
 * @description Hata Ayıklama (Debugging) etkinliği için eksik/yanlış/fazla adımlı harita görevleri ve üretici.
 */

export const DEBUG_THEMES = [
  { id: 'robot', name: 'Robot', hero: '🤖', target: '🔋', obstacle: '🚧' },
  { id: 'cat', name: 'Kedi', hero: '🐱', target: '🐟', obstacle: '🪨' },
  { id: 'bee', name: 'Arı', hero: '🐝', target: '🌻', obstacle: '🌵' },
  { id: 'space', name: 'Uzay', hero: '🚀', target: '🪐', obstacle: '☄️' },
];

export const DIR_META = {
  up: { id: 'up', arrow: '⬆️', label: 'Yukarı', dr: -1, dc: 0, color: '#0284C7', bg: '#E0F2FE' },
  down: { id: 'down', arrow: '⬇️', label: 'Aşağı', dr: 1, dc: 0, color: '#7C3AED', bg: '#EDE9FE' },
  left: { id: 'left', arrow: '⬅️', label: 'Sol', dr: 0, dc: -1, color: '#EA580C', bg: '#FFEDD5' },
  right: { id: 'right', arrow: '➡️', label: 'Sağ', dr: 0, dc: 1, color: '#16A34A', bg: '#DCFCE7' },
};

// null = "❓ Eksik Adım"
export const LEVELS_EASY = [
  // 1: Eksik adım (3 adım sağ)
  {
    hint: '❓ Eksik olan 2. adımı aşağıdan doğru yönle tamamla!',
    grid: ['#####', 'S..T#', '#####', '.....', '.....'],
    initialCode: ['right', null, 'right'],
  },
  // 2: Yanlış hareket (2. adım yukarı yerine sağ olmalı)
  {
    hint: '▶️ DENE tuşuna bas veya 2. adımdaki yanlış oku düzelt!',
    grid: ['#####', 'S..T#', '#####', '.....', '.....'],
    initialCode: ['right', 'up', 'right'],
  },
  // 3: L yolu - eksik dönüş adımı
  {
    hint: 'Köşeyi dönmek için 3. adımdaki ❓ boşluğunu doldur!',
    grid: ['S..##', '##.##', '##T##', '#####', '.....'],
    initialCode: ['right', 'right', null, 'down'],
  },
  // 4: L yolu - yanlış yön
  {
    hint: '3. adımda yanlış yöne dönüyor! Hangisi olmalı?',
    grid: ['.S###', '.####', '...T#', '#####', '.....'],
    initialCode: ['down', 'down', 'left', 'right'],
  },
  // 5: Zikzak - 2 eksik adım
  {
    hint: 'İki tane ❓ eksik adımı sırayla tamamla!',
    grid: ['S.###', '#..##', '##.T#', '#####', '.....'],
    initialCode: ['right', null, 'right', 'down', null],
  },
  // 6: Yanlış son adım
  {
    hint: 'Son adımda hedefe ulaşmak yerine engele gidiyor! Düzelt!',
    grid: ['#####', '#T..S', '###.#', '#####', '.....'],
    initialCode: ['left', 'left', 'down'],
  },
  // 7: Fazla adım eklenmiş (Silinmesi veya düzeltilmesi gerek)
  {
    hint: 'Yönergede 1 tane FAZLA yanlış adım var! Seçip 🗑️ Sil veya düzelt!',
    grid: ['S###.', '.###.', '...T.', '#####', '.....'],
    initialCode: ['down', 'up', 'down', 'right', 'right'],
  },
  // 8: U yolu - hem eksik hem yanlış
  {
    hint: 'Yönergeyi test et, hatalı ve eksik adımları düzelt!',
    grid: ['S#T##', '.#.##', '...##', '#####', '.....'],
    initialCode: ['down', 'down', null, 'right', 'down', 'up'],
  },
];

export const LEVELS_MASTER = [
  // 1: 6x6 - 2 yanlış hareket
  {
    hint: 'Yönergedeki yanlış yönleri bulup hedefe ulaştır!',
    grid: ['S...##', '###.##', '###.##', '###..T', '######', '......'],
    initialCode: ['right', 'right', 'up', 'down', 'down', 'left', 'right', 'right'],
  },
  // 2: 6x6 - Eksik adımlar
  {
    hint: 'Boş bırakılan ❓ adımlarını haritaya bakarak doldur!',
    grid: ['S#####', '.#####', '...###', '##.###', '##..T#', '######'],
    initialCode: ['down', null, 'right', 'right', 'down', null, 'right', 'right'],
  },
  // 3: 6x6 - Fazla hareket (Silme)
  {
    hint: 'Araya fazladan yanlış bir hareket karışmış! Onu bul ve 🗑️ Sil!',
    grid: ['#####.', '#S..#.', '###.#.', '###T#.', '#####.', '......'],
    initialCode: ['right', 'right', 'up', 'down', 'down'],
  },
  // 4: 6x6 - Eksik son adım (➕ Adım Ekle)
  {
    hint: 'Karakter hedefin 1 adım önünde kalıyor! ➕ Adım Ekle ile tamamla!',
    grid: ['..S###', '..####', '....##', '###.##', '###.T#', '######'],
    initialCode: ['down', 'down', 'right', 'right', 'down', 'down'],
  },
  // 5: 6x6 - Salyangoz rota hatası
  {
    hint: 'Salyangoz yolundaki 2 hatalı oku bulup düzelt!',
    grid: ['S....#', '####.#', '#T...#', '######', '......', '......'],
    initialCode: ['right', 'right', 'right', 'up', 'down', 'down', 'left', 'right', 'left'],
  },
  // 6: 6x6 - Karışık hata ayıklama
  {
    hint: 'Hem ❓ eksik adımı doldur hem de yanlış oku düzelt!',
    grid: ['####T#', '####.#', 'S...##', '###.##', '######', '......'],
    initialCode: ['right', null, 'right', 'down', 'up', 'up'],
  },
];

export function parseDebugLevel(levelObj) {
  const size = levelObj.grid.length;
  let start = { r: 0, c: 0 };
  let target = { r: size - 1, c: size - 1 };
  const obstacles = new Set();

  levelObj.grid.forEach((rowStr, r) => {
    for (let c = 0; c < size; c++) {
      const ch = rowStr[c];
      if (ch === 'S') start = { r, c };
      else if (ch === 'T') target = { r, c };
      else if (ch === '#') obstacles.add(`${r}-${c}`);
    }
  });

  return {
    size,
    start,
    target,
    obstacles,
    hint: levelObj.hint,
    initialCode: [...levelObj.initialCode],
  };
}

/**
 * Rastgele geçerli bir yol üretip içine kasıtlı olarak ❓ eksik adım veya ❌ yanlış yön enjekte eder.
 */
export function createRandomDebugLevel(size = 5) {
  let r = 0;
  let c = 0;
  const start = { r, c };
  const pathCells = new Set([`${r}-${c}`]);
  const trueSteps = [];

  const totalSteps = size === 5 ? 5 : 7;
  for (let i = 0; i < totalSteps; i++) {
    const canRight = c + 1 < size;
    const canDown = r + 1 < size;
    if (!canRight && !canDown) break;
    const goRight = canRight && (!canDown || Math.random() < 0.5);
    if (goRight) {
      c += 1;
      trueSteps.push('right');
    } else {
      r += 1;
      trueSteps.push('down');
    }
    pathCells.add(`${r}-${c}`);
  }

  const target = { r, c };
  const obstacles = new Set();
  for (let rr = 0; rr < size; rr++) {
    for (let cc = 0; cc < size; cc++) {
      const k = `${rr}-${cc}`;
      if (!pathCells.has(k) && Math.random() < 0.45) obstacles.add(k);
    }
  }

  const buggyCode = [...trueSteps];
  const bugIdx = Math.floor(Math.random() * buggyCode.length);
  const bugType = Math.random() < 0.5 ? 'missing' : 'wrong';

  if (bugType === 'missing') {
    buggyCode[bugIdx] = null;
  } else {
    const allDirs = ['up', 'down', 'left', 'right'].filter((d) => d !== buggyCode[bugIdx]);
    buggyCode[bugIdx] = allDirs[Math.floor(Math.random() * allDirs.length)];
  }

  return {
    size,
    start,
    target,
    obstacles,
    initialCode: buggyCode,
    hint:
      bugType === 'missing'
        ? `🎲 Sürpriz Görev: ${bugIdx + 1}. adımdaki ❓ eksik yönü bul!`
        : '🎲 Sürpriz Görev: Yönergeyi dene ve hatalı yönü düzelt!',
  };
}
