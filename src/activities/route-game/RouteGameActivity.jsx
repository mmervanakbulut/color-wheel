import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playClick, playTick, playLockIn, playWrong, playCelebration, isSoundEnabled } from '../../utils/sound';
import { launchDomConfetti } from '../../utils/ui';
import { ROUTE_THEMES, DIRECTION_VECTORS, getPresetLevel, createVerifiedRandomLevel } from './config';
import RouteTopBar from './RouteTopBar';
import RouteBoard from './RouteBoard';
import RouteControls from './RouteControls';
import CelebrationModal from '../../components/CelebrationModal';
import './routeGame.css';

const MAX_QUEUE_STEPS = 24;

export default function RouteGameActivity({ onBackToHome }) {
  const [gameMode, setGameMode] = useState('instant'); // 'instant' (Tek Adım, Elmassız) | 'queue' (Elmaslı Algoritma)
  const [gridSize, setGridSize] = useState(5);
  const [withGems, setWithGems] = useState(true);
  const [levelIdx, setLevelIdx] = useState(0);
  const [level, setLevel] = useState(() => getPresetLevel(5, 0, false));
  const [themeId, setThemeId] = useState('cat');

  const [heroPos, setHeroPos] = useState(() => level.start);
  const [heroFacing, setHeroFacing] = useState('RIGHT');
  const [visitedCells, setVisitedCells] = useState(() => new Set([`${level.start.r}-${level.start.c}`]));
  const [collectedGems, setCollectedGems] = useState(() => new Set());
  const [isDizzy, setIsDizzy] = useState(false);
  const [collisionCellKey, setCollisionCellKey] = useState(null);
  const [warningText, setWarningText] = useState('');

  const [commandQueue, setCommandQueue] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeQueueIndex, setActiveQueueIndex] = useState(-1);
  const [errorQueueIndex, setErrorQueueIndex] = useState(-1);
  const [winInfo, setWinInfo] = useState(null);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const cancelRunRef = useRef(false);
  const warningTimerRef = useRef(null);
  const theme = ROUTE_THEMES.find((t) => t.id === themeId) || ROUTE_THEMES[0];
  const totalGems = level.gems?.size || 0;

  const resetBoardForLevel = useCallback((lvl, clearQueue = true) => {
    cancelRunRef.current = true;
    setIsExecuting(false);
    setHeroPos({ ...lvl.start });
    setHeroFacing(lvl.target.c < lvl.start.c ? 'LEFT' : 'RIGHT');
    setVisitedCells(new Set([`${lvl.start.r}-${lvl.start.c}`]));
    setCollectedGems(new Set());
    setIsDizzy(false); setCollisionCellKey(null); setWarningText('');
    setActiveQueueIndex(-1); setErrorQueueIndex(-1); setWinInfo(null);
    if (clearQueue) setCommandQueue([]);
  }, []);

  const loadPresetLevel = useCallback((nextSize, nextIdx, nextMode = gameMode, nextGems = withGems) => {
    const useGems = nextMode === 'queue' && nextGems;
    const nextLvl = getPresetLevel(nextSize, nextIdx, useGems);
    setGridSize(nextSize); setGameMode(nextMode); setWithGems(nextGems);
    setLevelIdx(nextLvl.index); setLevel(nextLvl);
    resetBoardForLevel(nextLvl, true);
  }, [gameMode, withGems, resetBoardForLevel]);

  const handleSurprise = () => {
    if (isExecuting) return;
    playClick();
    const surprise = createVerifiedRandomLevel(gridSize, gameMode === 'queue' && withGems);
    setLevel(surprise);
    resetBoardForLevel(surprise, true);
  };

  const showWarning = (msg) => {
    setWarningText(msg);
    clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => setWarningText(''), 2500);
  };

  // Tek Adım Modu: İlk basışta anında hareket eder
  const executeInstantStep = useCallback((dir) => {
    const vec = DIRECTION_VECTORS[dir];
    setHeroFacing(dir);
    const nr = heroPos.r + vec.dr;
    const nc = heroPos.c + vec.dc;
    const key = `${nr}-${nc}`;

    if (nr < 0 || nr >= level.size || nc < 0 || nc >= level.size) {
      setIsDizzy(true); playWrong(); showWarning('🚫 Harita sınırı! Başka bir yön seçelim.');
      return;
    }
    if (level.obstacles.has(key)) {
      setIsDizzy(true); setCollisionCellKey(key); playWrong();
      showWarning(`${theme.obstacleIcon} Dikkat! Bu yönde engel var!`);
      return;
    }
    setHeroPos({ r: nr, c: nc });
    setVisitedCells((prev) => new Set(prev).add(key));
    playTick(0.4);
    if (nr === level.target.r && nc === level.target.c) {
      playCelebration();
      launchDomConfetti(['#22C55E', '#38BDF8', '#FACC15', '#F43F5E', '#A855F7']);
      setWinInfo({ stars: 3, message: theme.winMessage });
    }
  }, [heroPos, level, theme]);

  const handleDirectionInput = useCallback((dir) => {
    if (isExecuting || winInfo) return;
    setIsDizzy(false); setCollisionCellKey(null); setErrorQueueIndex(-1);
    if (gameMode === 'instant') {
      executeInstantStep(dir);
    } else if (commandQueue.length >= MAX_QUEUE_STEPS) {
      playWrong(); showWarning(`En fazla ${MAX_QUEUE_STEPS} adım ekleyebilirsin!`);
    } else {
      playClick(); setCommandQueue((prev) => [...prev, dir]);
    }
  }, [isExecuting, winInfo, gameMode, commandQueue.length, executeInstantStep]);

  const runAlgorithmQueue = useCallback(async () => {
    if (isExecuting || commandQueue.length === 0) return;
    resetBoardForLevel(level, false);
    cancelRunRef.current = false;
    setIsExecuting(true);

    let currPos = { ...level.start };
    const foundGems = new Set();
    let failed = false;

    for (let i = 0; i < commandQueue.length; i++) {
      if (cancelRunRef.current) break;
      setActiveQueueIndex(i);
      await new Promise((res) => setTimeout(res, 420));
      if (cancelRunRef.current) break;

      const dir = commandQueue[i];
      const vec = DIRECTION_VECTORS[dir];
      setHeroFacing(dir);
      const nr = currPos.r + vec.dr;
      const nc = currPos.c + vec.dc;
      const key = `${nr}-${nc}`;

      if (nr < 0 || nr >= level.size || nc < 0 || nc >= level.size) {
        setIsDizzy(true); setErrorQueueIndex(i); playWrong();
        showWarning(`🚫 ${i + 1}. adımda harita dışına çıktın! O adımı düzelt.`);
        failed = true; break;
      }
      if (level.obstacles.has(key)) {
        setIsDizzy(true); setCollisionCellKey(key); setErrorQueueIndex(i); playWrong();
        showWarning(`${theme.obstacleIcon} ${i + 1}. adımda engele çarptın! O adımı silip düzelt.`);
        failed = true; break;
      }

      currPos = { r: nr, c: nc };
      setHeroPos(currPos);
      setVisitedCells((prev) => new Set(prev).add(key));

      if (level.gems?.has(key) && !foundGems.has(key)) {
        foundGems.add(key); setCollectedGems(new Set(foundGems)); playLockIn();
      } else {
        playTick(0.45);
      }

      if (nr === level.target.r && nc === level.target.c) {
        if (foundGems.size < totalGems) {
          playWrong(); setErrorQueueIndex(i);
          showWarning(`💎 Hedefe ulaştın ama ${totalGems - foundGems.size} elması unuttun! Önce elmasları topla!`);
          failed = true;
        } else {
          playCelebration();
          launchDomConfetti(['#22C55E', '#38BDF8', '#FACC15', '#F43F5E', '#A855F7']);
          setWinInfo({ stars: 3, message: theme.winMessage });
        }
        break;
      }
    }

    if (!failed && !cancelRunRef.current && (currPos.r !== level.target.r || currPos.c !== level.target.c)) {
      playWrong(); showWarning('🤔 Rota bitti ama henüz hedefe ulaşamadın! Birkaç adım daha ekle.');
    }
    setIsExecuting(false); setActiveQueueIndex(-1);
  }, [isExecuting, commandQueue, level, totalGems, theme, resetBoardForLevel]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const map = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
      if (map[e.key]) { e.preventDefault(); handleDirectionInput(map[e.key]); }
      else if (e.key === 'Enter' && gameMode === 'queue') runAlgorithmQueue();
      else if (e.key === 'Backspace' && gameMode === 'queue' && !isExecuting) setCommandQueue((q) => q.slice(0, -1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDirectionInput, gameMode, runAlgorithmQueue, isExecuting]);

  useEffect(() => () => { cancelRunRef.current = true; clearTimeout(warningTimerRef.current); }, []);

  return (
    <div className="app-shell">
      <RouteTopBar
        onBackToHome={onBackToHome} gameMode={gameMode}
        onChangeMode={(m) => { playClick(); loadPresetLevel(gridSize, levelIdx, m, withGems); }}
        withGems={withGems} onToggleGems={(val) => { playClick(); loadPresetLevel(gridSize, levelIdx, gameMode, val); }}
        gridSize={gridSize} onChangeSize={(s) => { playClick(); loadPresetLevel(s, 0, gameMode, withGems); }}
        themeId={themeId} onChangeTheme={setThemeId} levelTitle={level.title}
        onPrevLevel={() => { playClick(); loadPresetLevel(gridSize, levelIdx - 1, gameMode, withGems); }}
        onNextLevel={() => { playClick(); loadPresetLevel(gridSize, levelIdx + 1, gameMode, withGems); }}
        onSurprise={handleSurprise} soundOn={soundOn} onSoundChange={setSoundOn}
      />

      <main className={`flex-1 min-h-0 flex ${gameMode === 'queue' ? 'flex-col lg:flex-row' : 'flex-col'} items-center justify-center relative gap-4 px-2`}>
        {warningText && (
          <div className="absolute top-2 z-30 px-5 py-2.5 rounded-2xl bg-red-600 text-white font-black text-base shadow-lg border-2 border-red-200 animate-bounce">
            {warningText}
          </div>
        )}

        <RouteBoard
          level={level} theme={theme} gameMode={gameMode} heroPos={heroPos} heroFacing={heroFacing}
          visitedCells={visitedCells} collectedGems={collectedGems} isDizzy={isDizzy}
          collisionCellKey={collisionCellKey} canClickAdjacent={gameMode === 'instant' && !winInfo}
          onStepDirection={handleDirectionInput}
        />

        {gameMode === 'queue' && (
          <RouteControls
            gameMode={gameMode} theme={theme} totalGems={totalGems} collectedGemsCount={collectedGems.size}
            commandQueue={commandQueue} activeQueueIndex={activeQueueIndex} errorQueueIndex={errorQueueIndex}
            isExecuting={isExecuting} onDirectionClick={handleDirectionInput} onRunQueue={runAlgorithmQueue}
            onUndoStep={() => { playClick(); resetBoardForLevel(level, false); setCommandQueue((q) => q.slice(0, -1)); }}
            onRemoveQueueIndex={(idx) => { playClick(); resetBoardForLevel(level, false); setCommandQueue((q) => q.filter((_, i) => i !== idx)); }}
            onReset={() => { playClick(); resetBoardForLevel(level, true); }}
          />
        )}
      </main>

      {gameMode === 'instant' && (
        <RouteControls
          gameMode={gameMode} theme={theme} totalGems={0} collectedGemsCount={0}
          commandQueue={commandQueue} activeQueueIndex={-1} errorQueueIndex={-1} isExecuting={false}
          onDirectionClick={handleDirectionInput} onReset={() => { playClick(); resetBoardForLevel(level, true); }}
        />
      )}

      {winInfo && (
        <CelebrationModal
          stars={winInfo.stars} heroIcon={theme.heroIcon}
          targetIcon={gameMode === 'queue' && totalGems > 0 ? '💎' : theme.targetIcon}
          message={winInfo.message} nextLabel="▶️ Sıradaki Görev"
          onNext={() => { playLockIn(); loadPresetLevel(gridSize, levelIdx + 1, gameMode, withGems); }}
          onSurprise={handleSurprise}
        />
      )}

      <div id="confetti-layer" aria-hidden="true"></div>
    </div>
  );
}
