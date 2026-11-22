import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playClick, playTick, playLockIn, playWrong, playCelebration, isSoundEnabled, toggleSoundEnabled } from '../../utils/sound';
import { toggleFullscreen, launchDomConfetti } from '../../utils/ui';
import CelebrationModal from '../../components/CelebrationModal';
import { DEBUG_THEMES, DIR_META, LEVELS_EASY, LEVELS_MASTER, parseDebugLevel, createRandomDebugLevel } from './config';
import DebugBoard from './DebugBoard';
import DebugControls from './DebugControls';
import './debugCoding.css';

function findDefaultSelectedIdx(codeArr) {
  const nullIdx = codeArr.findIndex((c) => c === null);
  return nullIdx >= 0 ? nullIdx : 0;
}

export default function DebugCodingActivity({ onBackToHome }) {
  const [gridSize, setGridSize] = useState(5); // 5 (Kolay) | 6 (Usta)
  const [themeId, setThemeId] = useState('robot');
  const [levelIdx, setLevelIdx] = useState(0);
  const [surpriseLevel, setSurpriseLevel] = useState(null);

  const levels = gridSize === 5 ? LEVELS_EASY : LEVELS_MASTER;
  const activeLevel = surpriseLevel || parseDebugLevel(levels[levelIdx % levels.length]);
  const activeTheme = DEBUG_THEMES.find((t) => t.id === themeId) || DEBUG_THEMES[0];

  const [code, setCode] = useState(() => [...activeLevel.initialCode]);
  const [selectedIdx, setSelectedIdx] = useState(() => findDefaultSelectedIdx(activeLevel.initialCode));
  const [bugStepIdx, setBugStepIdx] = useState(null);
  const [runningIdx, setRunningIdx] = useState(null);

  const [heroPos, setHeroPos] = useState(() => activeLevel.start);
  const [visitedSet, setVisitedSet] = useState(() => new Set([`${activeLevel.start.r}-${activeLevel.start.c}`]));
  const [isRunning, setIsRunning] = useState(false);
  const [collisionKey, setCollisionKey] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const runTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(runTimerRef.current), []);

  const resetHeroToStart = useCallback((lvl) => {
    clearTimeout(runTimerRef.current);
    setIsRunning(false); setRunningIdx(null); setCollisionKey(null);
    setHeroPos(lvl.start);
    setVisitedSet(new Set([`${lvl.start.r}-${lvl.start.c}`]));
  }, []);

  const initLevelState = useCallback((parsed) => {
    setCode([...parsed.initialCode]);
    setSelectedIdx(findDefaultSelectedIdx(parsed.initialCode));
    setBugStepIdx(null); setStatusMsg(null); setSolved(false);
    resetHeroToStart(parsed);
  }, [resetHeroToStart]);

  const loadLevel = (idx, nextSize = gridSize) => {
    const list = nextSize === 5 ? LEVELS_EASY : LEVELS_MASTER;
    const safeIdx = ((idx % list.length) + list.length) % list.length;
    const parsed = parseDebugLevel(list[safeIdx]);
    setSurpriseLevel(null);
    setLevelIdx(safeIdx);
    initLevelState(parsed);
  };

  const handleSurprise = () => {
    playClick();
    const rand = createRandomDebugLevel(gridSize);
    setSurpriseLevel(rand);
    initLevelState(rand);
  };

  const handleSetDirection = (dirId) => {
    if (isRunning) return;
    playLockIn();
    setBugStepIdx(null);
    setStatusMsg(null);
    resetHeroToStart(activeLevel);
    setCode((prev) => {
      const next = prev.map((item, i) => (i === selectedIdx ? dirId : item));
      const nextEmpty = next.findIndex((c) => c === null);
      if (nextEmpty >= 0) setSelectedIdx(nextEmpty);
      return next;
    });
  };

  const handleAddEmptyStep = () => {
    if (isRunning || code.length >= 10) return;
    playClick();
    setBugStepIdx(null);
    resetHeroToStart(activeLevel);
    setCode((prev) => { const next = [...prev, null]; setSelectedIdx(next.length - 1); return next; });
  };

  const handleDeleteSelectedStep = () => {
    if (isRunning || code.length <= 1) return;
    playClick();
    setBugStepIdx(null);
    resetHeroToStart(activeLevel);
    setCode((prev) => {
      const next = prev.filter((_, i) => i !== selectedIdx);
      setSelectedIdx(Math.min(selectedIdx, next.length - 1));
      return next;
    });
  };

  const runInstructions = () => {
    if (isRunning) return;
    const emptyIdx = code.findIndex((c) => c === null);
    if (emptyIdx >= 0) {
      playWrong();
      setSelectedIdx(emptyIdx);
      setBugStepIdx(emptyIdx);
      setStatusMsg(`🐞 ${emptyIdx + 1}. adımdaki ❓ eksik yönü aşağıdan seç!`);
      return;
    }

    playClick();
    resetHeroToStart(activeLevel);
    setBugStepIdx(null);
    setStatusMsg(null);
    setIsRunning(true);

    let cur = { ...activeLevel.start };
    const trail = new Set([`${cur.r}-${cur.c}`]);
    let idx = 0;

    const stepTick = () => {
      if (idx >= code.length) {
        setIsRunning(false);
        setRunningIdx(null);
        if (cur.r === activeLevel.target.r && cur.c === activeLevel.target.c) {
          setSolved(true);
          setScore((s) => s + 1);
          playCelebration();
          launchDomConfetti();
        } else {
          playWrong();
          const lastIdx = code.length - 1;
          setBugStepIdx(lastIdx);
          setSelectedIdx(lastIdx);
          setStatusMsg('🐞 Hedefe ulaşamadı! Son adımı düzelt veya ➕ Adım Ekle / 🗑️ Fazla Adımı Sil!');
          runTimerRef.current = setTimeout(() => resetHeroToStart(activeLevel), 1200);
        }
        return;
      }

      setRunningIdx(idx);
      const meta = DIR_META[code[idx]];
      const nr = cur.r + meta.dr;
      const nc = cur.c + meta.dc;
      const nKey = `${nr}-${nc}`;

      if (nr < 0 || nr >= activeLevel.size || nc < 0 || nc >= activeLevel.size || activeLevel.obstacles.has(nKey)) {
        playWrong();
        setIsRunning(false);
        setRunningIdx(null);
        setCollisionKey(`${cur.r}-${cur.c}`);
        setBugStepIdx(idx);
        setSelectedIdx(idx);
        setStatusMsg(`🐞 ${idx + 1}. adımda (${meta.arrow}) engele çarptı! Aşağıdan doğru yönü seçerek düzelt!`);
        runTimerRef.current = setTimeout(() => resetHeroToStart(activeLevel), 1300);
        return;
      }

      cur = { r: nr, c: nc };
      trail.add(nKey);
      setHeroPos(cur);
      setVisitedSet(new Set(trail));
      playTick(Math.min(1, (idx + 1) / code.length));
      idx += 1;
      runTimerRef.current = setTimeout(stepTick, 380);
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
            {DEBUG_THEMES.map((t) => (
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
          <button type="button" onClick={() => { playClick(); initLevelState(activeLevel); }} className="icon-pill-btn">🔄</button>
          <button type="button" onClick={toggleFullscreen} className="icon-pill-btn">⛶</button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col items-center justify-between gap-2 bg-white rounded-3xl border-2 border-slate-300 shadow-md p-3 md:p-4 relative overflow-y-auto">
        <div className={`px-4 py-1 rounded-full border font-black text-xs sm:text-sm text-center ${bugStepIdx !== null ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          {statusMsg || `🐞 ${activeLevel.hint}`}
        </div>

        <DebugBoard size={activeLevel.size} heroPos={heroPos} targetPos={activeLevel.target} obstacles={activeLevel.obstacles} visitedSet={visitedSet} collisionKey={collisionKey} theme={activeTheme} />

        <DebugControls
          code={code} selectedIdx={selectedIdx} runningIdx={runningIdx} bugStepIdx={bugStepIdx} isRunning={isRunning}
          onSelectStep={(idx) => { playClick(); setSelectedIdx(idx); }} onSetDirection={handleSetDirection}
          onAddEmptyStep={handleAddEmptyStep} onDeleteSelectedStep={handleDeleteSelectedStep}
          onRestoreInitial={() => { playClick(); initLevelState(activeLevel); }} onRun={runInstructions}
        />
      </main>

      {solved && (
        <CelebrationModal
          stars={3} heroIcon="🐞" targetIcon="✅"
          message="Harika! Yönergedeki hatayı bulup düzelttin ve hedefe ulaştın!"
          nextLabel="➡️ Sıradaki Görev"
          onNext={() => { playClick(); loadLevel(levelIdx + 1); }}
          onSurprise={handleSurprise}
        />
      )}

      <div id="confetti-layer" aria-hidden="true" />
    </div>
  );
}
