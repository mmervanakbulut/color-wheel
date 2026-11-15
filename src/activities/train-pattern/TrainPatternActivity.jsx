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
import { CARGO_THEMES, EASY_PATTERNS, ADVANCED_PATTERNS, createRandomPattern } from './config';
import TrainTrack from './TrainTrack';
import PatternChoices from './PatternChoices';
import CelebrationModal from '../../components/CelebrationModal';
import './trainPattern.css';

export default function TrainPatternActivity({ onBackToHome }) {
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' | 'advanced'
  const [levelIdx, setLevelIdx] = useState(0);
  const [pattern, setPattern] = useState(() => EASY_PATTERNS[0]);
  const [cargoThemeId, setCargoThemeId] = useState('shapes');

  const [filledSlots, setFilledSlots] = useState({});
  const [wrongWagonIndex, setWrongWagonIndex] = useState(-1);
  const [wrongChoiceKey, setWrongChoiceKey] = useState(null);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [warningText, setWarningText] = useState('');
  const [winInfo, setWinInfo] = useState(null);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const warningTimerRef = useRef(null);
  const cargoTheme = CARGO_THEMES.find((t) => t.id === cargoThemeId) || CARGO_THEMES[0];

  const loadPatternLevel = useCallback((nextDiff, nextIdx) => {
    const list = nextDiff === 'advanced' ? ADVANCED_PATTERNS : EASY_PATTERNS;
    const safeIdx = ((nextIdx % list.length) + list.length) % list.length;
    setDifficulty(nextDiff);
    setLevelIdx(safeIdx);
    setPattern(list[safeIdx]);
    setFilledSlots({});
    setWrongWagonIndex(-1);
    setWrongChoiceKey(null);
    setMistakesCount(0);
    setWarningText('');
    setWinInfo(null);
  }, []);

  const resetCurrentPattern = () => {
    setFilledSlots({});
    setWrongWagonIndex(-1);
    setWrongChoiceKey(null);
    setMistakesCount(0);
    setWarningText('');
    setWinInfo(null);
  };

  const handleSurprise = () => {
    playClick();
    setPattern(createRandomPattern(difficulty));
    resetCurrentPattern();
  };

  const getActiveMissingIndex = (slots = filledSlots) => {
    for (const idx of pattern.missing) {
      if (!slots[idx]) return idx;
    }
    return -1;
  };

  const activeMissingIndex = getActiveMissingIndex();

  const handleSelectChoice = (choiceKey) => {
    if (winInfo || activeMissingIndex === -1) return;
    const expectedKey = pattern.sequence[activeMissingIndex];

    if (choiceKey === expectedKey) {
      const nextSlots = { ...filledSlots, [activeMissingIndex]: choiceKey };
      setFilledSlots(nextSlots);
      setWrongWagonIndex(-1);
      setWrongChoiceKey(null);
      setWarningText('');
      playLockIn();

      if (getActiveMissingIndex(nextSlots) === -1) {
        const stars = mistakesCount >= 2 ? 2 : 3;
        playCelebration();
        launchDomConfetti(['#F43F5E', '#0EA5E9', '#F59E0B', '#10B981', '#8B5CF6']);
        setWinInfo({
          stars,
          chosenIcon: cargoTheme.items[choiceKey]?.icon || '🌟',
        });
      }
    } else {
      setMistakesCount((m) => m + 1);
      setWrongWagonIndex(activeMissingIndex);
      setWrongChoiceKey(choiceKey);
      playWrong();
      setWarningText('🤔 Örüntünün sırasına dikkat ederek tekrar deneyelim!');
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = setTimeout(() => {
        setWarningText('');
        setWrongWagonIndex(-1);
        setWrongChoiceKey(null);
      }, 1800);
    }
  };

  useEffect(() => () => clearTimeout(warningTimerRef.current), []);

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

          <div className="segmented-control" role="group" aria-label="Zorluk Seçimi">
            <button
              type="button"
              className={`seg-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                loadPatternLevel('easy', 0);
              }}
            >
              🚂❓ Kolay (1 Boş)
            </button>
            <button
              type="button"
              className={`seg-btn ${difficulty === 'advanced' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                loadPatternLevel('advanced', 0);
              }}
            >
              🚂❓❓ Usta (2 Boş)
            </button>
          </div>
        </div>

        <div className="toolbar-group">
          <div className="segmented-control" role="group" aria-label="Vagon Teması">
            {CARGO_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`seg-btn ${cargoThemeId === t.id ? 'active' : ''}`}
                title={t.name}
                onClick={() => {
                  playClick();
                  setCargoThemeId(t.id);
                }}
              >
                {t.icon}
              </button>
            ))}
          </div>

          <div className="segmented-control">
            <button type="button" className="seg-btn" onClick={() => { playClick(); loadPatternLevel(difficulty, levelIdx - 1); }}>◀</button>
            <span className="px-2.5 py-1 font-extrabold text-sm text-slate-800 flex items-center">{pattern.title}</span>
            <button type="button" className="seg-btn" onClick={() => { playClick(); loadPatternLevel(difficulty, levelIdx + 1); }}>▶</button>
            <button type="button" className="seg-btn" onClick={handleSurprise} title="Sürpriz Örüntü">🎲 Sürpriz</button>
          </div>
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
          <button type="button" onClick={toggleFullscreen} className="icon-pill-btn" title="Tam Ekran">
            ⛶
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col relative">
        {warningText && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 rounded-2xl bg-amber-500 text-white font-black text-base shadow-lg border-2 border-amber-200">
            {warningText}
          </div>
        )}
        <TrainTrack
          pattern={pattern}
          cargoTheme={cargoTheme}
          filledSlots={filledSlots}
          activeMissingIndex={activeMissingIndex}
          wrongWagonIndex={wrongWagonIndex}
        />
      </main>

      <PatternChoices
        choices={pattern.choices}
        cargoTheme={cargoTheme}
        wrongChoiceKey={wrongChoiceKey}
        isCompleted={Boolean(winInfo)}
        onSelectChoice={handleSelectChoice}
        onReset={() => {
          playClick();
          resetCurrentPattern();
        }}
      />

      {winInfo && (
        <CelebrationModal
          stars={winInfo.stars}
          heroIcon="🚂"
          targetIcon={winInfo.chosenIcon}
          message="Çuf çuf! Tren vagonlarını doğru sırayla tamamladın!"
          nextLabel="▶️ Sıradaki Örüntü"
          onNext={() => {
            playClick();
            loadPatternLevel(difficulty, levelIdx + 1);
          }}
          onSurprise={handleSurprise}
        />
      )}

      <div id="confetti-layer" aria-hidden="true"></div>
    </div>
  );
}
