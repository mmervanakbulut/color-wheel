import React, { useEffect, useRef } from 'react';
import { WHEEL_SLICES } from './config';

export default function DirectionWheelStage({
  wheelAngle,
  wheelPreviewIdx,
  isSpinning,
  hasSpunOnce,
  onSpin,
}) {
  const canvasRef = useRef(null);
  const activeDir = WHEEL_SLICES[wheelPreviewIdx] || WHEEL_SLICES[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = cx - 12;
    const sliceCount = WHEEL_SLICES.length;
    const sliceRad = (2 * Math.PI) / sliceCount;
    const baseRad = (wheelAngle * Math.PI) / 180;

    ctx.clearRect(0, 0, size, size);

    WHEEL_SLICES.forEach((slice, i) => {
      const start = baseRad + i * sliceRad;
      const end = start + sliceRad;
      const mid = start + sliceRad / 2;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      ctx.save();
      ctx.translate(cx + Math.cos(mid) * (r * 0.62), cy + Math.sin(mid) * (r * 0.62));
      ctx.rotate(mid + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 34px "Segoe UI Emoji", "Segoe UI", sans-serif';
      ctx.fillText(slice.arrow, 0, -10);
      ctx.font = '900 16px "Segoe UI", sans-serif';
      ctx.fillText(slice.label, 0, 18);
      ctx.restore();
    });

    // Dış çerçeve
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1E293B';
    ctx.stroke();

    // Orta göbek
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1E293B';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = '24px "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧭', cx, cy + 1);
  }, [wheelAngle]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
      <div
        className="wheel-wrapper cursor-pointer"
        onClick={onSpin}
        title="Çarkı Çevirmek İçin Dokun!"
      >
        <div className="wheel-pointer" />
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="w-[290px] h-[290px] sm:w-[350px] sm:h-[350px] drop-shadow-xl"
        />
      </div>

      {/* Sağda Dev Sınıf Taklit / Hareket Kartı */}
      <div
        className="w-full max-w-sm rounded-3xl border-4 p-6 flex flex-col items-center justify-center gap-4 shadow-lg transition-all"
        style={{
          backgroundColor: activeDir.bgLight,
          borderColor: activeDir.border,
          color: activeDir.textDark,
        }}
      >
        <span className="px-4 py-1 rounded-full bg-white/85 border border-slate-200 font-black text-sm text-slate-700">
          {isSpinning ? '🎡 Çark Dönüyor...' : hasSpunOnce ? '🎯 Çıkan Yönü Yap!' : '👆 Çarkı Çevir'}
        </span>

        <div className="text-7xl md:text-8xl leading-none flex items-center gap-3 dir-float">
          <span>{activeDir.arrow}</span>
          <span>{activeDir.actionEmoji}</span>
        </div>

        <div
          className="px-6 py-2 rounded-2xl text-white font-black text-3xl tracking-wide shadow"
          style={{ backgroundColor: activeDir.color }}
        >
          {activeDir.label}
        </div>

        <p className="font-black text-xl text-center">{activeDir.actionTitle}</p>
      </div>
    </div>
  );
}
