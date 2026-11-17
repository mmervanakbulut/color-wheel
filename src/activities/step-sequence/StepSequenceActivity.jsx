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
import {
  EASY_SEQUENCES,
  MASTER_SEQUENCES,
  shuffleSteps,
  createSurpriseSequence,
} from './config';
import SequenceStage from './SequenceStage';

export default function StepSequenceActivity({ onBackToHome }) {
  const [stepCount, setStepCount] = useState(3); // 3 (Kolay) | 4 (Usta)
  const [levelIdx, setLevelIdx] = useState(0);
  const [surpriseStory, setSurpriseStory] = useState(null);
  const [shuffledCards, setShuffledCards] = useState(() => shuffleSteps(EASY_SEQUENCES[0].steps));
  const [currentStep, setCurrentStep] = useState(1);
  const [wrongStepId, setWrongStepId] = useState(null);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const wrongTimerRef = useRef(null);
  const stories = stepCount === 3 ? EASY_SEQUENCES : MASTER_SEQUENCES;
  const activeStory = surpriseStory || stories[levelIdx % stories.length];

  useEffect(() => () => clearTimeout(wrongTimerRef.current), []);

  const startStory = useCallback((story) => {
    clearTimeout(wrongTimerRef.current);
    setShuffledCards(shuffleSteps(story.steps));
    setCurrentStep(1);
    setWrongStepId(null);
    setSolved(false);
  }, []);

  const loadLevel = (idx, nextCount = stepCount) => {
    const list = nextCount === 3 ? EASY_SEQUENCES : MASTER_SEQUENCES;
    const safeIdx = ((idx % list.length) + list.length) % list.length;
    setSurpriseStory(null);
    setLevelIdx(safeIdx);
    startStory(list[safeIdx]);
  };

  const handleSurprise = () => {
    playClick();
    const next = createSurpriseSequence(stepCount);
    setSurpriseStory(next);
    startStory(next);
  };

  const handleSelectCard = (card) => {
    if (solved || card.step < currentStep) return;

    if (card.step === currentStep) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setWrongStepId(null);

      if (nextStep > activeStory.steps.length) {
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
      setWrongStepId(card.step);
      wrongTimerRef.current = setTimeout(() => setWrongStepId(null), 500);
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

          <div className="segmented-control" role="group" aria-label="Adım Sayısı">
            <button
              type="button"
              className={`seg-btn ${stepCount === 3 ? 'active' : ''}`}
              onClick={() => {
                playClick();
                setStepCount(3);
                loadLevel(0, 3);
              }}
            >
              🌱 3 Adım (Kolay)
            </button>
            <button
              type="button"
              className={`seg-btn ${stepCount === 4 ? 'active' : ''}`}
              onClick={() => {
                playClick();
                setStepCount(4);
                loadLevel(0, 4);
              }}
            >
              🚀 4 Adım (Usta)
            </button>
          </div>
        </div>

        <div className="toolbar-group">
          <div className="segmented-control">
            <button
              type="button"
              className="seg-btn"
              onClick={() => {
                playClick();
                loadLevel(levelIdx - 1);
              }}
            >
              ◀
            </button>
            <span className="px-2.5 py-1 text-xs font-black text-slate-700 self-center">
              {surpriseStory ? '🎲 Sürpriz' : `Görev ${levelIdx + 1}/${stories.length}`}
            </span>
            <button
              type="button"
              className="seg-btn"
              onClick={() => {
                playClick();
                loadLevel(levelIdx + 1);
              }}
            >
              ▶
            </button>
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
              startStory(activeStory);
            }}
            className="icon-pill-btn"
            title="Baştan Sırala"
          >
            🔄
          </button>
          <button type="button" onClick={toggleFullscreen} className="icon-pill-btn" title="Tam Ekran">
            ⛶
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex items-center justify-center bg-white rounded-3xl border-2 border-slate-300 shadow-md p-4 md:p-6 relative overflow-y-auto">
        <SequenceStage
          story={activeStory}
          shuffledCards={shuffledCards}
          currentStep={currentStep}
          wrongStepId={wrongStepId}
          onSelectCard={handleSelectCard}
        />
      </main>

      <footer className="bottom-action-bar">
        <button
          type="button"
          onClick={() => {
            playClick();
            loadLevel(levelIdx + 1);
          }}
          className="action-btn primary"
        >
          ➡️ Farklı Hikaye
        </button>
        <button type="button" onClick={handleSurprise} className="action-btn secondary">
          🎲 Sürpriz Sıralama
        </button>
      </footer>

      {solved && (
        <CelebrationModal
          stars={3}
          heroIcon={activeStory.icon}
          targetIcon="📋"
          message={`"${activeStory.title}" adımlarını doğru sırayla dizdin!`}
          nextLabel="➡️ Sıradaki Hikaye"
          onNext={() => {
            playClick();
            loadLevel(levelIdx + 1);
          }}
          onSurprise={handleSurprise}
        />
      )}

      <div id="confetti-layer" aria-hidden="true" />
    </div>
  );
}
