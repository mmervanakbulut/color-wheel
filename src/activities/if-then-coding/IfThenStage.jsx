import React from 'react';

export default function IfThenStage({
  rule,
  currentItem,
  stepIdx,
  totalSteps,
  wrongBranchId,
  isCorrectFlash,
  onSelectBranch,
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      {/* 1. Üst Koşul Kuralları (EĞER ... İSE ...) */}
      <div className="w-full max-w-4xl bg-slate-50 rounded-3xl border-2 border-slate-300 p-3.5 flex flex-col items-center gap-2.5 shadow-inner">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1 rounded-full bg-violet-100 border border-violet-300 font-black text-violet-900 text-sm sm:text-base">
            🚦 KURAL: {rule.icon} {rule.title}
          </span>
          <span className="px-3 py-1 rounded-full bg-white border border-slate-300 font-black text-xs sm:text-sm text-slate-700">
            Adım {stepIdx + 1} / {totalSteps}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          {rule.branches.map((b) => (
            <div
              key={b.id}
              className="px-4 py-2 rounded-2xl border-2 flex items-center gap-2 font-black text-sm sm:text-base shadow-xs"
              style={{
                backgroundColor: b.bg,
                borderColor: b.color,
                color: '#0F172A',
              }}
            >
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-white">EĞER</span>
              <span className="text-2xl">{b.condIcon}</span>
              <span>{b.condLabel}</span>
              <span className="text-slate-500">➔</span>
              <span className="text-2xl">{b.actionIcon}</span>
              <span style={{ color: b.color }}>{b.actionLabel}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Ortada Gelen Nesne / Durum Kartı */}
      <div
        className={`w-48 h-44 sm:w-56 sm:h-48 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 shadow-lg transition-all ${
          isCorrectFlash
            ? 'bg-emerald-50 border-emerald-500 scale-105'
            : 'bg-white border-slate-300'
        }`}
      >
        <span className="text-6xl sm:text-7xl leading-none">{currentItem.emoji}</span>
        <span className="text-base sm:text-lg font-black text-slate-800 text-center px-2">
          {currentItem.label}
        </span>
      </div>

      {/* 3. Alt Karar / Aksiyon Butonları */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-3xl">
        {rule.branches.map((b) => {
          const isWrong = wrongBranchId === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBranch(b.id)}
              className={`flex-1 min-w-[180px] py-4 px-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-1.5 font-black shadow-md transition-all cursor-pointer ${
                isWrong ? 'scale-95 opacity-60' : 'hover:-translate-y-1'
              }`}
              style={{
                backgroundColor: isWrong ? '#FEE2E2' : b.bg,
                borderColor: isWrong ? '#EF4444' : b.color,
                color: '#0F172A',
              }}
            >
              <span className="text-4xl sm:text-5xl leading-none">{b.actionIcon}</span>
              <span className="text-lg sm:text-xl" style={{ color: b.color }}>
                {b.actionLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
