import React from 'react';
import { DIRECTION_VECTORS } from './config';

const DIR_BUTTONS = [
  { dir: 'LEFT', cls: 'dpad-left', label: 'Sol', arrow: '⬅️' },
  { dir: 'UP', cls: 'dpad-up', label: 'Yukarı', arrow: '⬆️' },
  { dir: 'DOWN', cls: 'dpad-down', label: 'Aşağı', arrow: '⬇️' },
  { dir: 'RIGHT', cls: 'dpad-right', label: 'Sağ', arrow: '➡️' },
];

const STEP_CHIP_STYLE = {
  LEFT: 'bg-rose-500 border-rose-700 text-white',
  UP: 'bg-sky-500 border-sky-700 text-white',
  DOWN: 'bg-amber-500 border-amber-700 text-white',
  RIGHT: 'bg-emerald-500 border-emerald-700 text-white',
};

export default function RouteControls({
  gameMode,
  theme,
  totalGems,
  collectedGemsCount,
  commandQueue,
  activeQueueIndex,
  errorQueueIndex,
  isExecuting,
  onDirectionClick,
  onRunQueue,
  onUndoStep,
  onRemoveQueueIndex,
  onReset,
}) {
  // 1. TEK ADIM MODU: Listeleme yapmayan, ilk basışta hareket eden sade alt bar
  if (gameMode === 'instant') {
    return (
      <div className="bottom-action-bar flex-wrap">
        <div className="flex items-center gap-2.5">
          {DIR_BUTTONS.map((b) => (
            <button
              key={b.dir}
              type="button"
              onClick={() => onDirectionClick(b.dir)}
              aria-label={b.label}
              title={b.label}
              className={`dpad-3d-btn px-4 ${b.cls}`}
            >
              <span>{b.arrow}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="action-btn subtle !py-3 !px-4 !text-base ml-2"
          title="Haritayı Baştan Başlat"
        >
          🔄 Baştan
        </button>
      </div>
    );
  }

  // 2. ELMASLI ALGORİTMA MODU: Sağ tarafta numaralı Rota Alanı ve kontrol paneli
  return (
    <aside className="w-full lg:w-[400px] xl:w-[440px] h-full max-h-[73vh] bg-white rounded-3xl border-4 border-slate-300 shadow-xl p-4 flex flex-col justify-between gap-3 shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border-2 border-slate-200 rounded-2xl px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{theme.heroIcon}</span>
          <span className="text-slate-400 font-black">➔</span>
          {totalGems > 0 && (
            <>
              <span
                className={`px-2.5 py-1 rounded-xl border font-black text-sm flex items-center gap-1 ${
                  collectedGemsCount === totalGems
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-sky-100 border-sky-300 text-sky-900'
                }`}
              >
                💎 {collectedGemsCount}/{totalGems}
              </span>
              <span className="text-slate-400 font-black">➔</span>
            </>
          )}
          <span className="text-2xl">{theme.targetIcon}</span>
        </div>

        <span className="px-2.5 py-1 rounded-xl bg-slate-200 font-black text-xs text-slate-700">
          📋 {commandQueue.length} / 24 Adım
        </span>
      </div>

      <div className="flex-1 min-h-[150px] bg-slate-50 rounded-2xl border-2 border-slate-300 p-3 flex flex-col gap-2 overflow-y-auto shadow-inner">
        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
          📋 ROTA ALANI (Silmek için adıma dokun)
        </span>

        {commandQueue.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-1.5 text-slate-400">
            <span className="text-3xl">🧭</span>
            <p className="font-extrabold text-sm">
              Yön tuşlarına basarak rotanı buraya ekle, sonra <strong className="text-emerald-600">▶️ BAŞLAT</strong> tuşuna bas!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
            {commandQueue.map((dir, idx) => {
              const isActive = idx === activeQueueIndex;
              const isError = idx === errorQueueIndex;
              const meta = DIRECTION_VECTORS[dir];

              return (
                <button
                  key={`${dir}-${idx}`}
                  type="button"
                  disabled={isExecuting}
                  onClick={() => onRemoveQueueIndex(idx)}
                  title={`${idx + 1}. adımı sil`}
                  className={`px-2.5 py-2 rounded-xl border-2 font-black text-sm flex items-center justify-between cursor-pointer transition ${
                    STEP_CHIP_STYLE[dir]
                  } ${isActive ? 'ring-4 ring-amber-400 scale-105 z-10' : ''} ${
                    isError ? 'ring-4 ring-red-600 animate-bounce z-10' : ''
                  }`}
                >
                  <span className="text-xs bg-black/20 px-1.5 py-0.5 rounded-md">{idx + 1}.</span>
                  <span className="text-lg leading-none">{meta?.arrow}</span>
                  <span className="text-xs truncate">{meta?.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2">
          {DIR_BUTTONS.map((b) => (
            <button
              key={b.dir}
              type="button"
              disabled={isExecuting}
              onClick={() => onDirectionClick(b.dir)}
              className={`dpad-3d-btn ${b.cls}`}
            >
              <span>{b.arrow}</span>
              <span className="text-base">{b.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isExecuting || commandQueue.length === 0}
            onClick={onRunQueue}
            className="action-btn success flex-1 !py-3 !px-4 !text-lg disabled:opacity-50"
          >
            {isExecuting ? '⏳ Yürüyor...' : '▶️ BAŞLAT'}
          </button>

          <button
            type="button"
            disabled={isExecuting || commandQueue.length === 0}
            onClick={onUndoStep}
            className="action-btn subtle !py-3 !px-3.5 !text-base disabled:opacity-50"
            title="Son Eklenen Adımı Sil"
          >
            ⌫ Sil
          </button>

          <button
            type="button"
            disabled={isExecuting}
            onClick={onReset}
            className="action-btn subtle !py-3 !px-3.5 !text-base disabled:opacity-50"
            title="Rotayı ve Haritayı Sıfırla"
          >
            🗑️
          </button>
        </div>
      </div>
    </aside>
  );
}
