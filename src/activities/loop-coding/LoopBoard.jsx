import React from 'react';

export default function LoopBoard({
  size,
  heroPos,
  targetPos,
  obstacles,
  visitedSet,
  collisionKey,
  theme,
}) {
  const iconClass = size >= 6 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl';

  return (
    <div className="loop-board-frame">
      <div
        className="loop-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: size * size }, (_, idx) => {
          const r = Math.floor(idx / size);
          const c = idx % size;
          const key = `${r}-${c}`;
          const isHero = heroPos.r === r && heroPos.c === c;
          const isTarget = targetPos.r === r && targetPos.c === c;
          const isObstacle = obstacles.has(key);
          const isVisited = visitedSet.has(key);
          const isCollision = collisionKey === key;

          return (
            <div
              key={key}
              className={`loop-cell ${isHero ? 'is-hero' : ''} ${
                isVisited && !isHero ? 'is-visited' : ''
              } ${isTarget ? 'is-target' : ''} ${isObstacle ? 'is-obstacle' : ''} ${
                isCollision ? 'is-collision' : ''
              }`}
            >
              {isHero ? (
                <span className={`${iconClass} leading-none drop-shadow-xs`}>{theme.hero}</span>
              ) : isTarget ? (
                <span className={`${iconClass} leading-none`}>{theme.target}</span>
              ) : isObstacle ? (
                <span className={`${iconClass} leading-none opacity-85`}>{theme.obstacle}</span>
              ) : isVisited ? (
                <span className="w-3.5 h-3.5 rounded-full bg-sky-400" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
