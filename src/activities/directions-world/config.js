/**
 * @file src/activities/directions-world/config.js
 * @description Yönler Dünyası etkinliği için 4 yön sabitleri, temalar ve soru üreticileri.
 */

export const DIRECTIONS = [
  {
    id: 'up',
    label: 'YUKARI',
    shortLabel: 'Yukarı',
    relationLabel: 'Üstünde',
    arrow: '⬆️',
    actionTitle: 'Eller Yukarı & Zıpla!',
    actionEmoji: '🙌',
    color: '#0284C7',
    border: '#0369A1',
    bgLight: '#E0F2FE',
    textDark: '#0C4A6E',
  },
  {
    id: 'right',
    label: 'SAĞ',
    shortLabel: 'Sağ',
    relationLabel: 'Sağında',
    arrow: '➡️',
    actionTitle: 'Sağ Elini Kaldır / Sağa Adım!',
    actionEmoji: '👉',
    color: '#16A34A',
    border: '#15803D',
    bgLight: '#DCFCE7',
    textDark: '#14532D',
  },
  {
    id: 'down',
    label: 'AŞAĞI',
    shortLabel: 'Aşağı',
    relationLabel: 'Altında',
    arrow: '⬇️',
    actionTitle: 'Aşağı Çömel & Eğil!',
    actionEmoji: '👇',
    color: '#8B5CF6',
    border: '#6D28D9',
    bgLight: '#EDE9FE',
    textDark: '#4C1D95',
  },
  {
    id: 'left',
    label: 'SOL',
    shortLabel: 'Sol',
    relationLabel: 'Solunda',
    arrow: '⬅️',
    actionTitle: 'Sol Elini Kaldır / Sola Adım!',
    actionEmoji: '👈',
    color: '#F97316',
    border: '#C2410C',
    bgLight: '#FFEDD5',
    textDark: '#7C2D12',
  },
];

export const DIRECTION_MAP = Object.fromEntries(DIRECTIONS.map((d) => [d.id, d]));

export const SPRITE_TYPES = [
  { id: 'rocket', name: 'Roket' },
  { id: 'fish', name: 'Balık' },
  { id: 'plane', name: 'Uçak' },
  { id: 'ladybug', name: 'Uğur Böceği' },
  { id: 'arrow', name: 'Dev Ok' },
];

export const ANCHOR_PAIRS = [
  { anchor: '🌳', anchorName: 'Ağacın', guest: '🐱', guestName: 'Kedi' },
  { anchor: '🏠', anchorName: 'Evin', guest: '🐶', guestName: 'Köpek' },
  { anchor: '🎪', anchorName: 'Çadırın', guest: '🎈', guestName: 'Balon' },
  { anchor: '⛵', anchorName: 'Teknenin', guest: '🐬', guestName: 'Yunus' },
  { anchor: '🌻', anchorName: 'Çiçeğin', guest: '🐝', guestName: 'Arı' },
];

// 8 dilimli çark (her 4 yön ikişer kez dengeli dağılır)
export const WHEEL_SLICES = [
  DIRECTION_MAP.up,
  DIRECTION_MAP.right,
  DIRECTION_MAP.down,
  DIRECTION_MAP.left,
  DIRECTION_MAP.up,
  DIRECTION_MAP.right,
  DIRECTION_MAP.down,
  DIRECTION_MAP.left,
];

function pickRandom(items, excludeValue = null) {
  const pool = items.filter((item) => item !== excludeValue);
  const source = pool.length > 0 ? pool : items;
  return source[Math.floor(Math.random() * source.length)];
}

export function getAllowedDirections(scope) {
  if (scope === 'lr') return ['right', 'left'];
  if (scope === 'ud') return ['up', 'down'];
  return ['right', 'left', 'up', 'down'];
}

export function createLookQuestion(scope = 'all', prevDir = null) {
  const allowed = getAllowedDirections(scope);
  return {
    direction: pickRandom(allowed, prevDir),
    sprite: pickRandom(SPRITE_TYPES.map((s) => s.id)),
  };
}

export function createOddQuestion(scope = 'all', prevOddIndex = -1) {
  const allowed = getAllowedDirections(scope);
  const majorityDir = pickRandom(allowed);
  const oddDir = pickRandom(allowed, majorityDir);
  const indices = [0, 1, 2, 3];
  const oddIndex = pickRandom(indices, prevOddIndex);
  const sprite = pickRandom(SPRITE_TYPES.map((s) => s.id));

  const cards = indices.map((i) => ({
    index: i,
    direction: i === oddIndex ? oddDir : majorityDir,
    isOdd: i === oddIndex,
  }));

  return { sprite, oddDir, majorityDir, oddIndex, cards };
}

export function createWhereQuestion(scope = 'all', prevDir = null) {
  const allowed = getAllowedDirections(scope);
  const pair = ANCHOR_PAIRS[Math.floor(Math.random() * ANCHOR_PAIRS.length)];
  return {
    direction: pickRandom(allowed, prevDir),
    ...pair,
  };
}
