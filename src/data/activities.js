import LegoColorsActivity from '../activities/lego-colors/LegoColorsActivity';
import EmotionDiceActivity from '../activities/emotion-dice/EmotionDiceActivity';

/**
 * Tüm etkileşimli uygulamaların merkezi listesi (GridView).
 * Yeni bir etkinlik eklendiğinde sadece bu diziye yeni bir nesne eklenir.
 */
export const ACTIVITIES = [
  {
    id: 'lego-colors',
    title: 'Lego Renkleri',
    subtitle: 'Parmak Lego • Kule • Eşleştirme',
    icon: '🧱',
    accentBg: 'from-amber-400 via-rose-500 to-blue-600',
    cardBg: 'bg-gradient-to-br from-amber-50 via-white to-blue-50',
    borderColor: 'border-amber-300 hover:border-blue-500',
    component: LegoColorsActivity,
  },
  {
    id: 'emotion-dice',
    title: 'Duygu Zarı & Çarkı',
    subtitle: '3D Zar • Çark • İfade Taklidi',
    icon: '😄',
    accentBg: 'from-purple-500 via-pink-500 to-amber-400',
    cardBg: 'bg-gradient-to-br from-purple-50 via-white to-amber-50',
    borderColor: 'border-purple-300 hover:border-pink-500',
    component: EmotionDiceActivity,
  },
];
