import React from 'react';

export default function TrainTrack({
  pattern,
  cargoTheme,
  filledSlots,
  activeMissingIndex,
  wrongWagonIndex,
}) {
  if (!pattern) return null;

  return (
    <div className="train-stage-card">
      <div className="mb-5 px-5 py-2 rounded-full bg-white border-2 border-blue-200 shadow-xs font-black text-slate-700 text-base md:text-lg flex items-center gap-2">
        <span>🚂</span>
        <span>{pattern.ruleText}</span>
      </div>

      <div className="train-convoy-row">
        {/* Lokomotif */}
        <div className="train-locomotive" aria-hidden="true">
          <span>🚂</span>
          <div className="train-wagon-wheels">
            <span className="train-wheel" />
            <span className="train-wheel" />
          </div>
        </div>

        {/* Vagonlar */}
        {pattern.sequence.map((key, idx) => {
          const isMissing = pattern.missing.includes(idx);
          const filledKey = filledSlots[idx];
          const resolvedKey = isMissing ? filledKey : key;
          const item = resolvedKey ? cargoTheme.items[resolvedKey] : null;

          const isActiveTarget = isMissing && idx === activeMissingIndex;
          const isWrongTarget = idx === wrongWagonIndex;

          return (
            <React.Fragment key={idx}>
              <div className="train-coupler" aria-hidden="true" />
              <div
                className={`train-wagon ${!item ? 'is-missing' : ''} ${
                  isActiveTarget ? 'is-active-missing' : ''
                } ${isWrongTarget ? 'is-wrong' : ''}`}
                style={
                  item
                    ? {
                        backgroundColor: item.bg,
                        borderColor: item.border,
                      }
                    : undefined
                }
              >
                <span>{item ? item.icon : '❓'}</span>
                <div className="train-wagon-wheels">
                  <span className="train-wheel" />
                  <span className="train-wheel" />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="train-track-bar" aria-hidden="true" />
    </div>
  );
}
