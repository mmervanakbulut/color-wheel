/**
 * @file src/activities/if-then-coding/config.js
 * @description "Eğer - İse" Koşul Oyunu için 2 dallı (Kolay) ve 3 dallı (Usta) algoritma kuralları.
 */

export const EASY_RULES = [
  {
    id: 'weather2',
    title: 'Hava Durumu Robotu',
    icon: '🌦️',
    branches: [
      { id: 'rain', condIcon: '🌧️', condLabel: 'Yağmurlu İse', actionIcon: '☂️', actionLabel: 'Şemsiye Aç', color: '#0284C7', bg: '#E0F2FE' },
      { id: 'sun', condIcon: '☀️', condLabel: 'Güneşli İse', actionIcon: '🕶️', actionLabel: 'Gözlük Tak', color: '#D97706', bg: '#FEF3C7' },
    ],
    items: [
      { emoji: '🌧️', label: 'Yağmur Yağıyor', targetBranch: 'rain' },
      { emoji: '☀️', label: 'Güneş Parlıyor', targetBranch: 'sun' },
      { emoji: '⛈️', label: 'Sağanak Yağmur', targetBranch: 'rain' },
      { emoji: '🏖️', label: 'Sıcak Plaj Günü', targetBranch: 'sun' },
      { emoji: '💧', label: 'Yağmur Damlaları', targetBranch: 'rain' },
      { emoji: '🌞', label: 'Parlak Güneş', targetBranch: 'sun' },
    ],
  },
  {
    id: 'habitat2',
    title: 'Hayvan Yuvası Kuralı',
    icon: '🐾',
    branches: [
      { id: 'sea', condIcon: '🌊', condLabel: 'Yüzüyorsa', actionIcon: '🌊', actionLabel: 'Denize Gönder', color: '#0284C7', bg: '#E0F2FE' },
      { id: 'sky', condIcon: '🪽', condLabel: 'Uçuyorsa', actionIcon: '☁️', actionLabel: 'Gökyüzüne Gönder', color: '#7C3AED', bg: '#EDE9FE' },
    ],
    items: [
      { emoji: '🐟', label: 'Balık', targetBranch: 'sea' },
      { emoji: '🦅', label: 'Kartal', targetBranch: 'sky' },
      { emoji: '🐬', label: 'Yunus', targetBranch: 'sea' },
      { emoji: '🦋', label: 'Kelebek', targetBranch: 'sky' },
      { emoji: '🐙', label: 'Ahtapot', targetBranch: 'sea' },
      { emoji: '🐝', label: 'Arı', targetBranch: 'sky' },
    ],
  },
  {
    id: 'color2',
    title: 'Renk Ayırma Robotu',
    icon: '🤖',
    branches: [
      { id: 'red', condIcon: '🔴', condLabel: 'Kırmızı İse', actionIcon: '🧺', actionLabel: 'Kırmızı Sepet', color: '#DC2626', bg: '#FEE2E2' },
      { id: 'other', condIcon: '🟢', condLabel: 'Kırmızı Değilse', actionIcon: '📦', actionLabel: 'Yeşil Kutu', color: '#16A34A', bg: '#DCFCE7' },
    ],
    items: [
      { emoji: '🍎', label: 'Kırmızı Elma', targetBranch: 'red' },
      { emoji: '🍌', label: 'Sarı Muz', targetBranch: 'other' },
      { emoji: '🍓', label: 'Çilek', targetBranch: 'red' },
      { emoji: '🍐', label: 'Yeşil Armut', targetBranch: 'other' },
      { emoji: '🍅', label: 'Domates', targetBranch: 'red' },
      { emoji: '🍇', label: 'Mor Üzüm', targetBranch: 'other' },
    ],
  },
  {
    id: 'daynight2',
    title: 'Gece ve Gündüz Kuralı',
    icon: '🌙',
    branches: [
      { id: 'night', condIcon: '🌙', condLabel: 'Gece İse', actionIcon: '🛌', actionLabel: 'Uykuya Yat', color: '#4F46E5', bg: '#E0E7FF' },
      { id: 'day', condIcon: '☀️', condLabel: 'Gündüz İse', actionIcon: '🛝', actionLabel: 'Oyun Oyna', color: '#EA580C', bg: '#FFEDD5' },
    ],
    items: [
      { emoji: '🌙', label: 'Ay Çıktı', targetBranch: 'night' },
      { emoji: '☀️', label: 'Sabah Oldu', targetBranch: 'day' },
      { emoji: '⭐', label: 'Yıldızlı Gece', targetBranch: 'night' },
      { emoji: '🌈', label: 'Aydınlık Gün', targetBranch: 'day' },
      { emoji: '🦉', label: 'Gece Baykuşu', targetBranch: 'night' },
      { emoji: '🌻', label: 'Günebakan Çiçeği', targetBranch: 'day' },
    ],
  },
];

export const MASTER_RULES = [
  {
    id: 'traffic3',
    title: 'Trafik Lambası Kuralı',
    icon: '🚦',
    branches: [
      { id: 'stop', condIcon: '🔴', condLabel: 'Kırmızı Işık', actionIcon: '🛑', actionLabel: 'Dur!', color: '#DC2626', bg: '#FEE2E2' },
      { id: 'ready', condIcon: '🟡', condLabel: 'Sarı Işık', actionIcon: '⚠️', actionLabel: 'Hazırlan!', color: '#D97706', bg: '#FEF3C7' },
      { id: 'go', condIcon: '🟢', condLabel: 'Yeşil Işık', actionIcon: '🚗', actionLabel: 'Geç!', color: '#16A34A', bg: '#DCFCE7' },
    ],
    items: [
      { emoji: '🔴', label: 'Kırmızı Yandı', targetBranch: 'stop' },
      { emoji: '🟢', label: 'Yeşil Yandı', targetBranch: 'go' },
      { emoji: '🟡', label: 'Sarı Yandı', targetBranch: 'ready' },
    ],
  },
  {
    id: 'vehicles3',
    title: 'Taşıt Yolu Kodlaması',
    icon: '🚀',
    branches: [
      { id: 'air', condIcon: '☁️', condLabel: 'Uçan Taşıtsa', actionIcon: '✈️', actionLabel: 'Hava Yolu', color: '#0284C7', bg: '#E0F2FE' },
      { id: 'road', condIcon: '🛣️', condLabel: 'Kara Taşıtıysa', actionIcon: '🚗', actionLabel: 'Kara Yolu', color: '#475569', bg: '#F1F5F9' },
      { id: 'water', condIcon: '🌊', condLabel: 'Su Taşıtıysa', actionIcon: '⛵', actionLabel: 'Deniz Yolu', color: '#0D9488', bg: '#CCFBF1' },
    ],
    items: [
      { emoji: '✈️', label: 'Uçak', targetBranch: 'air' },
      { emoji: '🚌', label: 'Okul Otobüsü', targetBranch: 'road' },
      { emoji: '🚢', label: 'Büyük Gemi', targetBranch: 'water' },
      { emoji: '🚁', label: 'Helikopter', targetBranch: 'air' },
      { emoji: '🚲', label: 'Bisiklet', targetBranch: 'road' },
      { emoji: '⛵', label: 'Yelkenli', targetBranch: 'water' },
    ],
  },
  {
    id: 'numbers3',
    title: 'Sayı Karşılaştırma Robotu',
    icon: '🔢',
    branches: [
      { id: 'low', condIcon: '1️⃣-4️⃣', condLabel: "5'ten Küçükse", actionIcon: '🟦', actionLabel: 'Küçük Kutu', color: '#2563EB', bg: '#DBEAFE' },
      { id: 'mid', condIcon: '5️⃣', condLabel: 'Tam 5 İse', actionIcon: '⭐', actionLabel: 'Yıldız Kutu', color: '#D97706', bg: '#FEF3C7' },
      { id: 'high', condIcon: '6️⃣-9️⃣', condLabel: "5'ten Büyükse", actionIcon: '🟧', actionLabel: 'Büyük Kutu', color: '#EA580C', bg: '#FFEDD5' },
    ],
    items: [
      { emoji: '2️⃣', label: 'Sayı: 2', targetBranch: 'low' },
      { emoji: '5️⃣', label: 'Sayı: 5', targetBranch: 'mid' },
      { emoji: '8️⃣', label: 'Sayı: 8', targetBranch: 'high' },
      { emoji: '3️⃣', label: 'Sayı: 3', targetBranch: 'low' },
      { emoji: '7️⃣', label: 'Sayı: 7', targetBranch: 'high' },
      { emoji: '1️⃣', label: 'Sayı: 1', targetBranch: 'low' },
    ],
  },
];

export function buildQuestionDeck(rule, count = 5) {
  const result = [];
  let prevEmoji = null;
  for (let i = 0; i < count; i++) {
    const pool = rule.items.filter((it) => it.emoji !== prevEmoji);
    const pick = pool[Math.floor(Math.random() * pool.length)] || rule.items[0];
    prevEmoji = pick.emoji;
    result.push(pick);
  }
  return result;
}
