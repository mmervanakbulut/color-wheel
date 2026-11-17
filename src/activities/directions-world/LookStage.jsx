import React from 'react';
import { DIRECTION_MAP } from './config';
import DirectionVisual from './DirectionVisuals';

function DirectionButton({ dirObj, isAnswered, isTarget, isWrong, onSelect }) {
  const showSuccess = isAnswered && isTarget;
  return (
    <button
      type="button"
      disabled={isAnswered}
      onClick={() => onSelect(dirObj.id)}
      className={`dir-action-card flex flex-col items-center justify-center gap-1 px-5 py-3.5 min-w-[125px] md:min-w-[148px] ${
        showSuccess ? 'is-correct' : ''
      } ${isWrong ? 'is-wrong' : ''}`}
      style={{
        backgroundColor: showSuccess ? '#16A34A' : dirObj.bgLight,
        borderColor: showSuccess ? '#14532D' : dirObj.border,
        color: showSuccess ? '#FFFFFF' : dirObj.textDark,
      }}
    >
      <span className="text-3xl md:text-4xl leading-none">{dirObj.arrow}</span>
      <span className="text-lg md:text-xl font-black tracking-wide">{dirObj.label}</span>
    </button>
  );
}

export default function LookStage({
  question,
  scope,
  isAnswered,
  wrongDirs,
  onSelectDirection,
}) {
  const targetDir = DIRECTION_MAP[question.direction];
  const showUD = scope === 'all' || scope === 'ud';
  const showLR = scope === 'all' || scope === 'lr';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="px-5 py-1.5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-900 font-black text-lg md:text-2xl text-center">
        👀 Hangi Yöne Gidiyor?
      </div>

      {/* Uzamsal artı düzeni: butonlar yönüyle fiziksel olarak aynı konumda */}
      <div className="flex flex-col items-center justify-center gap-2.5 md:gap-3">
        {showUD && (
          <DirectionButton
            dirObj={DIRECTION_MAP.up}
            isAnswered={isAnswered}
            isTarget={question.direction === 'up'}
            isWrong={wrongDirs.includes('up')}
            onSelect={onSelectDirection}
          />
        )}

        <div className="flex items-center justify-center gap-3 md:gap-6">
          {showLR && (
            <DirectionButton
              dirObj={DIRECTION_MAP.left}
              isAnswered={isAnswered}
              isTarget={question.direction === 'left'}
              isWrong={wrongDirs.includes('left')}
              onSelect={onSelectDirection}
            />
          )}

          <div
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl border-4 flex flex-col items-center justify-center shadow-inner transition-all ${
              isAnswered ? 'bg-emerald-50 border-emerald-400 scale-105' : 'bg-slate-50 border-slate-300'
            }`}
          >
            <div className="dir-float">
              <DirectionVisual
                sprite={question.sprite}
                direction={question.direction}
                accentColor={targetDir.color}
                sizeClass="w-24 h-24 sm:w-32 sm:h-32"
              />
            </div>
            {isAnswered && (
              <span className="mt-1 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-black text-sm">
                {targetDir.arrow} {targetDir.label}!
              </span>
            )}
          </div>

          {showLR && (
            <DirectionButton
              dirObj={DIRECTION_MAP.right}
              isAnswered={isAnswered}
              isTarget={question.direction === 'right'}
              isWrong={wrongDirs.includes('right')}
              onSelect={onSelectDirection}
            />
          )}
        </div>

        {showUD && (
          <DirectionButton
            dirObj={DIRECTION_MAP.down}
            isAnswered={isAnswered}
            isTarget={question.direction === 'down'}
            isWrong={wrongDirs.includes('down')}
            onSelect={onSelectDirection}
          />
        )}
      </div>
    </div>
  );
}
