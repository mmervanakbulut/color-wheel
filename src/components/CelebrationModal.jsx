import React from 'react';

export default function CelebrationModal({
  stars = 3,
  heroIcon,
  targetIcon,
  message,
  nextLabel = '▶️ Sıradaki',
  onNext,
  onSurprise,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-3xl border-4 border-slate-200 shadow-2xl max-w-md w-full text-center p-7 flex flex-col gap-4 items-center">
        <div className="text-4xl">{'⭐'.repeat(stars)}</div>
        <div className="text-6xl flex items-center gap-3">
          <span>{heroIcon}</span>
          <span>{targetIcon}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800">Harika Başardın!</h2>
        <p className="text-base font-bold text-slate-600">{message}</p>
        <div className="flex gap-3 w-full mt-2">
          <button
            type="button"
            onClick={onNext}
            className="action-btn success flex-1 !py-3 !text-lg"
          >
            {nextLabel}
          </button>
          {onSurprise && (
            <button
              type="button"
              onClick={onSurprise}
              className="action-btn primary !py-3 !px-5 !text-lg"
              title="Sürpriz Yeni Görev"
            >
              🎲
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
