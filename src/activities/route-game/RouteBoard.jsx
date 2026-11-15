import React from 'react';

export default function RouteBoard({
  level,
  theme,
  heroPos,
  heroFacing,
  visitedCells,
  isDizzy,
  collisionCellKey,
  canClickAdjacent,
  onStepDirection,
}) {
  if (!level) return null;
  const { size, target, obstacles } = level;

  const getAdjacentDir = (r, c) => {
    const dr = r - heroPos.r;
    const dc = c - heroPos.c;
    if (dr === -1 && dc === 0) return 'UP';
    if (dr === 1 && dc === 0) return 'DOWN';
    if (dr === 0 && dc === -1) return 'LEFT';
    if (dr === 0 && dc === 1) return 'RIGHT';
    return null;
  };

  const iconSizeClass = size >= 8 ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-5xl';

  return (
    <div className="route-board-frame">
      <div
        className="route-grid"
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
          const isTarget = target.r === r && target.c === c;
          const isObstacle = obstacles.has(key);
          const isVisited = visitedCells.has(key);
          const isCollision = collisionCellKey === key;
          const adjDir = canClickAdjacent ? getAdjacentDir(r, c) : null;

          return (
            <div
              key={key}
              onClick={() => adjDir && onStepDirection(adjDir)}
              className={`route-cell ${isVisited && !isHero ? 'is-visited' : ''} ${
                isTarget ? 'is-target' : ''
              } ${isObstacle ? 'is-obstacle' : ''} ${isCollision ? 'is-collision' : ''} ${
                adjDir ? 'is-adjacent' : ''
              }`}
              title={adjDir ? 'Bu yöne gitmek için dokun' : undefined}
            >
              {isHero ? (
                <span
                  className={`route-hero-icon ${iconSizeClass} ${isDizzy ? 'is-dizzy' : ''}`}
                  style={{
                    transform: heroFacing === 'LEFT' ? 'scaleX(-1)' : 'scaleX(1)',
                  }}
                >
                  {isDizzy ? '😵' : theme.heroIcon}
                </span>
              ) : isTarget ? (
                <span className={iconSizeClass}>{theme.targetIcon}</span>
              ) : isObstacle ? (
                <span className={iconSizeClass}>{theme.obstacleIcon}</span>
              ) : isVisited ? (
                <span className="route-footprint" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
