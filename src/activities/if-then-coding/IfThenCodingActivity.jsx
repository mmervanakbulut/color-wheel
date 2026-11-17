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
import { EASY_RULES, MASTER_RULES, buildQuestionDeck } from './config';
import IfThenStage from './IfThenStage';

const ROUND_LENGTH = 5;

export default function IfThenCodingActivity({ onBackToHome }) {
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' (2 dal) | 'master' (3 dal)
  const [ruleIdx, setRuleIdx] = useState(0);
  const [deck, setDeck] = useState(() => buildQuestionDeck(EASY_RULES[0], ROUND_LENGTH));
  const [stepIdx, setStepIdx] = useState(0);
  const [wrongBranchId, setWrongBranchId] = useState(null);
  const [isCorrectFlash, setIsCorrectFlash] = useState(false);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const timerRef = useRef(null);
  const rules = difficulty === 'easy' ? EASY_RULES : MASTER_RULES;
  const activeRule = rules[ruleIdx % rules.length];
  const currentItem = deck[stepIdx] || deck[0];

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const startRule = useCallback((nextRule) => {
    clearTimeout(timerRef.current);
    setDeck(buildQuestionDeck(nextRule, ROUND_LENGTH));
    setStepIdx(0);
    setWrongBranchId(null);
    setIsCorrectFlash(false);
    setSolved(false);
  }, []);

  const loadRuleByIndex = (idx, nextDiff = difficulty) => {
    const list = nextDiff === 'easy' ? EASY_RULES : MASTER_RULES;
    const safeIdx = ((idx % list.length) + list.length) % list.length;
    setRuleIdx(safeIdx);
    startRule(list[safeIdx]);
  };

  const handleSelectBranch = (branchId) => {
    if (solved || isCorrectFlash) return;

    if (branchId === currentItem.targetBranch) {
      setScore((s) => s + 1);
      setWrongBranchId(null);

      if (stepIdx + 1 >= deck.length) {
        setSolved(true);
        playCelebration();
        launchDomConfetti();
      } else {
        playLockIn();
        setIsCorrectFlash(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setIsCorrectFlash(false);
          setStepIdx((i) => i + 1);
        }, 550);
      }
    } else {
      playWrong();
      clearTimeout(timerRef.current);
      setWrongBranchId(branchId);
      timerRef.current = setTimeout(() => setWrongBranchId(null), 480);
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

          <div className="segmented-control" role="group" aria-label="Koşul Sayısı">
            <button
              type="button"
              className={`seg-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                setDifficulty('easy');
                loadRuleByIndex(0, 'easy');
              }}
            >
              🌦️ 2 Koşul (Kolay)
            </button>
            <button
              type="button"
              className={`seg-btn ${difficulty === 'master' ? 'active' : ''}`}
              onClick={() => {
                playClick();
                setDifficulty('master');
                loadRuleByIndex(0, 'master');
              }}
            >
              🚦 3 Koşul (Usta)
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
                loadRuleByIndex(ruleIdx - 1);
              }}
            >
              ◀
            </button>
            <span className="px-2.5 py-1 text-xs font-black text-slate-700 self-center">
              Kural {ruleIdx + 1}/{rules.length}
            </span>
            <button
              type="button"
              className="seg-btn"
              onClick={() => {
                playClick();
                loadRuleByIndex(ruleIdx + 1);
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
              startRule(activeRule);
            }}
            className="icon-pill-btn"
            title="Turu Yenile"
          >
            🔄
          </button>
          <button type="button" onClick={toggleFullscreen} className="icon-pill-btn" title="Tam Ekran">
            ⛶
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex items-center justify-center bg-white rounded-3xl border-2 border-slate-300 shadow-md p-4 md:p-6 relative overflow-y-auto">
        <IfThenStage
          rule={activeRule}
          currentItem={currentItem}
          stepIdx={stepIdx}
          totalSteps={deck.length}
          wrongBranchId={wrongBranchId}
          isCorrectFlash={isCorrectFlash}
          onSelectBranch={handleSelectBranch}
        />
      </main>

      <footer className="bottom-action-bar">
        <button
          type="button"
          onClick={() => {
            playClick();
            loadRuleByIndex(ruleIdx + 1);
          }}
          className="action-btn primary"
        >
          ➡️ Farklı Kurala Geç
        </button>
      </footer>

      {solved && (
        <CelebrationModal
          stars={3}
          heroIcon={activeRule.icon}
          targetIcon="🚦"
          message={`"${activeRule.title}" koşullarının hepsini doğru uyguladın!`}
          nextLabel="➡️ Sıradaki Kural"
          onNext={() => {
            playClick();
            loadRuleByIndex(ruleIdx + 1);
          }}
        />
      )}

      <div id="confetti-layer" aria-hidden="true" />
    </div>
  );
}
