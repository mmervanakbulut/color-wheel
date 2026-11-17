import React from 'react';
import { COLOR_BY_CODE } from './config';

function PixelGrid({
  grid,
  targetGrid,
  mode,
  readOnly = false,
  errorCellKey,
  cellSizeClass,
  onCellClick,
}) {
  const cols = grid.length;

  return (
    <div className="pixel-grid-frame">
      <div
        className="pixel-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => {
            const key = `${r}-${c}`;
            const targetVal = targetGrid?.[r]?.[c] ?? 0;
            const colorObj = COLOR_BY_CODE[val];
            const isBlankTarget = mode === 'decode' && targetVal === 0;
            const isWrongFlash = errorCellKey === key;

            return (
              <button
                key={key}
                type="button"
                disabled={readOnly}
                onClick={() => !readOnly && onCellClick?.(r, c)}
                className={`pixel-cell ${cellSizeClass} ${
                  readOnly ? 'is-readonly' : ''
                } ${isWrongFlash ? 'is-error-shake' : ''}`}
                style={{
                  backgroundColor: colorObj
                    ? colorObj.hex
                    : isBlankTarget
                    ? '#F1F5F9'
                    : '#FFFFFF',
                  borderColor: colorObj
                    ? colorObj.border
                    : isBlankTarget
                    ? '#E2E8F0'
                    : '#CBD5E1',
                  color: colorObj ? colorObj.text : '#334155',
                }}
              >
                {mode === 'decode' && !readOnly && val === 0 && targetVal > 0 && (
                  <span className="text-xl sm:text-2xl font-black text-slate-700">
                    {targetVal}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function PixelBoardStage({
  mode,
  pattern,
  userGrid,
  errorCellKey,
  onCellClick,
}) {
  const size = userGrid.length;
  const refCellSize =
    size === 5 ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-12 h-12 sm:w-14 sm:h-14';
  const copyEditSize =
    size === 5 ? 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16' : 'w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18';
  const soloEditSize =
    size === 5 ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-16 h-16 sm:w-20 sm:h-20';

  if (mode === 'copy') {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        <div className="flex flex-col items-center gap-2">
          <span className="px-4 py-1 rounded-full bg-sky-50 border border-sky-200 font-black text-sky-900 text-sm sm:text-base">
            👀 Örnek: {pattern.icon} {pattern.title}
          </span>
          <PixelGrid
            grid={pattern.grid}
            mode="copy"
            readOnly
            cellSizeClass={refCellSize}
          />
        </div>

        <div className="text-3xl font-black text-slate-400 hidden md:block">➡️</div>

        <div className="flex flex-col items-center gap-2">
          <span className="px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-black text-emerald-900 text-sm sm:text-base">
            ✏️ Aynısını Boya
          </span>
          <PixelGrid
            grid={userGrid}
            mode="copy"
            errorCellKey={errorCellKey}
            cellSizeClass={copyEditSize}
            onCellClick={onCellClick}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <div className="px-5 py-1.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-900 font-black text-base sm:text-lg text-center">
        {mode === 'decode'
          ? '🔢 Aşağıdan Renk Kodunu Seç ve Aynı Sayılı Kareleri Boya!'
          : '🎨 Kendi Piksel Resmini Tasarla!'}
      </div>

      <PixelGrid
        grid={userGrid}
        targetGrid={mode === 'decode' ? pattern.grid : null}
        mode={mode}
        errorCellKey={errorCellKey}
        cellSizeClass={soloEditSize}
        onCellClick={onCellClick}
      />
    </div>
  );
}
