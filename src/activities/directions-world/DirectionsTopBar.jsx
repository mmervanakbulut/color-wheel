import React from 'react';
import { playClick, toggleSoundEnabled } from '../../utils/sound';
import { toggleFullscreen } from '../../utils/ui';

export const DIRECTION_MODES = [
  { id: 'look', label: '👀 Yöne Bak' },
  { id: 'odd', label: '🔍 Ters Yön' },
  { id: 'where', label: '📍 Neresinde?' },
  { id: 'wheel', label: '🎡 Hareket Çarkı' },
];

export default function DirectionsTopBar({
  mode,
  scope,
  score,
  soundOn,
  isSpinning,
  onBackToHome,
  onChangeMode,
  onChangeScope,
  onToggleSound,
  onReset,
}) {
  return (
    <header className="top-toolbar">
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => {
            playClick();
            onBackToHome?.();
          }}
          className="icon-pill-btn"
          title="Ana Ekrana Dön"
        >
          🏠 <span>Etkinlikler</span>
        </button>

        <div className="segmented-control" role="group" aria-label="Yön Oyunları">
          {DIRECTION_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`seg-btn ${mode === m.id ? 'active' : ''}`}
              onClick={() => {
                if (isSpinning) return;
                playClick();
                onChangeMode(m.id);
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-group">
        {mode !== 'wheel' && (
          <div className="segmented-control" role="group" aria-label="Yön Kapsamı">
            <button
              type="button"
              className={`seg-btn ${scope === 'all' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                onChangeScope('all');
              }}
              title="Sağ, Sol, Yukarı ve Aşağı (4 Yön)"
            >
              🧭 4 Yön (Sağ-Sol-Yukarı-Aşağı)
            </button>
            <button
              type="button"
              className={`seg-btn ${scope === 'lr' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                onChangeScope('lr');
              }}
            >
              ↔️ Sağ-Sol
            </button>
            <button
              type="button"
              className={`seg-btn ${scope === 'ud' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                onChangeScope('ud');
              }}
            >
              ↕️ Yukarı-Aşağı
            </button>
          </div>
        )}

        {mode !== 'wheel' && (
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 font-black text-sm text-amber-900">
            ⭐ {score}
          </span>
        )}
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => {
            const next = toggleSoundEnabled();
            onToggleSound(next);
            if (next) playClick();
          }}
          className={`icon-pill-btn ${!soundOn ? 'is-muted' : ''}`}
          title="Ses Efektleri Aç/Kapa"
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
        <button type="button" onClick={onReset} className="icon-pill-btn" title="Baştan Başla">
          🔄
        </button>
        <button type="button" onClick={toggleFullscreen} className="icon-pill-btn" title="Tam Ekran">
          ⛶
        </button>
      </div>
    </header>
  );
}
