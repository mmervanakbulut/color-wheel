import React, { useEffect, useRef, useCallback } from 'react';
import { EMOTIONS, getImgForCharacter } from './config';

export default function WheelStage({
  character,
  wheelAngle,
  wheelPreviewIndex,
  isRolling,
  hasRolledOnce,
  onSpin,
}) {
  const wheelCanvasRef = useRef(null);
  const loadedImagesRef = useRef({});

  const drawWheelCanvas = useCallback(
    (angleDeg) => {
      const canvas = wheelCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 10;

      ctx.clearRect(0, 0, w, h);
      const sliceCount = EMOTIONS.length;
      const sliceAngle = (Math.PI * 2) / sliceCount;
      const baseRad = (angleDeg * Math.PI) / 180;

      for (let i = 0; i < sliceCount; i++) {
        const em = EMOTIONS[i];
        const startA = baseRad + i * sliceAngle;
        const endA = startA + sliceAngle;
        const midA = startA + sliceAngle / 2;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startA, endA);
        ctx.closePath();
        ctx.fillStyle = em.color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        ctx.save();
        const imgDist = radius * 0.62;
        const ix = cx + Math.cos(midA) * imgDist;
        const iy = cy + Math.sin(midA) * imgDist;
        ctx.translate(ix, iy);
        ctx.rotate(midA + Math.PI / 2);

        const imgKey = `${character}_${em.id}`;
        const loadedImg = loadedImagesRef.current[imgKey];
        const thumbSize = 62;
        if (loadedImg) {
          ctx.beginPath();
          ctx.arc(0, 0, thumbSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.save();
          ctx.clip();
          ctx.drawImage(loadedImg, -thumbSize / 2, -thumbSize / 2, thumbSize, thumbSize);
          ctx.restore();

          ctx.beginPath();
          ctx.arc(0, 0, thumbSize / 2, 0, Math.PI * 2);
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();
        } else {
          ctx.font = '28px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(em.emoji, 0, 0);
        }
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#1E293B';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#1E293B';
      ctx.stroke();
    },
    [character]
  );

  useEffect(() => {
    EMOTIONS.forEach((em) => {
      ['girl', 'boy'].forEach((ch) => {
        const key = `${ch}_${em.id}`;
        if (!loadedImagesRef.current[key]) {
          const img = new Image();
          img.src = getImgForCharacter(em, ch);
          img.onload = () => {
            loadedImagesRef.current[key] = img;
            drawWheelCanvas(wheelAngle);
          };
        }
      });
    });
  }, [drawWheelCanvas, wheelAngle]);

  useEffect(() => {
    drawWheelCanvas(wheelAngle);
  }, [character, wheelAngle, drawWheelCanvas]);

  const activeEm = EMOTIONS[wheelPreviewIndex] || EMOTIONS[0];

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
      <div className="wheel-wrapper" onClick={onSpin}>
        <div className="wheel-pointer" aria-hidden="true"></div>
        <canvas
          ref={wheelCanvasRef}
          width="350"
          height="350"
          className="cursor-pointer max-w-full h-auto"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div
          className="w-64 h-64 md:w-80 md:h-80 rounded-3xl border-8 overflow-hidden shadow-xl transition-transform duration-200"
          style={{
            borderColor: activeEm.color,
            transform: !isRolling && hasRolledOnce ? 'scale(1.04)' : 'scale(1)',
          }}
        >
          <img
            src={getImgForCharacter(activeEm, character)}
            alt={activeEm.title}
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>
        <div
          className="px-7 py-2.5 rounded-2xl border-3 font-black text-2xl shadow-sm flex items-center gap-2.5"
          style={{
            backgroundColor: activeEm.color,
            borderColor: activeEm.border,
            color: activeEm.id === 'basardim' ? '#0F172A' : '#FFFFFF',
          }}
        >
          <span>{activeEm.emoji}</span>
          <span>{activeEm.title}</span>
        </div>
      </div>
    </div>
  );
}

