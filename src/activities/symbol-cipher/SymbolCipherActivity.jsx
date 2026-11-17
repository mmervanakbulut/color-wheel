import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  playClick,
  playLockIn,
  playWrong,
  playCelebration,
  isSoundEnabled,
  toggleSoundEnabled,
} from '../../utils/sound';
import { toggleFullscreen, launchDomConfetti } from '../../utils/ui';
import CelebrationModal from '../../components/CelebrationModal';
import { CIPHER_THEMES, createCipherPuzzle } from './config';
import CipherStage from './CipherStage';

export default function SymbolCipherActivity({ onBackToHome }) {
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' (3) | 'master' (4)
  const [themeId, setThemeId] = useState('fruits');
  const [puzzle, setPuzzle] = useState(() => createCipherPuzzle('easy', 'fruits'));
  const [currentSlotIdx, setCurrentSlotIdx] = useState(0);
  const [wrongChoice, setWrongChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const wrongTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(wrongTimerRef.current), []);

  const startNewPuzzle = useCallback(
    (nextDiff = difficulty, nextTheme = themeId) => {
      clearTimeout(wrongTimerRef.current);
      setPuzzle(createCipherPuzzle(nextDiff, nextTheme));
      setCurrentSlotIdx(0);
      setWrongChoice(null);
      setSolved(false);
    },
    [difficulty, themeId]
  );

  const handleSelectChoice = (item) => {
    if (solved) return;
    const activeSlot = puzzle.slots[currentSlotIdx];
    if (!activeSlot) return;

    if (item === activeSlot.expectedItem) {
      const nextIdx = currentSlotIdx + 1;
      setCurrentSlotIdx(nextIdx);
      setWrongChoice(null);

      if (nextIdx >= puzzle.slots.length) {
        setSolved(true);
        setScore((s) => s + 1);
        playCelebration();
        launchDomConfetti();
      } else {
        playLockIn();
      }
    } else {
      playWrong();
      clearTimeout(wrongTimerRef.current);
      setWrongChoice(item);
      wrongTimerRef.current = setTimeout(() => setWrongChoice(null), 500);
    }
  };

  return (
    <div className="app-shell">
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

          <div className="segmented-control" role="group" aria-label="Zorluk">
            <button
              type="button"
              className={`seg-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                setDifficulty('easy');
                startNewPuzzle('easy', themeId);
              }}
            >
              🔓 3 Haneli (Kolay)
            </button>
            <button
              type="button"
              className={`seg-btn ${difficulty === 'master' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                setDifficulty('master');
                startNewPuzzle('master', themeId);
              }}
            >
              🔐 4 Haneli (Usta)
            </button>
          </div>
        </div>

        <div className="toolbar-group">
          <div className="segmented-control" role="group" aria-label="Şifre Teması">
            {CIPHER_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`seg-btn ${themeId === t.id ? 'active' : ''}`}
                onClick={() => {
                  playClick();
                  setThemeId(t.id);
                  startNewPuzzle(difficulty, t.id);
                }}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 font-black text-sm text-amber-900">
            ⭐ {score}
          </span>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => {
              const next = toggleSoundEnabled();
              setSoundOn(next);
              if (next) playClick();
            }}
            className={`icon-pill-btn ${!soundOn ? 'is-muted' : ''}`}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button
            type="button"
            onClick={() => {
              playClick();
              setCurrentSlotIdx(0);
              setWrongChoice(null);
            }}
            className="icon-pill-btn"
            title="Şifreyi Baştan Çöz"
          >
            🔄
          </button>
          <button type="button" onClick={toggleFullscreen} className="icon-pill-btn" title="Tam Ekran">
            ⛶
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex items-center justify-center bg-white rounded-3xl border-2 border-slate-300 shadow-md p-4 md:p-6 relative overflow-y-auto">
        <CipherStage
          puzzle={puzzle}
          currentSlotIdx={currentSlotIdx}
          wrongChoice={wrongChoice}
          onSelectChoice={handleSelectChoice}
        />
      </main>

      <footer className="bottom-action-bar">
        <button
          type="button"
          onClick={() => {
            playClick();
            startNewPuzzle(difficulty, themeId);
          }}
          className="action-btn primary"
        >
          🎲 Yeni Şifre Üret
        </button>
      </footer>

      {solved && (
        <CelebrationModal
          stars={3}
          heroIcon="🔓"
          targetIcon="🎉"
          message="Tebrikler! Sembol anahtarını kullanarak gizli şifreyi çözdün!"
          nextLabel="➡️ Yeni Şifre"
          onNext={() => {
            playClick();
            startNewPuzzle(difficulty, themeId);
          }}
        />
      )}

      <div id="confetti-layer" aria-hidden="true" />
    </div>
  );
}
