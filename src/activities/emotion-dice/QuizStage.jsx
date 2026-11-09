import React from 'react';
import { EMOTIONS, getImgForCharacter } from './config';

export default function QuizStage({
  character,
  quizTargetIdx,
  quizOptions,
  quizAnswered,
  quizWrongSet,
  onSelectOption,
}) {
  const targetEm = EMOTIONS[quizTargetIdx] || EMOTIONS[0];
  const quizOptionCharacter = character === 'girl' ? 'boy' : 'girl';

  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-2 gap-4">
      {/* Üst: Hedef Duygu Kartı */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl border-6 border-amber-400 shadow-lg overflow-hidden bg-amber-50">
          <img
            src={getImgForCharacter(targetEm, character)}
            alt={targetEm.title}
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>
        <span className="px-4 py-1 rounded-full bg-amber-100 border border-amber-300 font-black text-base text-amber-950">
          {targetEm.emoji} {targetEm.title}
        </span>
      </div>

      {/* Alt: 3 Seçenek Kartı */}
      <div className="grid grid-cols-3 gap-5 md:gap-8 w-full max-w-3xl px-2">
        {quizOptions.map((emIdx) => {
          const optEm = EMOTIONS[emIdx];
          const isCorrect = quizAnswered && emIdx === quizTargetIdx;
          const isWrong = quizWrongSet.includes(emIdx);

          return (
            <button
              key={optEm.id}
              type="button"
              onClick={() => onSelectOption(emIdx)}
              className={`relative flex flex-col items-center p-3 rounded-3xl border-4 transition-all cursor-pointer bg-slate-50 hover:bg-white shadow-md ${
                isCorrect
                  ? 'border-green-500 bg-green-50 scale-105 ring-4 ring-green-300'
                  : isWrong
                  ? 'border-red-400 bg-red-50 opacity-55'
                  : 'border-slate-300 hover:border-blue-400 hover:-translate-y-1'
              }`}
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-slate-200">
                <img
                  src={getImgForCharacter(optEm, quizOptionCharacter)}
                  alt={optEm.title}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>
              {isCorrect && (
                <span className="absolute -top-3 -right-3 text-3xl bg-white rounded-full shadow">
                  ✅
                </span>
              )}
              {isWrong && (
                <span className="absolute -top-3 -right-3 text-3xl bg-white rounded-full shadow">
                  ❌
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

