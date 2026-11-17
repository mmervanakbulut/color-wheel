import React from 'react';
import { DIR_META } from './config';

const REPEAT_COUNTS = [1, 2, 3, 4, 5];

export default function LoopControls({
  groups,
  draftDirs,
  isRunning,
  activeStepInfo,
  onAddDraftDir,
  onPopDraftDir,
  onCommitGroup,
  onCycleGroupCount,
  onRemoveLastGroup,
  onClearAll,
  onRun,
}) {
  const hasDraft = draftDirs.length > 0;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-2.5">
      {/* 1. Oluşturulmuş Döngü Grupları (Program Sırası) + Hazırlanan Adımlar */}
      <div className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 min-h-[60px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-600 uppercase tracking-wide">
            📋 Döngü Grupları:
          </span>

          {groups.map((grp, gIdx) => {
            const isGroupActive = activeStepInfo?.groupIdx === gIdx;
            return (
              <div
                key={grp.id}
                className={`px-2.5 py-1 rounded-2xl border-2 flex items-center gap-1.5 transition-all ${
                  isGroupActive
                    ? 'bg-amber-100 border-amber-500 scale-105 shadow-md'
                    : 'bg-white border-indigo-300 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => onCycleGroupCount(gIdx)}
                  title="Tekrar sayısını değiştirmek için dokun"
                  className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-black text-xs sm:text-sm cursor-pointer hover:bg-indigo-700"
                >
                  🔁 {grp.count}×
                </button>

                <span className="font-black text-indigo-400 text-sm">[</span>
                <div className="flex items-center gap-1">
                  {grp.dirs.map((dId, dIdx) => {
                    const isArrowActive = isGroupActive && activeStepInfo?.dirIdx === dIdx;
                    return (
                      <span
                        key={dIdx}
                        className={`text-xl leading-none px-1 rounded ${
                          isArrowActive ? 'bg-amber-300 scale-125' : ''
                        }`}
                      >
                        {DIR_META[dId].arrow}
                      </span>
                    );
                  })}
                </div>
                <span className="font-black text-indigo-400 text-sm">]</span>

                {isGroupActive && (
                  <span className="text-xs font-black text-amber-900">
                    ({activeStepInfo.iter}/{activeStepInfo.totalIters})
                  </span>
                )}
              </div>
            );
          })}

          {/* Şu an yönlere basılarak hazırlanan taslak grup */}
          {hasDraft && (
            <div className="px-3 py-1 rounded-2xl bg-sky-50 border-2 border-dashed border-sky-400 flex items-center gap-1.5 animate-pulse">
              <span className="text-xs font-black text-sky-800">Seçilen Yönler: [</span>
              {draftDirs.map((dId, idx) => (
                <span key={idx} className="text-xl leading-none">
                  {DIR_META[dId].arrow}
                </span>
              ))}
              <span className="text-xs font-black text-sky-800">] ➔ Kaç Tekrar?</span>
            </div>
          )}

          {groups.length === 0 && !hasDraft && (
            <span className="text-xs sm:text-sm font-bold text-slate-400">
              1️⃣ Önce yön oklarına bas ➔ 2️⃣ Sonra kaç kere tekrar edeceğini (2×, 3×, 4×) seç!
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isRunning || (groups.length === 0 && !hasDraft)}
            onClick={hasDraft ? onPopDraftDir : onRemoveLastGroup}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 text-xs font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            ⌫ Geri Al
          </button>
          <button
            type="button"
            disabled={isRunning || (groups.length === 0 && !hasDraft)}
            onClick={onClearAll}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 text-xs font-black text-rose-700 hover:bg-rose-50 disabled:opacity-40 cursor-pointer"
          >
            🗑️ Temizle
          </button>
        </div>
      </div>

      {/* 2. Adım 1: Yönlere Bas  |  Adım 2: Tekrar Sayısını Gir  |  Adım 3: Başlat */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3">
        {/* 1. Adım: Yön Butonları */}
        <div className="flex items-center gap-1.5 bg-slate-100 border-2 border-slate-300 rounded-2xl p-1.5">
          <span className="px-2 text-xs font-black text-slate-700 hidden sm:inline">
            1️⃣ Yön Seç:
          </span>
          {Object.values(DIR_META).map((d) => (
            <button
              key={d.id}
              type="button"
              disabled={isRunning}
              onClick={() => onAddDraftDir(d.id)}
              className="loop-dir-btn px-3 py-1.5 flex items-center gap-1 font-black text-sm sm:text-base"
              style={{
                backgroundColor: d.bg,
                borderColor: d.color,
                color: '#0F172A',
              }}
            >
              <span className="text-2xl leading-none">{d.arrow}</span>
              <span className="hidden md:inline">{d.label}</span>
            </button>
          ))}
        </div>

        {/* 2. Adım: Tekrar Sayısını Seçip Döngü Grubu Oluştur */}
        <div
          className={`flex items-center gap-1.5 rounded-2xl p-1.5 border-2 transition-all ${
            hasDraft
              ? 'bg-amber-50 border-amber-400 shadow-md scale-105'
              : 'bg-indigo-50/60 border-indigo-200 opacity-75'
          }`}
        >
          <span className="px-2 text-xs font-black text-indigo-950">
            2️⃣ Tekrarla:
          </span>
          {REPEAT_COUNTS.map((cnt) => (
            <button
              key={cnt}
              type="button"
              disabled={isRunning || !hasDraft}
              onClick={() => onCommitGroup(cnt)}
              className={`px-3 py-1.5 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
                hasDraft
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                  : 'bg-white text-slate-400 cursor-not-allowed'
              }`}
              title={`Seçilen yönleri ${cnt} kez tekrarla`}
            >
              {cnt}×
            </button>
          ))}
        </div>

        {/* 3. Adım: Başlat */}
        <button
          type="button"
          disabled={isRunning || (groups.length === 0 && !hasDraft)}
          onClick={onRun}
          className="action-btn success !py-2.5 !px-6 !text-base sm:!text-lg disabled:opacity-45"
        >
          {isRunning ? '⏳ Çalışıyor...' : '▶️ BAŞLAT'}
        </button>
      </div>
    </div>
  );
}
