import React from 'react';
import { PIXEL_COLORS } from './config';

export default function PixelPalette({
  mode,
  usedCodes,
  selectedCode,
  onSelectCode,
}) {
  const colorsToShow =
    mode === 'free'
      ? PIXEL_COLORS
      : PIXEL_COLORS.filter((c) => usedCodes.includes(c.code));

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      {colorsToShow.map((color) => {
        const isActive = selectedCode === color.code;
        return (
          <button
            key={color.code}
            type="button"
            onClick={() => onSelectCode(color.code)}
            className={`pixel-swatch-btn px-3.5 py-2 flex items-center gap-2 font-black text-base sm:text-lg ${
              isActive ? 'is-active' : ''
            }`}
            style={{
              backgroundColor: color.hex,
              borderColor: color.border,
              color: color.text,
            }}
            title={color.name}
          >
            {mode === 'decode' && (
              <span className="w-7 h-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center text-base font-black shadow-xs">
                {color.code}
              </span>
            )}
            <span>{color.name}</span>
          </button>
        );
      })}

      {mode !== 'decode' && (
        <button
          type="button"
          onClick={() => onSelectCode(0)}
          className={`pixel-swatch-btn px-3.5 py-2 flex items-center gap-1.5 font-black text-base sm:text-lg bg-white border-slate-400 text-slate-700 ${
            selectedCode === 0 ? 'is-active' : ''
          }`}
          title="Kareyi Sil"
        >
          <span>🧹</span>
          <span>Silgi</span>
        </button>
      )}
    </div>
  );
}
