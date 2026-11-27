import { lazy } from 'react';

const LegoColorsActivity = lazy(() => import('../activities/lego-colors/LegoColorsActivity'));
const EmotionDiceActivity = lazy(() => import('../activities/emotion-dice/EmotionDiceActivity'));
const RouteGameActivity = lazy(() => import('../activities/route-game/RouteGameActivity'));
const TrainPatternActivity = lazy(() => import('../activities/train-pattern/TrainPatternActivity'));
const DirectionsWorldActivity = lazy(() => import('../activities/directions-world/DirectionsWorldActivity'));
const PixelCodingActivity = lazy(() => import('../activities/pixel-coding/PixelCodingActivity'));
const StepSequenceActivity = lazy(() => import('../activities/step-sequence/StepSequenceActivity'));
const SymbolCipherActivity = lazy(() => import('../activities/symbol-cipher/SymbolCipherActivity'));
const IfThenCodingActivity = lazy(() => import('../activities/if-then-coding/IfThenCodingActivity'));
const LoopCodingActivity = lazy(() => import('../activities/loop-coding/LoopCodingActivity'));
const DebugCodingActivity = lazy(() => import('../activities/debug-coding/DebugCodingActivity'));

/**
 * Tüm etkileşimli uygulamaların merkezi listesi (GridView).
 * React.lazy ile her etkinlik yalnızca açıldığında belleğe yüklenir.
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
    subtitle: '5×5 & 8×8 Harita • 💎 Elmas Toplama • Rota Kodlama',
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
  {
    id: 'directions-world',
    title: 'Yönler Dünyası',
    subtitle: 'Sağ • Sol • Yukarı • Aşağı • Çark',
    icon: '🚀',
    accentBg: 'from-sky-400 via-indigo-500 to-violet-500',
    cardBg: 'bg-gradient-to-br from-sky-50 via-white to-violet-50',
    borderColor: 'border-sky-300 hover:border-violet-500',
    component: DirectionsWorldActivity,
  },
  {
    id: 'pixel-coding',
    title: 'Piksel Kodlama',
    subtitle: 'Desen Kopyala • Kodla Boya • 4×4 & 5×5',
    icon: '🎨',
    accentBg: 'from-pink-500 via-amber-400 to-cyan-500',
    cardBg: 'bg-gradient-to-br from-pink-50 via-white to-cyan-50',
    borderColor: 'border-pink-300 hover:border-cyan-500',
    component: PixelCodingActivity,
  },
  {
    id: 'step-sequence',
    title: 'İşlem Sıralama',
    subtitle: 'Önce Hangisi? • 3 ve 4 Adımlı Algoritma',
    icon: '📋',
    accentBg: 'from-amber-400 via-orange-500 to-emerald-500',
    cardBg: 'bg-gradient-to-br from-amber-50 via-white to-emerald-50',
    borderColor: 'border-amber-300 hover:border-orange-500',
    component: StepSequenceActivity,
  },
  {
    id: 'symbol-cipher',
    title: 'Sembol Şifre Çözücü',
    subtitle: 'Anahtara Bak • Şifreyi Çöz • 3 & 4 Haneli',
    icon: '🔓',
    accentBg: 'from-indigo-500 via-purple-500 to-pink-500',
    cardBg: 'bg-gradient-to-br from-indigo-50 via-white to-pink-50',
    borderColor: 'border-indigo-300 hover:border-purple-500',
    component: SymbolCipherActivity,
  },
  {
    id: 'if-then-coding',
    title: 'Eğer – İse Koşul Oyunu',
    subtitle: 'Kuralı Oku • Karar Ver • 2 ve 3 Koşullu',
    icon: '🚦',
    accentBg: 'from-teal-400 via-sky-500 to-violet-500',
    cardBg: 'bg-gradient-to-br from-teal-50 via-white to-sky-50',
    borderColor: 'border-teal-300 hover:border-sky-500',
    component: IfThenCodingActivity,
  },
  {
    id: 'loop-coding',
    title: 'Döngü Atölyesi',
    subtitle: '5×5 & 6×6 Harita • Döngü Blokları (3× ➡️) • Grup Döngüsü',
    icon: '🔁',
    accentBg: 'from-violet-500 via-indigo-500 to-amber-400',
    cardBg: 'bg-gradient-to-br from-violet-50 via-white to-amber-50',
    borderColor: 'border-violet-300 hover:border-indigo-500',
    component: LoopCodingActivity,
  },
  {
    id: 'debug-coding',
    title: 'Hata Ayıklama',
    subtitle: 'Bozuk Kodu Bul • Eksik veya Yanlış Adımı Düzelt',
    icon: '🐞',
    accentBg: 'from-rose-500 via-amber-500 to-emerald-500',
    cardBg: 'bg-gradient-to-br from-rose-50 via-white to-emerald-50',
    borderColor: 'border-rose-300 hover:border-emerald-500',
    component: DebugCodingActivity,
  },
];
