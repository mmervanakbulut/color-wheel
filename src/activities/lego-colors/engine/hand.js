/**
 * @file js/hand.js
 * @description El (Sol/Sağ/İki El) ve Yön (El Üstü / Avuç İçi) SVG çizimi,
 *              parmak uçlarındaki 3D Lego parçalarının güncellenmesi.
 */

(function (app) {
  function isHandMirrored(handSide, handView) {
    if (handView === 'back') {
      return handSide === 'left';
    }
    return handSide === 'right';
  }

  function renderHands(onFingerClick) {
    const container = document.getElementById('hands-container');
    if (!container) return;

    const { handType, handView } = app.state.settings;
    const handsToRender = handType === 'both'
      ? [{ side: 'left', offsetGlobal: 0, label: 'SOL EL' }, { side: 'right', offsetGlobal: 5, label: 'SAĞ EL' }]
      : [{ side: handType, offsetGlobal: 0, label: handType === 'left' ? 'SOL EL' : 'SAĞ EL' }];

    container.className = `hands-stage ${handType === 'both' ? 'two-hands' : 'single-hand'}`;
    container.innerHTML = handsToRender
      .map(h => createSingleHandMarkup(h.side, handView, h.offsetGlobal, h.label))
      .join('');

    container.querySelectorAll('.finger-node').forEach(node => {
      node.addEventListener('click', () => {
        const gIdx = Number(node.dataset.globalIndex);
        if (onFingerClick) onFingerClick(gIdx);
      });
    });

    updateHandVisuals();
  }

  function createSingleHandMarkup(handSide, handView, offsetGlobal, handLabel) {
    const mirrored = isHandMirrored(handSide, handView);
    const viewLabel = handView === 'back' ? 'Elin Üstü' : 'Avuç İçi';

    const fingersSvg = app.FINGER_DEFINITIONS.map(f => {
      const globalIdx = offsetGlobal + f.index;
      const x = mirrored ? (400 - f.x) : f.x;
      const y = f.y;

      return `
        <g class="finger-node" id="finger-node-${globalIdx}" data-global-index="${globalIdx}" transform="translate(${x}, ${y})">
          <!-- Aktif Parmak Ok İşareti -->
          <g class="active-pointer" transform="translate(0, -68)">
            <path d="M -15,-20 L 15,-20 L 0,4 Z" fill="#FF3D00" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/>
          </g>

          <!-- Aktif Parmak Halka Efekti -->
          <circle class="finger-pulse-ring" cx="0" cy="-16" r="38" fill="none" stroke="#FFD600" stroke-width="4" stroke-dasharray="8 6" />

          <!-- 3D Lego Parçası Grubu (Yazısız, Saf Görsel) -->
          <g class="lego-brick-group" id="lego-brick-${globalIdx}" transform="translate(0, -18)">
            <rect class="lego-stud" x="-20" y="-32" width="14" height="8" rx="3" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2.5"/>
            <rect class="lego-stud" x="6"   y="-32" width="14" height="8" rx="3" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2.5"/>
            <rect class="lego-body" x="-28" y="-25" width="56" height="40" rx="9" fill="#F1F5F9" stroke="#94A3B8" stroke-width="3"/>
            <rect x="-22" y="-20" width="44" height="7" rx="3.5" fill="rgba(255,255,255,0.45)" pointer-events="none"/>
            <circle class="lego-inner-dot" cx="-11" cy="-2" r="5" fill="rgba(0,0,0,0.08)" pointer-events="none"/>
            <circle class="lego-inner-dot" cx="11"  cy="-2" r="5" fill="rgba(0,0,0,0.08)" pointer-events="none"/>
          </g>
        </g>
      `;
    }).join('');

    const handTransform = mirrored ? 'translate(400, 0) scale(-1, 1)' : '';

    const nailsOrPalmMarkup = handView === 'back'
      ? `
        <ellipse cx="80"  cy="236" rx="11" ry="13" transform="rotate(-28 80 236)" fill="#FFE4E6" stroke="#EDA69E" stroke-width="2" opacity="0.85"/>
        <ellipse cx="147" cy="115" rx="11" ry="14" transform="rotate(-6 147 115)" fill="#FFE4E6" stroke="#EDA69E" stroke-width="2" opacity="0.85"/>
        <ellipse cx="215" cy="90"  rx="12" ry="15" fill="#FFE4E6" stroke="#EDA69E" stroke-width="2" opacity="0.85"/>
        <ellipse cx="280" cy="115" rx="11" ry="14" transform="rotate(6 280 115)" fill="#FFE4E6" stroke="#EDA69E" stroke-width="2" opacity="0.85"/>
        <ellipse cx="336" cy="176" rx="9.5" ry="12" transform="rotate(18 336 176)" fill="#FFE4E6" stroke="#EDA69E" stroke-width="2" opacity="0.85"/>
        <path d="M 140 165 Q 150 160 160 165 M 205 145 Q 215 140 225 145 M 270 165 Q 280 160 290 165 M 320 212 Q 330 208 338 214" stroke="#E09F7D" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
      `
      : `
        <path d="M 135 280 Q 215 245 315 275" stroke="#D9916B" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.65"/>
        <path d="M 130 310 Q 200 295 255 375" stroke="#D9916B" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.65"/>
        <path d="M 175 260 Q 230 315 215 390" stroke="#D9916B" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.45"/>
      `;

    return `
      <div class="hand-card" data-hand-side="${handSide}">
        <svg class="hand-svg" viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skinGrad-${handSide}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFD3B6"/>
              <stop offset="100%" stop-color="#F6B28B"/>
            </linearGradient>
            <filter id="handShadow-${handSide}" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(15, 23, 42, 0.15)"/>
            </filter>
          </defs>

          <g transform="${handTransform}" filter="url(#handShadow-${handSide})">
            <rect x="148" y="380" width="144" height="65" rx="22" fill="url(#skinGrad-${handSide})" stroke="#E09469" stroke-width="4"/>
            <path d="
              M 122 395
              C 98 355, 88 315, 65 262
              C 52 232, 62 212, 82 216
              C 100 220, 114 248, 128 272
              L 132 122
              C 132 95, 164 95, 166 122
              L 174 228
              L 196 92
              C 198 64, 232 64, 234 92
              L 236 226
              L 262 114
              C 266 88, 298 92, 296 120
              L 286 244
              L 320 172
              C 330 150, 358 162, 348 188
              L 318 298
              C 314 345, 304 378, 290 398
              Z
            " fill="url(#skinGrad-${handSide})" stroke="#E09469" stroke-width="4" stroke-linejoin="round"/>
            ${nailsOrPalmMarkup}
          </g>

          ${fingersSvg}
        </svg>
      </div>
    `;
  }

  function updateHandVisuals(previewColor = null) {
    const activeGlobalIdx = app.getCurrentFingerGlobalIndex();
    const totalFingers = app.state.settings.handType === 'both' ? 10 : 5;

    for (let gIdx = 0; gIdx < totalFingers; gIdx++) {
      const node = document.getElementById(`finger-node-${gIdx}`);
      const brick = document.getElementById(`lego-brick-${gIdx}`);
      if (!node || !brick) continue;

      const isCurrent = gIdx === activeGlobalIdx && !app.state.allCompleted;
      const assigned = app.state.assignedColors[gIdx];
      const displayColor = (isCurrent && previewColor) ? previewColor : assigned;

      node.classList.toggle('is-active', isCurrent);
      node.classList.toggle('is-completed', Boolean(assigned));
      node.classList.toggle('is-cycling', Boolean(isCurrent && previewColor));

      const bodyRect = brick.querySelector('.lego-body');
      const studs = brick.querySelectorAll('.lego-stud');

      if (displayColor) {
        bodyRect.setAttribute('fill', displayColor.hex);
        bodyRect.setAttribute('stroke', displayColor.border);
        studs.forEach(s => {
          s.setAttribute('fill', displayColor.hex);
          s.setAttribute('stroke', displayColor.border);
        });
      } else {
        bodyRect.setAttribute('fill', isCurrent ? '#FFFBEB' : '#F1F5F9');
        bodyRect.setAttribute('stroke', isCurrent ? '#F59E0B' : '#94A3B8');
        studs.forEach(s => {
          s.setAttribute('fill', isCurrent ? '#FEF3C7' : '#E2E8F0');
          s.setAttribute('stroke', isCurrent ? '#F59E0B' : '#94A3B8');
        });
      }
    }
  }

  Object.assign(app, {
    isHandMirrored,
    renderHands,
    updateHandVisuals
  });
})(window.LegoApp);
