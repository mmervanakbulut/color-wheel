// Ortak UI Yardımcıları (DRY: Tam Ekran ve Konfeti Kutlaması)

import { playClick } from './sound';

export function toggleFullscreen() {
  playClick();
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}

export function launchDomConfetti(
  palette = ['#EF4444', '#2563EB', '#22C55E', '#F97316', '#8B5CF6', '#FACC15']
) {
  const container = document.getElementById('confetti-layer');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < 45; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = palette[i % palette.length] || '#FFD600';
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
    container.appendChild(piece);
  }

  setTimeout(() => {
    if (container) container.innerHTML = '';
  }, 3500);
}

