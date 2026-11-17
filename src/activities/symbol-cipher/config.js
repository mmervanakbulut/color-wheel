/**
 * @file src/activities/symbol-cipher/config.js
 * @description Sembol Şifre Çözücü etkinliği için sembol anahtarları, temalar ve şifre üreticisi.
 */

export const CODE_SYMBOLS = ['▲', '●', '■', '◆'];

export const CIPHER_THEMES = [
  {
    id: 'fruits',
    name: 'Meyveler',
    icon: '🍎',
    items: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉'],
  },
  {
    id: 'animals',
    name: 'Hayvanlar',
    icon: '🐱',
    items: ['🐱', '🐶', '🐰', '🐼', '🐸', '🦁'],
  },
  {
    id: 'space',
    name: 'Uzay',
    icon: '🚀',
    items: ['🚀', '🪐', '⭐', '🛸', '🌙', '☄️'],
  },
  {
    id: 'shapes',
    name: 'Renkler',
    icon: '🔴',
    items: ['🔴', '🟦', '🟡', '🟩', '🟣', '🟧'],
  },
];

export const SYMBOL_COLORS = {
  '▲': { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
  '●': { bg: '#E0F2FE', border: '#0284C7', text: '#075985' },
  '■': { bg: '#FEF3C7', border: '#D97706', text: '#92400E' },
  '◆': { bg: '#EDE9FE', border: '#7C3AED', text: '#5B21B6' },
};

export function createCipherPuzzle(difficulty = 'easy', themeId = 'fruits') {
  const theme = CIPHER_THEMES.find((t) => t.id === themeId) || CIPHER_THEMES[0];
  const keySize = difficulty === 'easy' ? 3 : 4;
  const codeLength = difficulty === 'easy' ? 3 : 4;

  const activeSymbols = CODE_SYMBOLS.slice(0, keySize);
  const shuffledItems = [...theme.items].sort(() => Math.random() - 0.5).slice(0, keySize);

  // Sembol -> Hedef İkon eşleşme tablosu
  const keyPairs = activeSymbols.map((sym, idx) => ({
    symbol: sym,
    item: shuffledItems[idx],
  }));

  const mapBySymbol = Object.fromEntries(keyPairs.map((k) => [k.symbol, k.item]));

  // Şifreli dizi üret (her sembolden en az 1 geçsin veya dengeli dağılsın)
  const sequenceSymbols = Array.from({ length: codeLength }, (_, idx) => {
    if (idx < activeSymbols.length && Math.random() < 0.75) {
      return activeSymbols[idx];
    }
    return activeSymbols[Math.floor(Math.random() * activeSymbols.length)];
  }).sort(() => Math.random() - 0.5);

  const slots = sequenceSymbols.map((sym, i) => ({
    index: i,
    symbol: sym,
    expectedItem: mapBySymbol[sym],
  }));

  // Alt seçenekleri karıştır
  const choices = [...shuffledItems].sort(() => Math.random() - 0.5);

  return {
    id: `cipher-${Date.now()}-${Math.random()}`,
    keyPairs,
    slots,
    choices,
  };
}
