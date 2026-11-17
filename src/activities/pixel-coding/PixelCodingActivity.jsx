import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playClick, playLockIn, playWrong, playCelebration, isSoundEnabled } from '../../utils/sound';
import { launchDomConfetti } from '../../utils/ui';
import CelebrationModal from '../../components/CelebrationModal';
import {
  PIXEL_COLORS,
  EASY_PATTERNS,
  MASTER_PATTERNS,
  createEmptyGrid,
  getUsedColorCodes,
  remixPatternColors,
  createSurprisePattern,
} from './config';
import PixelTopBar from './PixelTopBar';
import PixelPalette from './PixelPalette';
import PixelBoardStage from './PixelBoardStage';
import './pixelCoding.css';

function isGridSolved(userGrid, targetGrid) {
  return targetGrid.every((row, r) => row.every((val, c) => userGrid[r]?.[c] === val));
}

function findFirstMismatch(userGrid, targetGrid) {
  for (let r = 0; r < targetGrid.length; r++) {
    for (let c = 0; c < targetGrid.length; c++) {
      if (userGrid[r][c] !== targetGrid[r][c]) return `${r}-${c}`;
    }
  }
  return null;
}

export default function PixelCodingActivity({ onBackToHome }) {
  const [mode, setMode] = useState('copy');
  const [gridSize, setGridSize] = useState(4);
  const [levelIdx, setLevelIdx] = useState(0);
  const [surprisePattern, setSurprisePattern] = useState(null);
  const [userGrid, setUserGrid] = useState(() => createEmptyGrid(4));
  const [selectedCode, setSelectedCode] = useState(() => getUsedColorCodes(EASY_PATTERNS[0].grid)[0] || 1);
  const [errorCellKey, setErrorCellKey] = useState(null);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const errTimerRef = useRef(null);
  const patterns = gridSize === 4 ? EASY_PATTERNS : MASTER_PATTERNS;
  const activePattern = surprisePattern || patterns[levelIdx % patterns.length];
  const usedCodes = mode === 'free' ? PIXEL_COLORS.map((c) => c.code) : getUsedColorCodes(activePattern.grid);

  useEffect(() => () => clearTimeout(errTimerRef.current), []);

  const flashErrorCell = (key) => {
    clearTimeout(errTimerRef.current);
    setErrorCellKey(key);
    errTimerRef.current = setTimeout(() => setErrorCellKey(null), 500);
  };

  const resetBoardFor = useCallback((nextSize, nextPat, nextMode = mode) => {
    setUserGrid(createEmptyGrid(nextSize));
    setSolved(false);
    setErrorCellKey(null);
    const nextUsed = nextMode === 'free' ? [1] : getUsedColorCodes(nextPat.grid);
    setSelectedCode(nextUsed[0] || 1);
  }, [mode]);

  const loadLevel = (idx, nextSize = gridSize) => {
    const list = nextSize === 4 ? EASY_PATTERNS : MASTER_PATTERNS;
    const safeIdx = ((idx % list.length) + list.length) % list.length;
    setSurprisePattern(null);
    setLevelIdx(safeIdx);
    resetBoardFor(nextSize, list[safeIdx]);
  };

  const handleSurprise = () => {
    playClick();
    const nextPat = createSurprisePattern(gridSize);
    setSurprisePattern(nextPat);
    resetBoardFor(gridSize, nextPat);
  };

  const handleRemixColors = () => {
    playClick();
    const nextPat = remixPatternColors(activePattern);
    setSurprisePattern(nextPat);
    resetBoardFor(gridSize, nextPat);
  };

  const handleCellClick = (r, c) => {
    if (solved && mode !== 'free') return;

    if (mode === 'decode') {
      const expected = activePattern.grid[r][c];
      if (expected === 0 || expected !== selectedCode) {
        playWrong();
        flashErrorCell(`${r}-${c}`);
        return;
      }
      if (userGrid[r][c] === expected) return;
    }

    playClick();
    const nextGrid = userGrid.map((row, ri) =>
      ri === r
        ? row.map((cell, ci) => {
            if (ci !== c) return cell;
            if (mode === 'decode') return selectedCode;
            return cell === selectedCode ? 0 : selectedCode;
          })
        : row
    );
    setUserGrid(nextGrid);

    if (mode !== 'free' && isGridSolved(nextGrid, activePattern.grid)) {
      setSolved(true);
      setScore((s) => s + 1);
      playCelebration();
      launchDomConfetti(PIXEL_COLORS.map((c) => c.hex));
    }
  };

  const handleHintCheck = () => {
    if (mode === 'free') return;
    const mismatchKey = findFirstMismatch(userGrid, activePattern.grid);
    if (mismatchKey) {
      playWrong();
      flashErrorCell(mismatchKey);
    } else {
      playLockIn();
    }
  };

  return (
    <div className="app-shell">
      <PixelTopBar
        mode={mode}
        gridSize={gridSize}
        levelIndex={levelIdx}
        totalLevels={patterns.length}
        isSurprise={Boolean(surprisePattern)}
        score={score}
        soundOn={soundOn}
        onBackToHome={onBackToHome}
        onChangeMode={(nextMode) => {
          setMode(nextMode);
          resetBoardFor(gridSize, activePattern, nextMode);
        }}
        onChangeGridSize={(nextSize) => {
          setGridSize(nextSize);
          loadLevel(0, nextSize);
        }}
        onPrevLevel={() => { playClick(); loadLevel(levelIdx - 1); }}
        onNextLevel={() => { playClick(); loadLevel(levelIdx + 1); }}
        onToggleSound={setSoundOn}
        onReset={() => {
          playClick();
          resetBoardFor(gridSize, activePattern);
        }}
      />

      <main className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border-2 border-slate-300 shadow-md p-4 md:p-6 relative overflow-y-auto">
        <PixelBoardStage
          mode={mode}
          pattern={activePattern}
          userGrid={userGrid}
          errorCellKey={errorCellKey}
          onCellClick={handleCellClick}
        />

        <PixelPalette
          mode={mode}
          usedCodes={usedCodes}
          selectedCode={selectedCode}
          onSelectCode={(code) => {
            playClick();
            setSelectedCode(code);
          }}
        />
      </main>

      <footer className="bottom-action-bar">
        {mode !== 'free' ? (
          <>
            <button type="button" onClick={handleHintCheck} className="action-btn subtle">
              💡 Kontrol Et
            </button>
            <button type="button" onClick={handleRemixColors} className="action-btn secondary">
              🎨 Renk Değiştir
            </button>
            <button type="button" onClick={handleSurprise} className="action-btn primary">
              🎲 Sürpriz Desen
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              playCelebration();
              launchDomConfetti(PIXEL_COLORS.map((c) => c.hex));
            }}
            className="action-btn celebrate"
          >
            🎉 Eserimi Kutla!
          </button>
        )}
      </footer>

      {solved && (
        <CelebrationModal
          stars={3}
          heroIcon={activePattern.icon}
          targetIcon="🎨"
          message={`Harika! "${activePattern.title}" piksel kodlamasını tamamladın!`}
          nextLabel="➡️ Sıradaki Desen"
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
