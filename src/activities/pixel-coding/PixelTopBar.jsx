import React from 'react';
import { playClick, toggleSoundEnabled } from '../../utils/sound';
import { toggleFullscreen } from '../../utils/ui';

const PIXEL_MODES = [
  { id: 'copy', label: '🧩 Desen Kopyala' },
  { id: 'decode', label: '🔢 Kodla Boya' },
  { id: 'free', label: '🎨 Serbest' },
];

export default function PixelTopBar({
  mode,
  gridSize,
  levelIndex,
  totalLevels,
  isSurprise,
  score,
  soundOn,
  onBackToHome,
  onChangeMode,
  onChangeGridSize,
  onPrevLevel,
  onNextLevel,
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

        <div className="segmented-control" role="group" aria-label="Piksel Modu">
          {PIXEL_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`seg-btn ${mode === m.id ? 'active' : ''}`}
              onClick={() => {
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
        <div className="segmented-control" role="group" aria-label="Izgara Boyutu">
          <button
            type="button"
            className={`seg-btn ${gridSize === 4 ? 'active' : ''}`}
            onClick={() => {
              playClick();
              onChangeGridSize(4);
            }}
          >
            4×4 Kolay
          </button>
          <button
            type="button"
            className={`seg-btn ${gridSize === 5 ? 'active' : ''}`}
            onClick={() => {
              playClick();
              onChangeGridSize(5);
            }}
          >
            5×5 Usta
          </button>
        </div>

        {mode !== 'free' && (
          <div className="segmented-control">
            <button type="button" className="seg-btn" onClick={onPrevLevel} title="Önceki Desen">
              ◀
            </button>
            <span className="px-2.5 py-1 text-xs font-black text-slate-700 self-center">
              {isSurprise ? '🎲 Sürpriz' : `Desen ${levelIndex + 1}/${totalLevels}`}
            </span>
            <button type="button" className="seg-btn" onClick={onNextLevel} title="Sonraki Desen">
              ▶
            </button>
          </div>
        )}

        {mode !== 'free' && (
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
        <button type="button" onClick={onReset} className="icon-pill-btn" title="Tahtayı Temizle">
          🔄
        </button>
        <button type="button" onClick={toggleFullscreen} className="icon-pill-btn" title="Tam Ekran">
          ⛶
        </button>
      </div>
    </header>
  );
}
