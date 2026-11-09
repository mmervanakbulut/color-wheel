/**
 * @file src/activities/emotion-dice/config.js
 * @description Duygu Zarı & Çarkı etkinliği için sabit duygu verileri ve görsel yardımcıları.
 */

export const EMOTIONS = [
  {
    id: 'mutlu',
    title: 'Mutlu',
    emoji: '😄',
    color: '#EF4444',
    border: '#B91C1C',
    boyImg: './assets/emotions/e-mutlu.jpg',
    girlImg: './assets/emotions/k-mutlu.jpg',
    rx: 0,
    ry: 0,
  },
  {
    id: 'uzgun',
    title: 'Üzgün',
    emoji: '😢',
    color: '#2563EB',
    border: '#1D4ED8',
    boyImg: './assets/emotions/e-uzgun.jpg',
    girlImg: './assets/emotions/k-uzgun.jpg',
    rx: 0,
    ry: -180,
  },
  {
    id: 'sinirli',
    title: 'Sinirli',
    emoji: '😠',
    color: '#22C55E',
    border: '#15803D',
    boyImg: './assets/emotions/e-sinirli.jpg',
    girlImg: './assets/emotions/k-sinirli.jpg',
    rx: 0,
    ry: -90,
  },
  {
    id: 'sasirma',
    title: 'Şaşırmış',
    emoji: '😲',
    color: '#F97316',
    border: '#C2410C',
    boyImg: './assets/emotions/e-sasirma.jpg',
    girlImg: './assets/emotions/k-sasirma.jpg',
    rx: 0,
    ry: 90,
  },
  {
    id: 'endiseli',
    title: 'Endişeli',
    emoji: '😟',
    color: '#8B5CF6',
    border: '#6D28D9',
    boyImg: './assets/emotions/e-endiseli.jpg',
    girlImg: './assets/emotions/k-endiseli.jpg',
    rx: -90,
    ry: 0,
  },
  {
    id: 'basardim',
    title: 'Bu İş Oldu!',
    emoji: '😎',
    color: '#FACC15',
    border: '#CA8A04',
    boyImg: './assets/emotions/e-basardim.jpg',
    girlImg: './assets/emotions/k-basardim.jpg',
    rx: 90,
    ry: 0,
  },
];

export function getImgForCharacter(emotion, character) {
  return character === 'girl' ? emotion.girlImg : emotion.boyImg;
}

