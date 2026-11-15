import React from 'react';
import { DIRECTION_VECTORS } from './config';

const DIR_BUTTONS = [
  { dir: 'LEFT', cls: 'dpad-left', label: 'Sol', arrow: '⬅️' },
  { dir: 'UP', cls: 'dpad-up', label: 'Yukarı', arrow: '⬆️' },
  { dir: 'DOWN', cls: 'dpad-down', label: 'Aşağı', arrow: '⬇️' },
  { dir: 'RIGHT', cls: 'dpad-right', label: 'Sağ', arrow: '➡️' },
];

const QUEUE_BG = {
  LEFT: 'bg-rose-500 border-rose-700',
  UP: 'bg-sky-500 border-sky-700',
  DOWN: 'bg-amber-500 border-amber-700',
  RIGHT: 'bg-emerald-500 border-emerald-700',
};

export default function RouteControls({
  gameMode,
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
  return (
    <div className="w-full flex flex-col items-center gap-2 shrink-0">
      {/* Algoritma Modunda Kod Sırası Çubuğu */}
      {gameMode === 'queue' && (
        <div className="w-full max-w-4xl bg-white rounded-2xl border-2 border-slate-300 px-3 py-2 flex items-center gap-2 overflow-x-auto shadow-xs min-h-[54px]">
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-300 font-black text-xs text-slate-700 shrink-0">
            📋 KOD SIRASI ({commandQueue.length}/16)
          </span>

          {commandQueue.length === 0 ? (
            <span className="text-sm font-bold text-slate-400 px-2">
              Yön tuşlarına basarak rotayı oluşturun...
            </span>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {commandQueue.map((dir, idx) => {
                const isActive = idx === activeQueueIndex;
                const isError = idx === errorQueueIndex;
                return (
                  <button
                    key={`${dir}-${idx}`}
                    type="button"
                    disabled={isExecuting}
                    onClick={() => onRemoveQueueIndex(idx)}
                    title="Bu adımı sil"
                    className={`w-9 h-9 rounded-xl border-2 text-white font-black text-base flex items-center justify-center cursor-pointer transition ${
                      QUEUE_BG[dir]
                    } ${isActive ? 'ring-4 ring-amber-400 scale-110' : ''} ${
                      isError ? 'ring-4 ring-red-500 animate-bounce' : ''
                    }`}
                  >
                    {DIRECTION_VECTORS[dir]?.arrow}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Alt Kontrol Paneli (Renk Kodlu 3D Yön Tuşları + Aksiyonlar) */}
      <div className="bottom-action-bar flex-wrap">
        <div className="flex items-center gap-2.5">
          {DIR_BUTTONS.map((b) => (
            <button
              key={b.dir}
              type="button"
              disabled={isExecuting}
              onClick={() => onDirectionClick(b.dir)}
              aria-label={b.label}
              title={b.label}
              className={`dpad-3d-btn ${b.cls}`}
            >
              {b.arrow}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 ml-2">
          {gameMode === 'queue' && (
            <>
              <button
                type="button"
                disabled={isExecuting || commandQueue.length === 0}
                onClick={onRunQueue}
                className="action-btn success !py-3 !px-5 !text-lg disabled:opacity-50"
              >
                ▶️ BAŞLAT
              </button>
              <button
                type="button"
                disabled={isExecuting || commandQueue.length === 0}
                onClick={onUndoStep}
                className="action-btn subtle !py-3 !px-4 !text-base disabled:opacity-50"
                title="Son Eklenen Adımı Sil"
              >
                ⌫ Sil
              </button>
            </>
          )}

          <button
            type="button"
            disabled={isExecuting}
            onClick={onReset}
            className="action-btn subtle !py-3 !px-4 !text-base disabled:opacity-50"
            title="Haritayı Baştan Başlat"
          >
            🔄 Baştan
          </button>
        </div>
      </div>
    </div>
  );
}
