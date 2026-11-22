/**
 * @file src/activities/step-sequence/config.js
 * @description İşlem Sıralama hikayeleri, karıştırıcı ve 4 farklı algoritmik sürpriz üretici.
 */

import { EASY_SEQUENCES, MASTER_SEQUENCES } from './stories';

export { EASY_SEQUENCES, MASTER_SEQUENCES };

export function shuffleSteps(steps) {
  const copy = [...steps];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  if (copy.every((item, idx) => item.step === idx + 1) && copy.length > 1) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

let surpriseKind = 0;

export function createSurpriseSequence(stepCount = 3) {
  surpriseKind = (surpriseKind + 1) % 4;

  // 1: Azdan Çoğa Nesne Sayma
  if (surpriseKind === 0) {
    const emojis = ['⭐', '🍎', '🎈', '🐟', '🌸'];
    const sym = emojis[Math.floor(Math.random() * emojis.length)];
    return {
      id: `seq-count-${Date.now()}`,
      title: 'Azdan Çoğa Sırala',
      icon: sym,
      steps: Array.from({ length: stepCount }, (_, i) => ({
        step: i + 1,
        emoji: sym.repeat(i + 1),
        label: `${i + 1} Tane`,
      })),
    };
  }

  // 2: Matematik İşlem Zinciri (+1 veya +2 Artarak İlerleme)
  if (surpriseKind === 1) {
    const start = 1 + Math.floor(Math.random() * 3);
    const delta = Math.random() < 0.5 ? 1 : 2;
    return {
      id: `seq-math-${Date.now()}`,
      title: `+${delta} Artan Sayı Zinciri`,
      icon: '🔢',
      steps: Array.from({ length: stepCount }, (_, i) => {
        const val = start + i * delta;
        return {
          step: i + 1,
          emoji: `${val}`,
          label: i === 0 ? `Başlangıç: ${val}` : `+${delta} Ekle ➔ ${val}`,
        };
      }),
    };
  }

  // 3: Kule Kat Çıkma İşlemi
  if (surpriseKind === 2) {
    return {
      id: `seq-tower-${Date.now()}`,
      title: 'Lego Kule İnşası',
      icon: '🧱',
      steps: Array.from({ length: stepCount }, (_, i) => ({
        step: i + 1,
        emoji: '🧱'.repeat(i + 1),
        label: `${i + 1}. Katı Koy`,
      })),
    };
  }

  // 4: Ay Evreleri
  const phases4 = [
    { step: 1, emoji: '🌑', label: 'Yeni Ay' },
    { step: 2, emoji: '🌒', label: 'Hilal' },
    { step: 3, emoji: '🌓', label: 'İlk Dördün' },
    { step: 4, emoji: '🌕', label: 'Dolunay' },
  ];
  return {
    id: `seq-moon-${Date.now()}`,
    title: 'Ayın Büyüme Evreleri',
    icon: '🌕',
    steps: stepCount === 3 ? phases4.slice(0, 3).map((p, i) => ({ ...p, step: i + 1 })) : phases4,
  };
}
