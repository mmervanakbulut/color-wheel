import React from 'react';
import { DIR_META } from './config';

export default function DebugControls({
  code,
  selectedIdx,
  runningIdx,
  bugStepIdx,
  isRunning,
  onSelectStep,
  onSetDirection,
  onAddEmptyStep,
  onDeleteSelectedStep,
  onRestoreInitial,
  onRun,
}) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-2.5">
      {/* 1. Yönerge Adımları (Üzerine Dokunarak Seçilir) */}
      <div className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 min-h-[62px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-600 uppercase tracking-wide">
            📋 Yönerge:
          </span>

          {code.map((dirId, idx) => {
            const isSelected = selectedIdx === idx;
            const isRunningStep = runningIdx === idx;
            const isBugStep = bugStepIdx === idx;
            const meta = dirId ? DIR_META[dirId] : null;

            return (
              <button
                key={idx}
                type="button"
                disabled={isRunning}
                onClick={() => onSelectStep(idx)}
                title={`${idx + 1}. adımı seç ve aşağıdan yönünü değiştir`}
                className={`px-3 py-1.5 rounded-2xl border-2 font-black text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRunningStep
                    ? 'bg-emerald-200 border-emerald-600 scale-110 shadow-md'
                    : isBugStep
                    ? 'bg-rose-100 border-rose-500 ring-3 ring-rose-300 scale-105'
                    : isSelected
                    ? 'bg-indigo-100 border-indigo-600 ring-3 ring-indigo-300 scale-105 shadow-xs'
                    : dirId === null
                    ? 'bg-amber-50 border-dashed border-amber-400 animate-pulse'
                    : 'bg-white border-slate-300 hover:border-indigo-400'
                }`}
              >
                <span className="text-xs text-slate-500 font-black">{idx + 1}.</span>
                {meta ? (
                  <span className="text-xl sm:text-2xl leading-none">{meta.arrow}</span>
                ) : (
                  <span className="text-lg sm:text-xl font-black text-amber-600">❓</span>
                )}
                {isBugStep && <span className="text-sm">🐞</span>}
              </button>
            );
          })}

          <button
            type="button"
            disabled={isRunning || code.length >= 10}
            onClick={onAddEmptyStep}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 border-2 border-dashed border-amber-400 text-xs font-black text-amber-900 hover:bg-amber-100 disabled:opacity-40 cursor-pointer"
            title="Yönergenin sonuna eksik adım ekle"
          >
            ➕ Adım Ekle
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isRunning || code.length <= 1}
            onClick={onDeleteSelectedStep}
            className="px-2.5 py-1 rounded-xl bg-white border border-rose-300 text-xs font-black text-rose-700 hover:bg-rose-50 disabled:opacity-40 cursor-pointer"
            title="Seçili olan fazla adımı sil"
          >
            🗑️ Seçiliyi Sil
          </button>
          <button
            type="button"
            disabled={isRunning}
            onClick={onRestoreInitial}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 text-xs font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            title="Yönergeyi ilk hatalı haline döndür"
          >
            🔄 İlk Hali
          </button>
        </div>
      </div>

      {/* 2. Seçili Adımı Düzeltme Yönleri + Yönergeyi Dene */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-1.5">
          <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-black">
            ✏️ {selectedIdx + 1}. Adımı Yap:
          </span>

          {Object.values(DIR_META).map((d) => (
            <button
              key={d.id}
              type="button"
              disabled={isRunning}
              onClick={() => onSetDirection(d.id)}
              className="px-3.5 py-2 rounded-2xl border-2 flex items-center gap-1.5 font-black text-sm sm:text-base shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
              style={{
                backgroundColor: d.bg,
                borderColor: d.color,
                color: '#0F172A',
              }}
            >
              <span className="text-2xl leading-none">{d.arrow}</span>
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={isRunning}
          onClick={onRun}
          className="action-btn success !py-2.5 !px-6 !text-base sm:!text-lg disabled:opacity-45"
        >
          {isRunning ? '⏳ Deneniyor...' : '▶️ YÖNERGEYİ DENE'}
        </button>
      </div>
    </div>
  );
}
