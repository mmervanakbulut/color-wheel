import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playClick,
  playTick,
  playLockIn,
  playWrong,
  playCelebration,
  isSoundEnabled,
  toggleSoundEnabled,
} from '../../utils/sound';
import { toggleFullscreen, launchDomConfetti } from '../../utils/ui';
import { EMOTIONS } from './config';
import DiceStage from './DiceStage';
import WheelStage from './WheelStage';
import QuizStage from './QuizStage';
import './emotionDice.css';

export default function EmotionDiceActivity({ onBackToHome }) {
  const [mode, setMode] = useState('dice');
  const [character, setCharacter] = useState('girl');
  const [diceCount, setDiceCount] = useState(1);

  const [isRolling, setIsRolling] = useState(false);
  const [diceWinners, setDiceWinners] = useState([0, 3]);
  const [spinCounts, setSpinCounts] = useState([
    { tx: 0, ty: 0 },
    { tx: 0, ty: 0 },
  ]);
  const [hasRolledOnce, setHasRolledOnce] = useState(false);

  const [wheelAngle, setWheelAngle] = useState(0);
  const [wheelPreviewIndex, setWheelPreviewIndex] = useState(0);
  const wheelAnimRef = useRef(null);

  const [quizTargetIdx, setQuizTargetIdx] = useState(0);
  const [quizOptions, setQuizOptions] = useState([0, 1, 2]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizWrongSet, setQuizWrongSet] = useState([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAutoNext, setQuizAutoNext] = useState(false);
  const quizTimerRef = useRef(null);

  const [completed, setCompleted] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const rollIntervalRef = useRef(null);
  const rollTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(rollIntervalRef.current);
      clearTimeout(rollTimeoutRef.current);
      clearTimeout(quizTimerRef.current);
      if (wheelAnimRef.current) cancelAnimationFrame(wheelAnimRef.current);
    };
  }, []);

  const generateQuiz = useCallback((excludeIdx = null) => {
    clearTimeout(quizTimerRef.current);
    const pool = EMOTIONS.map((_, i) => i).filter((i) => i !== excludeIdx);
    const target = pool[Math.floor(Math.random() * pool.length)];
    const others = EMOTIONS.map((_, i) => i)
      .filter((i) => i !== target)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    const opts = [target, ...others].sort(() => Math.random() - 0.5);
    setQuizTargetIdx(target);
    setQuizOptions(opts);
    setQuizAnswered(false);
    setQuizWrongSet([]);
  }, []);

  useEffect(() => {
    if (mode === 'quiz') generateQuiz();
  }, [mode, generateQuiz]);

  const triggerDiceRoll = () => {
    if (isRolling) return;
    setCompleted(false);
    setIsRolling(true);
    setHasRolledOnce(true);

    const pickFace = (prevIdx) => {
      const candidates = EMOTIONS.map((_, idx) => idx).filter((idx) => idx !== prevIdx);
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const nextWinner1 = pickFace(diceWinners[0]);
    let nextWinner2 = pickFace(diceWinners[1]);
    if (diceCount === 2 && nextWinner2 === nextWinner1) {
      nextWinner2 = (nextWinner1 + 1) % EMOTIONS.length;
    }

    setDiceWinners([nextWinner1, nextWinner2]);
    setSpinCounts((prev) => [
      { tx: prev[0].tx + 2, ty: prev[0].ty + 2 },
      { tx: prev[1].tx + 2, ty: prev[1].ty + 3 },
    ]);

    let step = 0;
    clearInterval(rollIntervalRef.current);
    rollIntervalRef.current = setInterval(() => {
      step += 1;
      playTick(Math.min(1, step / 12));
    }, 160);

    clearTimeout(rollTimeoutRef.current);
    rollTimeoutRef.current = setTimeout(() => {
      clearInterval(rollIntervalRef.current);
      setIsRolling(false);
      playLockIn();
    }, 2100);
  };

  const triggerWheelSpin = () => {
    if (isRolling) return;
    setCompleted(false);
    setIsRolling(true);
    setHasRolledOnce(true);

    const winnerIdx = Math.floor(Math.random() * EMOTIONS.length);
    const sliceDeg = 360 / EMOTIONS.length;
    const targetSliceCenterDeg = winnerIdx * sliceDeg + sliceDeg / 2;
    const desiredMod = (270 - targetSliceCenterDeg + 360) % 360;
    const currentMod = ((wheelAngle % 360) + 360) % 360;
    const extraDeg = (desiredMod - currentMod + 360) % 360;
    const totalDelta = 360 * 5 + extraDeg;

    const startAngle = wheelAngle;
    const duration = 2600;
    const startTime = performance.now();
    let lastTickSlice = -1;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + totalDelta * eased;

      setWheelAngle(currentAngle);

      const norm = ((270 - (currentAngle % 360)) % 360 + 360) % 360;
      const activeIdx = Math.floor(norm / sliceDeg) % EMOTIONS.length;
      setWheelPreviewIndex(activeIdx);

      if (activeIdx !== lastTickSlice) {
        lastTickSlice = activeIdx;
        playTick(progress);
      }

      if (progress < 1) {
        wheelAnimRef.current = requestAnimationFrame(animate);
      } else {
        setWheelPreviewIndex(winnerIdx);
        setIsRolling(false);
        playLockIn();
      }
    };

    wheelAnimRef.current = requestAnimationFrame(animate);
  };

  const handleQuizOptionClick = (optIdx) => {
    if (quizAnswered) return;
    if (optIdx === quizTargetIdx) {
      setQuizAnswered(true);
      setQuizScore((s) => s + 1);
      playLockIn();
      if (quizAutoNext) {
        quizTimerRef.current = setTimeout(() => {
          generateQuiz(quizTargetIdx);
        }, 1500);
      }
    } else {
      if (!quizWrongSet.includes(optIdx)) {
        setQuizWrongSet((prev) => [...prev, optIdx]);
      }
      playWrong();
    }
  };

  const handlePrimaryAction = () => {
    if (isRolling) return;
    if (completed) {
      setCompleted(false);
      if (mode === 'quiz') generateQuiz();
      else if (mode === 'wheel') triggerWheelSpin();
      else triggerDiceRoll();
      return;
    }

    if (mode === 'dice') triggerDiceRoll();
    else if (mode === 'wheel') triggerWheelSpin();
    else if (mode === 'quiz') {
      playClick();
      generateQuiz(quizTargetIdx);
    }
  };

  const handleFinishActivity = () => {
    if (isRolling) return;
    setCompleted(true);
    playCelebration();
    launchDomConfetti(EMOTIONS.map((e) => e.color));
  };

  const handleReset = () => {
    if (isRolling) return;
    playClick();
    setCompleted(false);
    setHasRolledOnce(false);
    setQuizScore(0);
    if (mode === 'quiz') generateQuiz();
  };

  const handleToggleSound = () => {
    const next = toggleSoundEnabled();
    setSoundOn(next);
    if (next) playClick();
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
            title="Ana Ekrana Dön"
          >
            🏠 <span>Etkinlikler</span>
          </button>

          <div className="segmented-control" role="group" aria-label="Oyun Modu">
            {[
              { id: 'dice', label: '🎲 3D Zar' },
              { id: 'wheel', label: '🎡 Çark' },
              { id: 'quiz', label: '🧩 Eşleştir' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className={`seg-btn ${mode === m.id ? 'active' : ''}`}
                onClick={() => {
                  if (isRolling) return;
                  playClick();
                  setMode(m.id);
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-group">
          <div className="segmented-control" role="group" aria-label="Karakter Seçimi">
            <button
              type="button"
              className={`seg-btn ${character === 'girl' ? 'active' : ''}`}
              onClick={() => {
                if (isRolling) return;
                playClick();
                setCharacter('girl');
              }}
            >
              👧 Kız
            </button>
            <button
              type="button"
              className={`seg-btn ${character === 'boy' ? 'active' : ''}`}
              onClick={() => {
                if (isRolling) return;
                playClick();
                setCharacter('boy');
              }}
            >
              👦 Erkek
            </button>
          </div>

          {mode === 'dice' && (
            <div className="segmented-control" role="group" aria-label="Zar Sayısı">
              <button
                type="button"
                className={`seg-btn ${diceCount === 1 ? 'active' : ''}`}
                onClick={() => {
                  if (isRolling) return;
                  playClick();
                  setDiceCount(1);
                }}
              >
                🎲 Tek Zar
              </button>
              <button
                type="button"
                className={`seg-btn ${diceCount === 2 ? 'active' : ''}`}
                onClick={() => {
                  if (isRolling) return;
                  playClick();
                  setDiceCount(2);
                }}
              >
                🎲🎲 Çift Zar
              </button>
            </div>
          )}

          {mode === 'quiz' && (
            <>
              <div className="segmented-control" role="group" aria-label="Geçiş Modu">
                <button
                  type="button"
                  className={`seg-btn ${quizAutoNext ? 'active' : ''}`}
                  onClick={() => {
                    playClick();
                    setQuizAutoNext((v) => !v);
                  }}
                >
                  {quizAutoNext ? '⏭️ Otomatik' : '✋ Tuşla Geç'}
                </button>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 font-black text-sm text-amber-900">
                ⭐ {quizScore}
              </span>
            </>
          )}
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={handleToggleSound}
            className={`icon-pill-btn ${!soundOn ? 'is-muted' : ''}`}
            title="Ses Efektleri Aç/Kapa"
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button type="button" onClick={handleReset} className="icon-pill-btn" title="Baştan Başla">
            🔄
          </button>
          <button type="button" onClick={toggleFullscreen} className="icon-pill-btn" title="Tam Ekran">
            ⛶
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex items-center justify-center bg-white rounded-3xl border-2 border-slate-300 shadow-md p-6 relative overflow-hidden">
        {mode === 'dice' && (
          <DiceStage
            diceCount={diceCount}
            diceWinners={diceWinners}
            spinCounts={spinCounts}
            character={character}
            isRolling={isRolling}
            hasRolledOnce={hasRolledOnce}
            onRoll={triggerDiceRoll}
          />
        )}

        {mode === 'wheel' && (
          <WheelStage
            character={character}
            wheelAngle={wheelAngle}
            wheelPreviewIndex={wheelPreviewIndex}
            isRolling={isRolling}
            hasRolledOnce={hasRolledOnce}
            onSpin={triggerWheelSpin}
          />
        )}

        {mode === 'quiz' && (
          <QuizStage
            character={character}
            quizTargetIdx={quizTargetIdx}
            quizOptions={quizOptions}
            quizAnswered={quizAnswered}
            quizWrongSet={quizWrongSet}
            onSelectOption={handleQuizOptionClick}
          />
        )}
      </main>

      <footer className="bottom-action-bar">
        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={isRolling}
          className={`action-btn ${
            isRolling
              ? 'is-spinning'
              : completed
              ? 'celebrate'
              : mode === 'quiz' && quizAnswered
              ? 'success pulse-attention'
              : 'primary pulse-attention'
          }`}
        >
          {isRolling
            ? '⏳ Dönüyor...'
            : completed
            ? '🔄 YENİDEN BAŞLA'
            : mode === 'dice'
            ? '🎲 ZARI AT'
            : mode === 'wheel'
            ? '🎡 ÇARKI ÇEVİR'
            : quizAnswered
            ? '➡️ SIRADAKİ SORU'
            : '🎲 FARKLI SORU'}
        </button>

        {!isRolling && !completed && (
          <button
            type="button"
            onClick={handleFinishActivity}
            className="action-btn celebrate"
            title="Etkinliği Bitir ve Kutla"
          >
            🏆 Bitir
          </button>
        )}
      </footer>

      <div id="confetti-layer" aria-hidden="true"></div>
    </div>
  );
}
