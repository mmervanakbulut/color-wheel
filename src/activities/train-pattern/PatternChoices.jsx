import React from 'react';

export default function PatternChoices({
  choices,
  cargoTheme,
  wrongChoiceKey,
  isCompleted,
  onSelectChoice,
  onReset,
}) {
  return (
    <footer className="w-full bg-white rounded-2xl border-2 border-slate-300 shadow-md px-5 py-3 flex flex-wrap items-center justify-center gap-5 shrink-0">
      <div className="flex items-center gap-2 font-black text-slate-700 text-base">
        <span className="text-2xl">👇</span>
        <span>Soru işaretli vagona hangisi gelmeli?</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {choices.map((key) => {
          const item = cargoTheme.items[key];
          if (!item) return null;
          const isWrong = wrongChoiceKey === key;

          return (
            <button
              key={key}
              type="button"
              disabled={isCompleted}
              onClick={() => onSelectChoice(key)}
              title={item.label}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 flex items-center justify-center text-4xl md:text-5xl shadow-md transition-all cursor-pointer active:translate-y-1 hover:-translate-y-1 disabled:opacity-50 ${
                isWrong ? 'ring-4 ring-red-400 scale-95' : ''
              }`}
              style={{
                backgroundColor: item.bg,
                borderColor: item.border,
              }}
            >
              {item.icon}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="action-btn subtle !py-3 !px-5 !text-base"
        title="Treni Baştan Diz"
      >
        🔄 Baştan
      </button>
    </footer>
  );
}
