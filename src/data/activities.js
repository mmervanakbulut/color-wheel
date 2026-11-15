import LegoColorsActivity from '../activities/lego-colors/LegoColorsActivity';
import EmotionDiceActivity from '../activities/emotion-dice/EmotionDiceActivity';
import RouteGameActivity from '../activities/route-game/RouteGameActivity';
import TrainPatternActivity from '../activities/train-pattern/TrainPatternActivity';

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
  {
    id: 'route-game',
    title: 'Rota ve Algoritma',
    subtitle: '8×8 & 5×5 Harita • Tek Adım • Algoritma',
    icon: '🧭',
    accentBg: 'from-emerald-400 via-sky-500 to-blue-600',
    cardBg: 'bg-gradient-to-br from-emerald-50 via-white to-sky-50',
    borderColor: 'border-emerald-300 hover:border-sky-500',
    component: RouteGameActivity,
  },
  {
    id: 'train-pattern',
    title: 'Tren Vagonu Örüntü',
    subtitle: 'Kolay & Usta • Şekil, Meyve, Hayvan',
    icon: '🚂',
    accentBg: 'from-rose-400 via-amber-400 to-emerald-500',
    cardBg: 'bg-gradient-to-br from-rose-50 via-white to-amber-50',
    borderColor: 'border-rose-300 hover:border-amber-500',
    component: TrainPatternActivity,
  },
];
