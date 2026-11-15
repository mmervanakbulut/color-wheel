import React from 'react';
import { playClick, toggleSoundEnabled } from '../../utils/sound';
import { toggleFullscreen } from '../../utils/ui';
import { ROUTE_THEMES } from './config';

export default function RouteTopBar({
  onBackToHome,
  gameMode,
  onChangeMode,
  gridSize,
  onChangeSize,
  themeId,
  onChangeTheme,
  levelTitle,
  onPrevLevel,
  onNextLevel,
  onSurprise,
  soundOn,
  onSoundChange,
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
        >
          🏠 <span>Etkinlikler</span>
        </button>

        <div className="segmented-control" role="group" aria-label="Oyun Modu">
          <button
            type="button"
            className={`seg-btn ${gameMode === 'instant' ? 'active' : ''}`}
            onClick={() => onChangeMode('instant')}
          >
            👆 Tek Adım
          </button>
          <button
            type="button"
            className={`seg-btn ${gameMode === 'queue' ? 'active' : ''}`}
            onClick={() => onChangeMode('queue')}
          >
            🧩 Algoritma
          </button>
        </div>

        <div className="segmented-control" role="group" aria-label="Harita Boyutu">
          {[5, 8].map((s) => (
            <button
              key={s}
              type="button"
              className={`seg-btn ${gridSize === s ? 'active' : ''}`}
              onClick={() => onChangeSize(s)}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-group">
        <div className="segmented-control" role="group" aria-label="Karakter Seçimi">
          {ROUTE_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`seg-btn ${themeId === t.id ? 'active' : ''}`}
              title={t.storyHint}
              onClick={() => {
                playClick();
                onChangeTheme(t.id);
              }}
            >
              {t.heroIcon}
            </button>
          ))}
        </div>

        <div className="segmented-control">
          <button type="button" className="seg-btn" onClick={onPrevLevel}>◀</button>
          <span className="px-2.5 py-1 font-extrabold text-sm text-slate-800 flex items-center">
            {levelTitle}
          </span>
          <button type="button" className="seg-btn" onClick={onNextLevel}>▶</button>
          <button
            type="button"
            className="seg-btn"
            onClick={onSurprise}
            title="Rastgele Çözülebilir Harita"
          >
            🎲 Sürpriz
          </button>
        </div>
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => {
            const next = toggleSoundEnabled();
            onSoundChange(next);
            if (next) playClick();
          }}
          className={`icon-pill-btn ${!soundOn ? 'is-muted' : ''}`}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
        <button type="button" onClick={toggleFullscreen} className="icon-pill-btn" title="Tam Ekran">
          ⛶
        </button>
      </div>
    </header>
  );
}
