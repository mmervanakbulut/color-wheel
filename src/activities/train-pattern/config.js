/**
 * @file src/activities/train-pattern/config.js
 * @description Tren Vagonu Örüntü Oyunu vagon temaları, Kolay/Usta şablonları ve sürpriz örüntü üreticisi.
 */

export const CARGO_THEMES = [
  {
    id: 'shapes',
    name: 'Renkli Şekiller',
    icon: '🔴',
    items: {
      A: { id: 'A', icon: '🔴', label: 'Kırmızı Daire', bg: '#ffe4e6', border: '#f43f5e' },
      B: { id: 'B', icon: '🟦', label: 'Mavi Kare', bg: '#e0f2fe', border: '#0ea5e9' },
      C: { id: 'C', icon: '⭐', label: 'Sarı Yıldız', bg: '#fef3c7', border: '#f59e0b' },
      D: { id: 'D', icon: '🟢', label: 'Yeşil Top', bg: '#d1fae5', border: '#10b981' },
    },
  },
  {
    id: 'fruits',
    name: 'Neşeli Meyveler',
    icon: '🍎',
    items: {
      A: { id: 'A', icon: '🍎', label: 'Elma', bg: '#ffe4e6', border: '#f43f5e' },
      B: { id: 'B', icon: '🍌', label: 'Muz', bg: '#fef3c7', border: '#f59e0b' },
      C: { id: 'C', icon: '🍇', label: 'Üzüm', bg: '#ede9fe', border: '#8b5cf6' },
      D: { id: 'D', icon: '🍐', label: 'Armut', bg: '#d1fae5', border: '#10b981' },
    },
  },
  {
    id: 'animals',
    name: 'Sevimli Hayvanlar',
    icon: '🐶',
    items: {
      A: { id: 'A', icon: '🐶', label: 'Köpek', bg: '#fef3c7', border: '#f59e0b' },
      B: { id: 'B', icon: '🐱', label: 'Kedi', bg: '#ffe4e6', border: '#f43f5e' },
      C: { id: 'C', icon: '🐸', label: 'Kurbağa', bg: '#d1fae5', border: '#10b981' },
      D: { id: 'D', icon: '🐰', label: 'Tavşan', bg: '#e0f2fe', border: '#0ea5e9' },
    },
  },
  {
    id: 'space',
    name: 'Uzay Treni',
    icon: '🚀',
    items: {
      A: { id: 'A', icon: '🚀', label: 'Roket', bg: '#ffe4e6', border: '#f43f5e' },
      B: { id: 'B', icon: '🪐', label: 'Gezegen', bg: '#ede9fe', border: '#8b5cf6' },
      C: { id: 'C', icon: '🌟', label: 'Yıldız', bg: '#fef3c7', border: '#f59e0b' },
      D: { id: 'D', icon: '🛸', label: 'Uçan Daire', bg: '#d1fae5', border: '#10b981' },
    },
  },
];

export const EASY_PATTERNS = [
  { title: 'Örüntü 1', ruleText: 'Bir O, Bir Bu (AB-AB)', sequence: ['A', 'B', 'A', 'B', 'A'], missing: [4], choices: ['A', 'B', 'C'] },
  { title: 'Örüntü 2', ruleText: 'Sırayla Devam Et (AB-AB)', sequence: ['A', 'B', 'A', 'B', 'A', 'B'], missing: [5], choices: ['A', 'B', 'C'] },
  { title: 'Örüntü 3', ruleText: 'İkişer İkişer (AA-BB)', sequence: ['A', 'A', 'B', 'B', 'A', 'A'], missing: [5], choices: ['A', 'B', 'C'] },
  { title: 'Örüntü 4', ruleText: 'Ortadaki Vagonu Bul!', sequence: ['B', 'A', 'B', 'A', 'B'], missing: [2], choices: ['A', 'B', 'C'] },
  { title: 'Örüntü 5', ruleText: 'Bir Başta İki Sonda (ABB)', sequence: ['A', 'B', 'B', 'A', 'B', 'B'], missing: [5], choices: ['A', 'B', 'C'] },
  { title: 'Örüntü 6', ruleText: 'İki Başta Bir Sonda (AAB)', sequence: ['A', 'A', 'B', 'A', 'A', 'B'], missing: [5], choices: ['A', 'B', 'C'] },
];

export const ADVANCED_PATTERNS = [
  { title: 'Örüntü 1', ruleText: 'Üçlü Sıralama (ABC-ABC)', sequence: ['A', 'B', 'C', 'A', 'B', 'C'], missing: [5], choices: ['A', 'B', 'C', 'D'] },
  { title: 'Örüntü 2', ruleText: 'İki Boş Vagonu Tamamla! (AB-AB)', sequence: ['A', 'B', 'A', 'B', 'A', 'B'], missing: [4, 5], choices: ['A', 'B', 'C', 'D'] },
  { title: 'Örüntü 3', ruleText: 'Çift Tekrar (AA-BB-AA)', sequence: ['A', 'A', 'B', 'B', 'A', 'A'], missing: [4, 5], choices: ['A', 'B', 'C', 'D'] },
  { title: 'Örüntü 4', ruleText: 'Üçlü Dizilim (ABC-ABC)', sequence: ['A', 'B', 'C', 'A', 'B', 'C'], missing: [4, 5], choices: ['A', 'B', 'C', 'D'] },
  { title: 'Örüntü 5', ruleText: 'Aradaki Eksikleri Bul! (AAB)', sequence: ['A', 'A', 'B', 'A', 'A', 'B'], missing: [2, 5], choices: ['A', 'B', 'C', 'D'] },
  { title: 'Örüntü 6', ruleText: 'Usta Makinist (ABCD)', sequence: ['A', 'B', 'C', 'D', 'A', 'B'], missing: [4, 5], choices: ['A', 'B', 'C', 'D'] },
];

export function createRandomPattern(difficulty) {
  const keys = difficulty === 'advanced' ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C'];
  const [k1, k2, k3] = [...keys].sort(() => Math.random() - 0.5);

  const pool =
    difficulty === 'advanced'
      ? [
          { ruleText: 'Sürpriz Üçlü Örüntü', sequence: [k1, k2, k3, k1, k2, k3], missing: [4, 5] },
          { ruleText: 'Sürpriz İkişerli Örüntü', sequence: [k1, k1, k2, k2, k1, k1], missing: [4, 5] },
          { ruleText: 'Sürpriz Adım Örüntüsü', sequence: [k1, k2, k2, k1, k2, k2], missing: [3, 5] },
        ]
      : [
          { ruleText: 'Sürpriz Sıralı Vagonlar', sequence: [k1, k2, k1, k2, k1, k2], missing: [5] },
          { ruleText: 'Sürpriz İkili Vagonlar', sequence: [k1, k1, k2, k1, k1, k2], missing: [5] },
          { ruleText: 'Sürpriz Ortadaki Vagon', sequence: [k1, k2, k1, k2, k1], missing: [2] },
        ];

  const picked = pool[Math.floor(Math.random() * pool.length)];
  return {
    title: 'Sürpriz Tren',
    ruleText: picked.ruleText,
    sequence: picked.sequence,
    missing: picked.missing,
    choices: keys,
  };
}
