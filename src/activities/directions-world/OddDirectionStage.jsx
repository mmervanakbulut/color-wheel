import React from 'react';
import { DIRECTION_MAP } from './config';
import DirectionVisual from './DirectionVisuals';

export default function OddDirectionStage({
  question,
  isAnswered,
  wrongIndices,
  onSelectCard,
}) {
  const oddDirObj = DIRECTION_MAP[question.oddDir];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <div className="px-5 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 font-black text-lg md:text-2xl text-center">
        🔍 Farklı Yöne Bakanı Bul!
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-xl">
        {question.cards.map((card) => {
          const isWrong = wrongIndices.includes(card.index);
          const isSolvedTarget = isAnswered && card.isOdd;

          return (
            <button
              key={card.index}
              type="button"
              disabled={isAnswered || isWrong}
              onClick={() => onSelectCard(card)}
              className={`dir-action-card bg-white border-slate-300 h-40 md:h-48 flex flex-col items-center justify-center gap-2 relative ${
                isSolvedTarget ? 'is-correct !bg-emerald-50 !border-emerald-500' : ''
              } ${isWrong ? 'is-wrong !bg-rose-50 !border-rose-400' : ''}`}
            >
              <DirectionVisual
                sprite={question.sprite}
                direction={card.direction}
                accentColor="#0284C7"
                sizeClass="w-24 h-24 md:w-28 md:h-28"
              />

              {isSolvedTarget && (
                <span
                  className="px-3 py-1 rounded-full text-white font-black text-sm md:text-base shadow"
                  style={{ backgroundColor: oddDirObj.color }}
                >
                  ✅ {oddDirObj.arrow} {oddDirObj.label}
                </span>
              )}

              {isWrong && (
                <span className="text-rose-600 font-black text-sm">❌ Aynı Yön</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
