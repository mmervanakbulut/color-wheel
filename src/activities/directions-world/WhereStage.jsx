import React from 'react';
import { DIRECTION_MAP, getAllowedDirections } from './config';

export default function WhereStage({
  question,
  scope = 'all',
  isAnswered,
  wrongDirs,
  onSelectDirection,
}) {
  const targetDir = DIRECTION_MAP[question.direction];
  const allowedDirs = getAllowedDirections(scope).map((id) => DIRECTION_MAP[id]);
  const showUD = scope === 'all' || scope === 'ud';
  const showLR = scope === 'all' || scope === 'lr';

  const renderSlot = (slotId) => {
    const isOccupied = question.direction === slotId;
    return (
      <div
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-3 flex items-center justify-center transition-all ${
          isOccupied
            ? isAnswered
              ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-md'
              : 'bg-amber-50 border-amber-400 shadow-md dir-float'
            : 'bg-slate-50/70 border-dashed border-slate-200'
        }`}
      >
        {isOccupied ? (
          <span className="text-4xl sm:text-5xl leading-none">{question.guest}</span>
        ) : (
          <span className="text-slate-300 text-xl font-bold">•</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="px-5 py-1.5 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-900 font-black text-lg md:text-2xl text-center">
        📍 {question.guest} {question.guestName}, {question.anchor} {question.anchorName} Neresinde?
      </div>

      {/* Merkez Nesne + Konum Kutuları */}
      <div className="flex flex-col items-center justify-center gap-2">
        {showUD && renderSlot('up')}

        <div className="flex items-center justify-center gap-3 md:gap-5">
          {showLR && renderSlot('left')}

          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-sky-50 border-4 border-sky-300 flex items-center justify-center shadow-sm">
            <span className="text-5xl sm:text-6xl leading-none">{question.anchor}</span>
          </div>

          {showLR && renderSlot('right')}
        </div>

        {showUD && renderSlot('down')}
      </div>

      {/* Konum Seçenek Butonları (Sağ, Sol, Yukarı, Aşağı sırasıyla) */}
      <div
        className={`grid gap-3 w-full mt-1 ${
          allowedDirs.length === 2 ? 'grid-cols-2 max-w-md' : 'grid-cols-2 sm:grid-cols-4 max-w-2xl'
        }`}
      >
        {allowedDirs.map((dirObj) => {
          const isTarget = dirObj.id === question.direction;
          const isWrong = wrongDirs.includes(dirObj.id);
          const showSuccess = isAnswered && isTarget;

          return (
            <button
              key={dirObj.id}
              type="button"
              disabled={isAnswered || isWrong}
              onClick={() => onSelectDirection(dirObj.id)}
              className={`dir-action-card py-2.5 px-4 flex items-center justify-center gap-2 font-black text-lg md:text-xl ${
                showSuccess ? 'is-correct' : ''
              } ${isWrong ? 'is-wrong' : ''}`}
              style={{
                backgroundColor: showSuccess ? '#16A34A' : dirObj.bgLight,
                borderColor: showSuccess ? '#14532D' : dirObj.border,
                color: showSuccess ? '#FFFFFF' : dirObj.textDark,
              }}
            >
              <span className="text-2xl">{dirObj.arrow}</span>
              <span>{dirObj.relationLabel}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="text-emerald-700 font-black text-base md:text-lg">
          ✅ {question.guest} {question.anchor} {question.anchorName} {targetDir.relationLabel.toLowerCase()}!
        </div>
      )}
    </div>
  );
}
