import React from 'react';

/**
 * Verilen spriteları yönüne göre baş aşağı düşmeden (ör. balık solda yatay çevrilir)
 * doğru açıya döndüren SVG bileşeni.
 */
function getTransformForDirection(sprite, direction) {
  if (sprite === 'fish' && direction === 'left') {
    return 'scaleX(-1)';
  }
  const angleMap = {
    right: 0,
    down: 90,
    left: 180,
    up: -90,
  };
  return `rotate(${angleMap[direction] ?? 0}deg)`;
}

function renderSpriteSvg(sprite, accentColor) {
  switch (sprite) {
    case 'rocket':
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          {/* Alev */}
          <path d="M12 60 L34 48 L28 60 L34 72 Z" fill="#F97316" />
          <path d="M20 60 L34 53 L30 60 L34 67 Z" fill="#FACC15" />
          {/* Kanatlar */}
          <path d="M36 42 L26 22 L56 38 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3" strokeLinejoin="round" />
          <path d="M36 78 L26 98 L56 82 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3" strokeLinejoin="round" />
          {/* Gövde */}
          <path
            d="M34 40 C58 32, 86 38, 108 60 C86 82, 58 88, 34 80 Z"
            fill="#F8FAFC"
            stroke="#1E293B"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Burun */}
          <path d="M84 44 C95 49, 102 54, 108 60 C102 66, 95 71, 84 76 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="3.5" />
          {/* Pencere */}
          <circle cx="64" cy="60" r="11" fill="#38BDF8" stroke="#1E293B" strokeWidth="3.5" />
          <circle cx="67" cy="57" r="3" fill="#FFFFFF" opacity="0.85" />
        </svg>
      );

    case 'fish':
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          {/* Kuyruk */}
          <path d="M30 60 L8 38 L16 60 L8 82 Z" fill="#F97316" stroke="#9A3412" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Üst yüzgeç */}
          <path d="M50 36 Q65 18 76 38 Z" fill="#FACC15" stroke="#9A3412" strokeWidth="3" strokeLinejoin="round" />
          {/* Gövde */}
          <ellipse cx="64" cy="60" rx="38" ry="26" fill="#FB923C" stroke="#9A3412" strokeWidth="4" />
          {/* Pullar */}
          <path d="M52 48 Q58 60 52 72" fill="none" stroke="#FED7AA" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M64 46 Q70 60 64 74" fill="none" stroke="#FED7AA" strokeWidth="3.5" strokeLinecap="round" />
          {/* Göz ve gülüş */}
          <circle cx="84" cy="53" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="86" cy="53" r="2.8" fill="#0F172A" />
          <path d="M90 65 Q96 68 99 63" fill="none" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'plane':
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          {/* Kanatlar */}
          <path d="M56 14 L76 52 L50 52 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M56 106 L76 68 L50 68 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Arka kuyruk kanatları */}
          <path d="M18 38 L32 54 L16 54 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="3" strokeLinejoin="round" />
          <path d="M18 82 L32 66 L16 66 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="3" strokeLinejoin="round" />
          {/* Gövde */}
          <path
            d="M14 54 L86 48 C100 48, 108 54, 108 60 C108 66, 100 72, 86 72 L14 66 Z"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="3.8"
            strokeLinejoin="round"
          />
          {/* Kokpit */}
          <ellipse cx="86" cy="60" rx="9" ry="6" fill="#0EA5E9" stroke="#0F172A" strokeWidth="2.5" />
        </svg>
      );

    case 'ladybug':
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          {/* Antenler */}
          <path d="M88 48 Q100 38 106 42" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M88 72 Q100 82 106 78" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          {/* Bacaklar */}
          <path d="M40 30 L36 18 M58 28 L58 16 M74 34 L78 22" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <path d="M40 90 L36 102 M58 92 L58 104 M74 86 L78 98" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          {/* Kırmızı kabuk */}
          <circle cx="54" cy="60" r="32" fill="#EF4444" stroke="#1E293B" strokeWidth="4" />
          {/* Kafa */}
          <path d="M76 38 A24 24 0 0 1 76 82 Z" fill="#1E293B" />
          {/* Orta çizgi */}
          <line x1="22" y1="60" x2="82" y2="60" stroke="#1E293B" strokeWidth="3.5" />
          {/* Benekler */}
          <circle cx="44" cy="44" r="5.5" fill="#1E293B" />
          <circle cx="62" cy="42" r="4.5" fill="#1E293B" />
          <circle cx="44" cy="76" r="5.5" fill="#1E293B" />
          <circle cx="62" cy="78" r="4.5" fill="#1E293B" />
          {/* Gözler */}
          <circle cx="88" cy="52" r="3.2" fill="#FFFFFF" />
          <circle cx="88" cy="68" r="3.2" fill="#FFFFFF" />
        </svg>
      );

    case 'arrow':
    default:
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          <path
            d="M16 44 L64 44 L64 22 L108 60 L64 98 L64 76 L16 76 Z"
            fill={accentColor || '#0EA5E9'}
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <circle cx="44" cy="54" r="4" fill="#FFFFFF" />
          <circle cx="44" cy="66" r="4" fill="#FFFFFF" />
        </svg>
      );
  }
}

export default function DirectionVisual({ sprite = 'rocket', direction = 'right', accentColor, sizeClass = 'w-28 h-28' }) {
  return (
    <div
      className={`${sizeClass} flex items-center justify-center transition-transform duration-300`}
      style={{ transform: getTransformForDirection(sprite, direction) }}
    >
      {renderSpriteSvg(sprite, accentColor)}
    </div>
  );
}
