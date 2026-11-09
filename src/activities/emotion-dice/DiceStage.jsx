import React from 'react';
import { EMOTIONS, getImgForCharacter } from './config';

export default function DiceStage({
  diceCount,
  diceWinners,
  spinCounts,
  character,
  isRolling,
  hasRolledOnce,
  onRoll,
}) {
  const getCubeTransform = (cubeIdx) => {
    const winnerEm = EMOTIONS[diceWinners[cubeIdx]] || EMOTIONS[0];
    const turns = spinCounts[cubeIdx];
    const rx = turns.tx * 360 + winnerEm.rx;
    const ry = turns.ty * 360 + winnerEm.ry;
    return `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-7">
      <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
        {Array.from({ length: diceCount }, (_, cubeIdx) => {
          const winnerEm = EMOTIONS[diceWinners[cubeIdx]] || EMOTIONS[0];
          return (
            <div key={cubeIdx} className="flex flex-col items-center gap-5">
              {diceCount === 2 && (
                <span className="px-4 py-1 rounded-full bg-slate-100 border-2 border-slate-300 font-black text-slate-700 text-base">
                  {cubeIdx + 1}. İfade
                </span>
              )}

              <div
                className={`emotion-dice-scene ${diceCount === 2 ? 'is-dual' : ''}`}
                onClick={onRoll}
                title="Zarı Atmak İçin Dokun!"
              >
                <div
                  className={`emotion-cube ${!isRolling && hasRolledOnce ? 'is-landed' : ''}`}
                  style={{ transform: getCubeTransform(cubeIdx) }}
                >
                  {EMOTIONS.map((em, faceIdx) => (
                    <div
                      key={em.id}
                      className={`emotion-cube-face face-${faceIdx} ${
                        !isRolling && hasRolledOnce && diceWinners[cubeIdx] === faceIdx
                          ? 'is-winner-face'
                          : ''
                      }`}
                    >
                      <img
                        src={getImgForCharacter(em, character)}
                        alt={em.title}
                        draggable="false"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="px-6 py-2.5 rounded-2xl border-3 font-black text-xl md:text-2xl shadow-sm transition-all flex items-center gap-2.5"
                style={{
                  backgroundColor: isRolling ? '#F1F5F9' : winnerEm.color,
                  borderColor: isRolling ? '#CBD5E1' : winnerEm.border,
                  color: isRolling
                    ? '#475569'
                    : winnerEm.id === 'basardim'
                    ? '#0F172A'
                    : '#FFFFFF',
                }}
              >
                <span>{isRolling ? '🎲' : winnerEm.emoji}</span>
                <span>{isRolling ? 'Dönüyor...' : winnerEm.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

