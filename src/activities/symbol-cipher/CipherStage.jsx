import React from 'react';
import { SYMBOL_COLORS } from './config';

export default function CipherStage({
  puzzle,
  currentSlotIdx,
  wrongChoice,
  onSelectChoice,
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      {/* 1. Şifre Anahtar Tablosu */}
      <div className="w-full max-w-3xl bg-slate-50 rounded-3xl border-2 border-slate-300 p-3.5 sm:p-4 flex flex-col items-center gap-2.5 shadow-inner">
        <span className="px-4 py-1 rounded-full bg-indigo-100 border border-indigo-300 font-black text-indigo-900 text-sm sm:text-base">
          🔑 ŞİFRE ANAHTARI (Sembollerin Karşılığına Bak!)
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {puzzle.keyPairs.map((pair) => {
            const style = SYMBOL_COLORS[pair.symbol] || SYMBOL_COLORS['▲'];
            return (
              <div
                key={pair.symbol}
                className="px-4 py-2.5 rounded-2xl border-3 flex items-center gap-2.5 shadow-xs"
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.border,
                  color: style.text,
                }}
              >
                <span className="text-3xl sm:text-4xl font-black leading-none">{pair.symbol}</span>
                <span className="text-xl font-black text-slate-500">=</span>
                <span className="text-4xl sm:text-5xl leading-none">{pair.item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Çözülecek Şifreli Kilit Kutuları */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        {puzzle.slots.map((slot, idx) => {
          const isSolved = idx < currentSlotIdx;
          const isActive = idx === currentSlotIdx;
          const style = SYMBOL_COLORS[slot.symbol] || SYMBOL_COLORS['▲'];

          return (
            <div
              key={slot.index}
              className={`w-28 h-36 sm:w-32 sm:h-40 rounded-3xl border-4 flex flex-col items-center justify-between p-3 transition-all ${
                isSolved
                  ? 'bg-emerald-50 border-emerald-500 shadow-md'
                  : isActive
                  ? 'bg-amber-50 border-amber-400 scale-105 shadow-lg'
                  : 'bg-white border-slate-300 opacity-85'
              }`}
            >
              <span
                className="w-11 h-11 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-black"
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.border,
                  color: style.text,
                }}
              >
                {slot.symbol}
              </span>

              <span className="text-lg font-black text-slate-400">⬇️</span>

              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center">
                {isSolved ? (
                  <span className="text-4xl sm:text-5xl leading-none">{slot.expectedItem}</span>
                ) : (
                  <span className="text-3xl font-black text-amber-500">
                    {isActive ? '❓' : '🔒'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Alt Seçenek Butonları */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-1">
        {puzzle.choices.map((choice) => {
          const isWrong = wrongChoice === choice;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => onSelectChoice(choice)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-3 flex items-center justify-center text-5xl sm:text-6xl shadow-md transition-all cursor-pointer ${
                isWrong
                  ? 'bg-rose-50 border-rose-500 scale-95'
                  : 'bg-white border-slate-300 hover:border-indigo-500 hover:-translate-y-1'
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
