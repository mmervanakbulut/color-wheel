import React from 'react';

export default function SequenceStage({
  story,
  shuffledCards,
  currentStep,
  wrongStepId,
  onSelectCard,
}) {
  const total = story.steps.length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <div className="px-5 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 font-black text-lg md:text-2xl text-center">
        📋 {story.icon} {story.title} — Önce Hangisi Yapılır? ({currentStep > total ? 'Tamamlandı!' : `${currentStep}. Adımı Seç`})
      </div>

      {/* Üst Sıralı Hedef Yuvaları (1 -> 2 -> 3 -> 4) */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 w-full max-w-4xl">
        {story.steps.map((item, idx) => {
          const stepNum = idx + 1;
          const isPlaced = stepNum < currentStep;
          const isActiveSlot = stepNum === currentStep;

          return (
            <React.Fragment key={item.step}>
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl border-4 flex flex-col items-center justify-center p-3 gap-1.5 transition-all ${
                  isPlaced
                    ? 'bg-emerald-50 border-emerald-500 shadow-md scale-100'
                    : isActiveSlot
                    ? 'bg-sky-50 border-sky-400 border-dashed shadow-inner animate-pulse'
                    : 'bg-slate-50 border-slate-200 border-dashed opacity-75'
                }`}
              >
                <span
                  className={`px-3 py-0.5 rounded-full text-xs sm:text-sm font-black ${
                    isPlaced
                      ? 'bg-emerald-600 text-white'
                      : isActiveSlot
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {stepNum}. ADIM
                </span>

                {isPlaced ? (
                  <>
                    <span className="text-4xl sm:text-5xl leading-none my-1">{item.emoji}</span>
                    <span className="text-sm sm:text-base font-black text-emerald-950 text-center leading-tight">
                      {item.label}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl sm:text-5xl font-black text-slate-300 my-2">❓</span>
                )}
              </div>

              {stepNum < total && (
                <span className="text-2xl sm:text-3xl font-black text-slate-400 hidden sm:inline">
                  ➡️
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Alt Karışık Seçenek Kartları */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-4xl mt-1">
        {shuffledCards.map((card) => {
          const isUsed = card.step < currentStep;
          const isWrong = wrongStepId === card.step;

          return (
            <button
              key={card.step}
              type="button"
              disabled={isUsed}
              onClick={() => onSelectCard(card)}
              className={`w-36 h-36 sm:w-44 sm:h-40 rounded-3xl border-3 p-3 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                isUsed
                  ? 'bg-slate-100 border-slate-200 opacity-30 scale-95 cursor-default'
                  : isWrong
                  ? 'bg-rose-50 border-rose-500 scale-95'
                  : 'bg-white border-slate-300 hover:border-sky-400 hover:-translate-y-1 shadow-md'
              }`}
            >
              <span className="text-4xl sm:text-5xl leading-none">{card.emoji}</span>
              <span className="text-sm sm:text-base font-black text-slate-800 text-center leading-tight">
                {card.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
