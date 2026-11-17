import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playClick,
  playTick,
  playLockIn,
  playWrong,
  playCelebration,
  isSoundEnabled,
} from '../../utils/sound';
import { launchDomConfetti } from '../../utils/ui';
import {
  ROUTE_THEMES,
  DIRECTION_VECTORS,
  getPresetLevel,
  createVerifiedRandomLevel,
} from './config';
import RouteTopBar from './RouteTopBar';
import RouteBoard from './RouteBoard';
import RouteControls from './RouteControls';
import CelebrationModal from '../../components/CelebrationModal';
import './routeGame.css';

export default function RouteGameActivity({ onBackToHome }) {
  const [gridSize, setGridSize] = useState(8);
  const [levelIdx, setLevelIdx] = useState(0);
  const [level, setLevel] = useState(() => getPresetLevel(8, 0));
  const [themeId, setThemeId] = useState('cat');
  const [gameMode, setGameMode] = useState('instant');

  const [heroPos, setHeroPos] = useState(() => level.start);
  const [heroFacing, setHeroFacing] = useState('RIGHT');
  const [visitedCells, setVisitedCells] = useState(() => new Set([`${level.start.r}-${level.start.c}`]));
  const [isDizzy, setIsDizzy] = useState(false);
  const [collisionCellKey, setCollisionCellKey] = useState(null);
  const [warningText, setWarningText] = useState('');

  const [commandQueue, setCommandQueue] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeQueueIndex, setActiveQueueIndex] = useState(-1);
  const [errorQueueIndex, setErrorQueueIndex] = useState(-1);
  const [stepsTaken, setStepsTaken] = useState(0);
  const [winInfo, setWinInfo] = useState(null);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const cancelRunRef = useRef(false);
  const warningTimerRef = useRef(null);
  const theme = ROUTE_THEMES.find((t) => t.id === themeId) || ROUTE_THEMES[0];

  const resetBoardForLevel = useCallback((lvl, clearQueue = true) => {
    cancelRunRef.current = true;
    setIsExecuting(false);
    setHeroPos({ ...lvl.start });
    setHeroFacing(lvl.target.c < lvl.start.c ? 'LEFT' : 'RIGHT');
    setVisitedCells(new Set([`${lvl.start.r}-${lvl.start.c}`]));
    setIsDizzy(false);
    setCollisionCellKey(null);
    setWarningText('');
    setActiveQueueIndex(-1);
    setErrorQueueIndex(-1);
    setStepsTaken(0);
    setWinInfo(null);
    if (clearQueue) setCommandQueue([]);
  }, []);

  const loadPresetLevel = useCallback(
    (nextSize, nextIdx) => {
      const nextLvl = getPresetLevel(nextSize, nextIdx);
      setGridSize(nextSize);
      setLevelIdx(nextLvl.index);
      setLevel(nextLvl);
      resetBoardForLevel(nextLvl, true);
    },
    [resetBoardForLevel]
  );

  const handleSurprise = () => {
    if (isExecuting) return;
    playClick();
    const surprise = createVerifiedRandomLevel(gridSize);
    setLevel(surprise);
    resetBoardForLevel(surprise, true);
  };

  const showWarning = (msg) => {
    setWarningText(msg);
    clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => setWarningText(''), 2200);
  };

  const executeStep = useCallback(
    (dir, posRef, stepsRef, stepIdx = -1) => {
      const vec = DIRECTION_VECTORS[dir];
      setHeroFacing(dir);
      const nr = posRef.current.r + vec.dr;
      const nc = posRef.current.c + vec.dc;
      const key = `${nr}-${nc}`;

      if (nr < 0 || nr >= level.size || nc < 0 || nc >= level.size) {
        setIsDizzy(true);
        setCollisionCellKey(null);
        setErrorQueueIndex(stepIdx);
        playWrong();
        showWarning('🚫 Harita sınırı! Başka bir yön seçelim.');
        return false;
      }

      if (level.obstacles.has(key)) {
        setIsDizzy(true);
        setCollisionCellKey(key);
        setErrorQueueIndex(stepIdx);
        playWrong();
        showWarning(`${theme.obstacleIcon} Dikkat! Bu yönde engel var!`);
        return false;
      }

      posRef.current = { r: nr, c: nc };
      stepsRef.current += 1;
      setHeroPos({ r: nr, c: nc });
      setVisitedCells((prev) => new Set(prev).add(key));
      setStepsTaken(stepsRef.current);
      playTick(0.4);

      if (nr === level.target.r && nc === level.target.c) {
        const optimal = level.optimalSteps || 3;
        const stars = stepsRef.current <= optimal + 4 ? 3 : 2;
        playCelebration();
        launchDomConfetti(['#22C55E', '#38BDF8', '#FACC15', '#F43F5E', '#A855F7']);
        setWinInfo({ stars, message: theme.winMessage });
      }
      return true;
    },
    [level, theme]
  );

  const handleDirectionInput = useCallback(
    (dir) => {
      if (isExecuting || winInfo) return;
      setIsDizzy(false);
      setCollisionCellKey(null);
      setErrorQueueIndex(-1);

      if (gameMode === 'instant') {
        executeStep(dir, { current: { ...heroPos } }, { current: stepsTaken }, -1);
      } else if (commandQueue.length < 16) {
        playClick();
        setHeroFacing(dir);
        setCommandQueue((prev) => [...prev, dir]);
      }
    },
    [isExecuting, winInfo, gameMode, heroPos, stepsTaken, commandQueue.length, executeStep]
  );

  const runAlgorithmQueue = useCallback(async () => {
    if (isExecuting || commandQueue.length === 0) return;
    resetBoardForLevel(level, false);
    cancelRunRef.current = false;
    setIsExecuting(true);

    const posRef = { current: { ...level.start } };
    const stepsRef = { current: 0 };

    for (let i = 0; i < commandQueue.length; i++) {
      if (cancelRunRef.current) break;
      setActiveQueueIndex(i);
      await new Promise((res) => setTimeout(res, 450));
      if (cancelRunRef.current) break;

      const ok = executeStep(commandQueue[i], posRef, stepsRef, i);
      if (!ok || (posRef.current.r === level.target.r && posRef.current.c === level.target.c)) break;
    }

    setIsExecuting(false);
    setActiveQueueIndex(-1);
  }, [isExecuting, commandQueue, level, resetBoardForLevel, executeStep]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const map = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
      if (map[e.key]) {
        e.preventDefault();
        handleDirectionInput(map[e.key]);
      } else if (e.key === 'Enter' && gameMode === 'queue') {
        runAlgorithmQueue();
      } else if (e.key === 'Backspace' && gameMode === 'queue' && !isExecuting) {
        setCommandQueue((q) => q.slice(0, -1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDirectionInput, gameMode, runAlgorithmQueue, isExecuting]);

  useEffect(() => () => { cancelRunRef.current = true; clearTimeout(warningTimerRef.current); }, []);

  return (
    <div className="app-shell">
      <RouteTopBar
        onBackToHome={onBackToHome}
        gameMode={gameMode}
        onChangeMode={(m) => { playClick(); setGameMode(m); resetBoardForLevel(level, true); }}
        gridSize={gridSize}
        onChangeSize={(s) => { playClick(); loadPresetLevel(s, 0); }}
        themeId={themeId}
        onChangeTheme={setThemeId}
        levelTitle={level.title}
        onPrevLevel={() => { playClick(); loadPresetLevel(gridSize, levelIdx - 1); }}
        onNextLevel={() => { playClick(); loadPresetLevel(gridSize, levelIdx + 1); }}
        onSurprise={handleSurprise}
        soundOn={soundOn}
        onSoundChange={setSoundOn}
      />

      <main className="flex-1 min-h-0 flex flex-col items-center justify-center relative gap-2">
        {warningText && (
          <div className="absolute top-2 z-20 px-5 py-2.5 rounded-2xl bg-red-600 text-white font-black text-base shadow-lg border-2 border-red-200 animate-bounce">
            {warningText}
          </div>
        )}
        <RouteBoard
          level={level}
          theme={theme}
          gameMode={gameMode}
          heroPos={heroPos}
          heroFacing={heroFacing}
          visitedCells={visitedCells}
          isDizzy={isDizzy}
          collisionCellKey={collisionCellKey}
          canClickAdjacent={gameMode === 'instant' && !isExecuting && !winInfo}
          onStepDirection={handleDirectionInput}
        />
      </main>

      <RouteControls
        gameMode={gameMode}
        commandQueue={commandQueue}
        activeQueueIndex={activeQueueIndex}
        errorQueueIndex={errorQueueIndex}
        isExecuting={isExecuting}
        onDirectionClick={handleDirectionInput}
        onRunQueue={runAlgorithmQueue}
        onUndoStep={() => { playClick(); setCommandQueue((q) => q.slice(0, -1)); }}
        onRemoveQueueIndex={(idx) => { playClick(); setCommandQueue((q) => q.filter((_, i) => i !== idx)); }}
        onReset={() => { playClick(); resetBoardForLevel(level, true); }}
      />

      {winInfo && (
        <CelebrationModal
          stars={winInfo.stars}
          heroIcon={theme.heroIcon}
          targetIcon={theme.targetIcon}
          message={winInfo.message}
          nextLabel="▶️ Sıradaki Görev"
          onNext={() => { playLockIn(); loadPresetLevel(gridSize, levelIdx + 1); }}
          onSurprise={handleSurprise}
        />
      )}

      <div id="confetti-layer" aria-hidden="true"></div>
    </div>
  );
}
