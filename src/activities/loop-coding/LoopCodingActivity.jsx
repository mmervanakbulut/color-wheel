import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playClick, playTick, playLockIn, playWrong, playCelebration, isSoundEnabled, toggleSoundEnabled } from '../../utils/sound';
import { toggleFullscreen, launchDomConfetti } from '../../utils/ui';
import CelebrationModal from '../../components/CelebrationModal';
import { LOOP_THEMES, DIR_META, LEVELS_5X5, LEVELS_6X6, parseLoopLevel, createRandomLoopLevel, expandProgramToSteps } from './config';
import LoopBoard from './LoopBoard';
import LoopControls from './LoopControls';
import './loopCoding.css';

export default function LoopCodingActivity({ onBackToHome }) {
  const [gridSize, setGridSize] = useState(5); // 5 (Kolay) | 6 (Usta)
  const [themeId, setThemeId] = useState('frog');
  const [levelIdx, setLevelIdx] = useState(0);
  const [surpriseLevel, setSurpriseLevel] = useState(null);

  const levels = gridSize === 5 ? LEVELS_5X5 : LEVELS_6X6;
  const rawLevel = levels[levelIdx % levels.length];
  const activeLevel = surpriseLevel || { ...parseLoopLevel(rawLevel.grid), hint: rawLevel.hint };
  const activeTheme = LOOP_THEMES.find((t) => t.id === themeId) || LOOP_THEMES[0];

  const [heroPos, setHeroPos] = useState(() => activeLevel.start);
  const [visitedSet, setVisitedSet] = useState(() => new Set([`${activeLevel.start.r}-${activeLevel.start.c}`]));
  const [groups, setGroups] = useState([]);
  const [draftDirs, setDraftDirs] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [activeStepInfo, setActiveStepInfo] = useState(null);
  const [collisionKey, setCollisionKey] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const runTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(runTimerRef.current), []);

  const resetHeroToStart = useCallback((lvl) => {
    clearTimeout(runTimerRef.current);
    setIsRunning(false);
    setActiveStepInfo(null);
    setCollisionKey(null);
    setHeroPos(lvl.start);
    setVisitedSet(new Set([`${lvl.start.r}-${lvl.start.c}`]));
  }, []);

  const loadLevel = (idx, nextSize = gridSize) => {
    const list = nextSize === 5 ? LEVELS_5X5 : LEVELS_6X6;
    const safeIdx = ((idx % list.length) + list.length) % list.length;
    const parsed = { ...parseLoopLevel(list[safeIdx].grid), hint: list[safeIdx].hint };
    setSurpriseLevel(null);
    setLevelIdx(safeIdx);
    setGroups([]);
    setDraftDirs([]);
    setStatusMsg(null);
    setSolved(false);
    resetHeroToStart(parsed);
  };

  const handleSurprise = () => {
    playClick();
    const rand = createRandomLoopLevel(gridSize);
    setSurpriseLevel(rand);
    setGroups([]);
    setDraftDirs([]);
    setStatusMsg(null);
    setSolved(false);
    resetHeroToStart(rand);
  };

  // 1. Adım: Yön butonuna basıldığında taslak gruba ekle
  const handleAddDraftDir = (dir) => {
    if (isRunning || draftDirs.length >= 4) return;
    playClick();
    setStatusMsg(null);
    setDraftDirs((prev) => [...prev, dir]);
  };

  // 2. Adım: Tekrar sayısına (1x..5x) basıldığında taslak yönleri döngü grubuna dönüştür
  const handleCommitGroup = (repeatCount) => {
    if (isRunning || draftDirs.length === 0) return;
    playLockIn();
    setStatusMsg(null);
    setGroups((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, dirs: draftDirs, count: repeatCount }]);
    setDraftDirs([]);
  };

  const handleCycleGroupCount = (gIdx) => {
    if (isRunning) return;
    playClick();
    setGroups((prev) => prev.map((g, i) => (i === gIdx ? { ...g, count: (g.count % 5) + 1 } : g)));
  };

  const runProgram = () => {
    if (isRunning) return;
    if (draftDirs.length > 0) {
      playWrong();
      setStatusMsg('👆 Önce seçtiğin yönlerin kaç kere tekrar edeceğini (2×, 3×, 4×) seç!');
      return;
    }
    if (groups.length === 0) return;

    playClick();
    resetHeroToStart(activeLevel);
    setStatusMsg(null);
    setIsRunning(true);

    const steps = expandProgramToSteps(groups);
    let cur = { ...activeLevel.start };
    const trail = new Set([`${cur.r}-${cur.c}`]);
    let idx = 0;

    const stepTick = () => {
      if (idx >= steps.length) {
        setIsRunning(false);
        setActiveStepInfo(null);
        if (cur.r === activeLevel.target.r && cur.c === activeLevel.target.c) {
          setSolved(true);
          setScore((s) => s + 1);
          playCelebration();
          launchDomConfetti();
        } else {
          playWrong();
          setStatusMsg('Hedefe henüz ulaşamadın! Yeni bir döngü grubu ekle veya tekrar sayısını değiştir.');
          runTimerRef.current = setTimeout(() => resetHeroToStart(activeLevel), 1100);
        }
        return;
      }

      const step = steps[idx];
      setActiveStepInfo(step);
      const meta = DIR_META[step.dir];
      const nr = cur.r + meta.dr;
      const nc = cur.c + meta.dc;
      const nKey = `${nr}-${nc}`;

      if (nr < 0 || nr >= activeLevel.size || nc < 0 || nc >= activeLevel.size || activeLevel.obstacles.has(nKey)) {
        playWrong();
        setCollisionKey(`${cur.r}-${cur.c}`);
        setStatusMsg('💥 Engele veya duvara çarptın! Döngü tekrar sayısını kontrol et.');
        runTimerRef.current = setTimeout(() => resetHeroToStart(activeLevel), 1100);
        return;
      }

      cur = { r: nr, c: nc };
      trail.add(nKey);
      setHeroPos(cur);
      setVisitedSet(new Set(trail));
      playTick(Math.min(1, (idx + 1) / steps.length));
      idx += 1;
      runTimerRef.current = setTimeout(stepTick, 360);
    };

    runTimerRef.current = setTimeout(stepTick, 260);
  };

  return (
    <div className="app-shell">
      <header className="top-toolbar">
        <div className="toolbar-group">
          <button type="button" onClick={() => { playClick(); onBackToHome?.(); }} className="icon-pill-btn">
            🏠 <span>Etkinlikler</span>
          </button>

          <div className="segmented-control">
            {[5, 6].map((sz) => (
              <button key={sz} type="button" className={`seg-btn ${gridSize === sz ? 'active' : ''}`} onClick={() => { playClick(); setGridSize(sz); loadLevel(0, sz); }}>
                {sz === 5 ? '5×5 Kolay' : '6×6 Usta'}
              </button>
            ))}
          </div>

          <div className="segmented-control">
            {LOOP_THEMES.map((t) => (
              <button key={t.id} type="button" className={`seg-btn ${themeId === t.id ? 'active' : ''}`} onClick={() => { playClick(); setThemeId(t.id); }} title={t.name}>
                {t.hero}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-group">
          <div className="segmented-control">
            <button type="button" className="seg-btn" onClick={() => { playClick(); loadLevel(levelIdx - 1); }}>◀</button>
            <span className="px-2.5 py-1 text-xs font-black text-slate-700 self-center">
              {surpriseLevel ? '🎲 Sürpriz' : `Görev ${levelIdx + 1}/${levels.length}`}
            </span>
            <button type="button" className="seg-btn" onClick={() => { playClick(); loadLevel(levelIdx + 1); }}>▶</button>
          </div>
          <button type="button" onClick={handleSurprise} className="icon-pill-btn accent">🎲 Sürpriz</button>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 font-black text-sm text-amber-900">⭐ {score}</span>
        </div>

        <div className="toolbar-group">
          <button type="button" onClick={() => { const next = toggleSoundEnabled(); setSoundOn(next); if (next) playClick(); }} className={`icon-pill-btn ${!soundOn ? 'is-muted' : ''}`}>
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button type="button" onClick={() => { playClick(); setGroups([]); setDraftDirs([]); resetHeroToStart(activeLevel); }} className="icon-pill-btn">🔄</button>
          <button type="button" onClick={toggleFullscreen} className="icon-pill-btn">⛶</button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col items-center justify-between gap-2 bg-white rounded-3xl border-2 border-slate-300 shadow-md p-3 md:p-4 relative overflow-y-auto">
        <div className="px-4 py-1 rounded-full bg-indigo-50 border border-indigo-200 font-black text-indigo-900 text-xs sm:text-sm text-center">
          {statusMsg || `💡 ${activeLevel.hint}`}
        </div>

        <LoopBoard
          size={activeLevel.size}
          heroPos={heroPos}
          targetPos={activeLevel.target}
          obstacles={activeLevel.obstacles}
          visitedSet={visitedSet}
          collisionKey={collisionKey}
          theme={activeTheme}
        />

        <LoopControls
          groups={groups}
          draftDirs={draftDirs}
          isRunning={isRunning}
          activeStepInfo={activeStepInfo}
          onAddDraftDir={handleAddDraftDir}
          onPopDraftDir={() => { playClick(); setDraftDirs((prev) => prev.slice(0, -1)); }}
          onCommitGroup={handleCommitGroup}
          onCycleGroupCount={handleCycleGroupCount}
          onRemoveLastGroup={() => { playClick(); setGroups((prev) => prev.slice(0, -1)); resetHeroToStart(activeLevel); }}
          onClearAll={() => { playClick(); setGroups([]); setDraftDirs([]); resetHeroToStart(activeLevel); }}
          onRun={runProgram}
        />
      </main>

      {solved && (
        <CelebrationModal
          stars={3}
          heroIcon={activeTheme.hero}
          targetIcon={activeTheme.target}
          message={`Harika! Sadece ${groups.length} döngü grubu kullanarak hedefe ulaştın!`}
          nextLabel="➡️ Sıradaki Görev"
          onNext={() => { playClick(); loadLevel(levelIdx + 1); }}
          onSurprise={handleSurprise}
        />
      )}

      <div id="confetti-layer" aria-hidden="true" />
    </div>
  );
}
