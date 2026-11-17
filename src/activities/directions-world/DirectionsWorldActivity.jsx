import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playClick, playLockIn, playWrong, playCelebration, isSoundEnabled } from '../../utils/sound';
import { launchDomConfetti } from '../../utils/ui';
import CelebrationModal from '../../components/CelebrationModal';
import { DIRECTIONS, getAllowedDirections, createLookQuestion, createOddQuestion, createWhereQuestion } from './config';
import { useDirectionWheel } from './useDirectionWheel';
import DirectionsTopBar from './DirectionsTopBar';
import LookStage from './LookStage';
import OddDirectionStage from './OddDirectionStage';
import WhereStage from './WhereStage';
import DirectionWheelStage from './DirectionWheelStage';
import './directionsWorld.css';

export default function DirectionsWorldActivity({ onBackToHome }) {
  const [mode, setMode] = useState('look');
  const [scope, setScope] = useState('all'); // 'all' (4 yön) | 'lr' (sadece sağ-sol)
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [completed, setCompleted] = useState(false);

  const [lookQ, setLookQ] = useState(() => createLookQuestion('all'));
  const [oddQ, setOddQ] = useState(() => createOddQuestion('all'));
  const [whereQ, setWhereQ] = useState(() => createWhereQuestion('all'));
  const [isAnswered, setIsAnswered] = useState(false);
  const [wrongItems, setWrongItems] = useState([]);

  const autoNextTimerRef = useRef(null);
  const wheel = useDirectionWheel();
  const { isSpinning, triggerWheelSpin, resetWheel } = wheel;

  useEffect(() => {
    return () => clearTimeout(autoNextTimerRef.current);
  }, []);

  const nextQuestion = useCallback(
    (targetMode = mode, targetScope = scope) => {
      clearTimeout(autoNextTimerRef.current);
      setIsAnswered(false);
      setWrongItems([]);

      if (targetMode === 'look') {
        setLookQ((prev) => createLookQuestion(targetScope, prev.direction));
      } else if (targetMode === 'odd') {
        setOddQ((prev) => createOddQuestion(targetScope, prev.oddIndex));
      } else if (targetMode === 'where') {
        setWhereQ((prev) => createWhereQuestion(targetScope, prev.direction));
      }
    },
    [mode, scope]
  );

  const handleCorrectAnswer = useCallback(
    (targetMode = mode) => {
      setIsAnswered(true);
      setScore((s) => s + 1);
      playLockIn();
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = setTimeout(() => {
        nextQuestion(targetMode, scope);
      }, 1150);
    },
    [mode, scope, nextQuestion]
  );

  const handleDirectionChoice = useCallback(
    (chosenDir) => {
      if (isAnswered || wrongItems.includes(chosenDir)) return;
      const expected = mode === 'look' ? lookQ.direction : whereQ.direction;

      if (chosenDir === expected) {
        handleCorrectAnswer(mode);
      } else {
        setWrongItems((prev) => [...prev, chosenDir]);
        playWrong();
      }
    },
    [isAnswered, wrongItems, mode, lookQ.direction, whereQ.direction, handleCorrectAnswer]
  );

  const handleOddCardSelect = (card) => {
    if (isAnswered || wrongItems.includes(card.index)) return;
    if (card.isOdd) {
      handleCorrectAnswer('odd');
    } else {
      setWrongItems((prev) => [...prev, card.index]);
      playWrong();
    }
  };

  // Klavye ok tuşlarıyla da oynanabilir
  useEffect(() => {
    const onKeyDown = (e) => {
      if (mode !== 'look' && mode !== 'where') return;
      const keyMap = {
        ArrowUp: 'up',
        ArrowRight: 'right',
        ArrowDown: 'down',
        ArrowLeft: 'left',
      };
      const dir = keyMap[e.key];
      if (!dir || !getAllowedDirections(scope).includes(dir)) return;
      e.preventDefault();
      handleDirectionChoice(dir);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, scope, handleDirectionChoice]);

  const handleFinish = () => {
    if (isSpinning) return;
    clearTimeout(autoNextTimerRef.current);
    setCompleted(true);
    playCelebration();
    launchDomConfetti(DIRECTIONS.map((d) => d.color));
  };

  const handleReset = () => {
    if (isSpinning) return;
    playClick();
    setCompleted(false);
    setScore(0);
    resetWheel();
    nextQuestion(mode, scope);
  };

  return (
    <div className="app-shell">
      <DirectionsTopBar
        mode={mode}
        scope={scope}
        score={score}
        soundOn={soundOn}
        isSpinning={isSpinning}
        onBackToHome={onBackToHome}
        onChangeMode={(nextMode) => {
          setMode(nextMode);
          nextQuestion(nextMode, scope);
        }}
        onChangeScope={(nextScope) => {
          setScope(nextScope);
          nextQuestion(mode, nextScope);
        }}
        onToggleSound={setSoundOn}
        onReset={handleReset}
      />

      <main className="flex-1 min-h-0 flex items-center justify-center bg-white rounded-3xl border-2 border-slate-300 shadow-md p-4 md:p-6 relative overflow-y-auto">
        {mode === 'look' && (
          <LookStage
            question={lookQ}
            scope={scope}
            isAnswered={isAnswered}
            wrongDirs={wrongItems}
            onSelectDirection={handleDirectionChoice}
          />
        )}

        {mode === 'odd' && (
          <OddDirectionStage
            question={oddQ}
            isAnswered={isAnswered}
            wrongIndices={wrongItems}
            onSelectCard={handleOddCardSelect}
          />
        )}

        {mode === 'where' && (
          <WhereStage
            question={whereQ}
            scope={scope}
            isAnswered={isAnswered}
            wrongDirs={wrongItems}
            onSelectDirection={handleDirectionChoice}
          />
        )}

        {mode === 'wheel' && (
          <DirectionWheelStage
            wheelAngle={wheel.wheelAngle}
            wheelPreviewIdx={wheel.wheelPreviewIdx}
            isSpinning={isSpinning}
            hasSpunOnce={wheel.hasSpunOnce}
            onSpin={triggerWheelSpin}
          />
        )}
      </main>

      <footer className="bottom-action-bar">
        {mode === 'wheel' ? (
          <button
            type="button"
            disabled={isSpinning}
            onClick={triggerWheelSpin}
            className={`action-btn ${isSpinning ? 'is-spinning' : 'primary pulse-attention'}`}
          >
            {isSpinning ? '⏳ Dönüyor...' : '🎡 ÇARKI ÇEVİR'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playClick();
              nextQuestion(mode, scope);
            }}
            className={`action-btn ${isAnswered ? 'success' : 'primary'}`}
          >
            {isAnswered ? '➡️ SIRADAKİ SORU' : '🎲 FARKLI SORU'}
          </button>
        )}

        {!isSpinning && (
          <button
            type="button"
            onClick={handleFinish}
            className="action-btn celebrate"
            title="Etkinliği Bitir ve Kutla"
          >
            🏆 Bitir
          </button>
        )}
      </footer>

      {completed && (
        <CelebrationModal
          stars={3}
          heroIcon="🚀"
          targetIcon="⭐"
          message={
            mode === 'wheel'
              ? 'Tüm yön hareketlerini harika yaptınız!'
              : `Toplam ${score} yön sorusunu doğru buldun!`
          }
          nextLabel="🔄 Devam Et"
          onNext={() => {
            setCompleted(false);
            nextQuestion(mode, scope);
          }}
        />
      )}

      <div id="confetti-layer" aria-hidden="true" />
    </div>
  );
}
