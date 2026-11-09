/**
 * @file js/tower.js
 * @description Üst üste Lego Kule (Tower) etkinliği için 3D geçmeli SVG kule çizimi
 *              ve kat bazlı renk döngüsü / kilitlenme güncellemeleri.
 */

(function (app) {
  /**
   * Kule sahnesini (`#hands-container` içine) mevcut `towerHeight` (3..10) ayarına göre çizer.
   * @param {Function} onBrickClick Bir kule katına dokunulduğunda çağrılacak fonksiyon
   */
  function renderTower(onBrickClick) {
    const container = document.getElementById('hands-container');
    if (!container) return;

    const count = Math.min(10, Math.max(3, Number(app.state.settings.towerHeight) || 5));
    container.className = 'hands-stage tower-stage';

    // Kule yüksekliğine göre dinamik blok boyutları (420x460 SVG alanı içinde)
    const baseY = 408;
    const availableHeight = 340;
    const brickHeight = Math.min(62, Math.floor(availableHeight / count));
    const brickWidth = Math.min(210, Math.max(150, brickHeight * 3.1));
    const studCount = 4;
    const studWidth = Math.floor(brickWidth * 0.14);
    const studHeight = Math.max(8, Math.floor(brickHeight * 0.18));
    const studGap = (brickWidth - studCount * studWidth) / (studCount + 1);

    const centerX = 210;
    const brickLeft = centerX - brickWidth / 2;

    // Katları aşağıdan yukarıya (0 -> count - 1) oluştur
    const bricksSvg = Array.from({ length: count }, (_, idx) => {
      const yBottom = baseY - idx * brickHeight;
      const yTop = yBottom - brickHeight;

      // 4 adet üst Lego dişi (stud)
      const studsMarkup = Array.from({ length: studCount }, (__, sIdx) => {
        const sx = -brickWidth / 2 + studGap + sIdx * (studWidth + studGap);
        return `<rect class="lego-stud" x="${sx.toFixed(1)}" y="${(-brickHeight / 2 - studHeight + 2).toFixed(1)}" width="${studWidth}" height="${studHeight}" rx="3" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2.5"/>`;
      }).join('');

      // Gövde içi 3D yuvarlak izler (yazısız Lego dokusu)
      const innerDotsMarkup = [-0.28, 0, 0.28].map(ratio => {
        return `<circle class="tower-inner-dot" cx="${(brickWidth * ratio).toFixed(1)}" cy="2" r="${Math.max(4, brickHeight * 0.11).toFixed(1)}" fill="rgba(0,0,0,0.08)" pointer-events="none"/>`;
      }).join('');

      const centerY = yTop + brickHeight / 2;

      return `
        <g class="tower-brick-node" id="finger-node-${idx}" data-global-index="${idx}" transform="translate(${centerX}, ${centerY})">
          <!-- Aktif Kat Sol ve Sağ İşaret Okları -->
          <g class="active-pointer-left" transform="translate(${-brickWidth / 2 - 28}, 0)">
            <path d="M -16,-14 L 6,0 L -16,14 Z" fill="#FF3D00" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/>
          </g>
          <g class="active-pointer-right" transform="translate(${brickWidth / 2 + 28}, 0)">
            <path d="M 16,-14 L -6,0 L 16,14 Z" fill="#FF3D00" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/>
          </g>

          <!-- 3D Lego Kule Bloğu -->
          <g class="lego-brick-group" id="lego-brick-${idx}">
            ${studsMarkup}
            <rect class="lego-body"
                  x="${(-brickWidth / 2).toFixed(1)}"
                  y="${(-brickHeight / 2).toFixed(1)}"
                  width="${brickWidth}"
                  height="${brickHeight}"
                  rx="8"
                  fill="#F8FAFC"
                  stroke="#94A3B8"
                  stroke-width="3"/>
            <!-- Üst Parlaklık Şeridi -->
            <rect class="lego-gloss"
                  x="${(-brickWidth / 2 + 10).toFixed(1)}"
                  y="${(-brickHeight / 2 + 6).toFixed(1)}"
                  width="${(brickWidth - 20).toFixed(1)}"
                  height="${Math.max(5, brickHeight * 0.14).toFixed(1)}"
                  rx="3"
                  fill="rgba(255,255,255,0.42)"
                  pointer-events="none"/>
            ${innerDotsMarkup}
          </g>
        </g>
      `;
    }).join('');

    // Alt taban plakası (Baseplate) dişleri
    const basePlateWidth = brickWidth + 76;
    const basePlateLeft = centerX - basePlateWidth / 2;

    container.innerHTML = `
      <div class="hand-card tower-card">
        <svg class="hand-svg tower-svg" viewBox="0 0 420 450" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="towerShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(15, 23, 42, 0.16)"/>
            </filter>
          </defs>

          <!-- Kule Gölge ve Zemin Plakası (Baseplate) -->
          <g filter="url(#towerShadow)">
            <rect x="${basePlateLeft.toFixed(1)}" y="${baseY}" width="${basePlateWidth.toFixed(1)}" height="22" rx="7" fill="#475569" stroke="#1E293B" stroke-width="3"/>
            <rect x="${(basePlateLeft + 8).toFixed(1)}" y="${baseY + 4}" width="${(basePlateWidth - 16).toFixed(1)}" height="5" rx="2.5" fill="rgba(255,255,255,0.22)"/>
          </g>

          <!-- Lego Kule Katları (Aşağıdan Yukarıya) -->
          <g filter="url(#towerShadow)">
            ${bricksSvg}
          </g>
        </svg>
      </div>
    `;

    container.querySelectorAll('.tower-brick-node').forEach(node => {
      node.addEventListener('click', () => {
        const gIdx = Number(node.dataset.globalIndex);
        if (onBrickClick) onBrickClick(gIdx);
      });
    });

    updateTowerVisuals();
  }

  /**
   * Kuledeki tüm Lego katlarının renklerini, aktif kat oklarını ve hayalet/kilitli durumlarını günceller.
   * @param {Object|null} previewColor Döngü/Çark dönerken aktif katta geçici gösterilecek renk
   */
  function updateTowerVisuals(previewColor = null) {
    const activeGlobalIdx = app.getCurrentFingerGlobalIndex();
    const count = Math.min(10, Math.max(3, Number(app.state.settings.towerHeight) || 5));

    for (let gIdx = 0; gIdx < count; gIdx++) {
      const node = document.getElementById(`finger-node-${gIdx}`);
      const brick = document.getElementById(`lego-brick-${gIdx}`);
      if (!node || !brick) continue;

      const isCurrent = gIdx === activeGlobalIdx && !app.state.allCompleted;
      const assigned = app.state.assignedColors[gIdx];
      const displayColor = (isCurrent && previewColor) ? previewColor : assigned;

      node.classList.toggle('is-active', isCurrent);
      node.classList.toggle('is-completed', Boolean(assigned));
      node.classList.toggle('is-cycling', Boolean(isCurrent && previewColor));
      node.classList.toggle('is-empty-slot', !displayColor && !isCurrent);

      const bodyRect = brick.querySelector('.lego-body');
      const studs = brick.querySelectorAll('.lego-stud');

      if (displayColor) {
        bodyRect.setAttribute('fill', displayColor.hex);
        bodyRect.setAttribute('stroke', displayColor.border);
        bodyRect.removeAttribute('stroke-dasharray');
        bodyRect.setAttribute('opacity', '1');
        studs.forEach(s => {
          s.setAttribute('fill', displayColor.hex);
          s.setAttribute('stroke', displayColor.border);
          s.removeAttribute('stroke-dasharray');
          s.setAttribute('opacity', '1');
        });
      } else if (isCurrent) {
        bodyRect.setAttribute('fill', '#FFFBEB');
        bodyRect.setAttribute('stroke', '#F59E0B');
        bodyRect.setAttribute('stroke-dasharray', '10 6');
        bodyRect.setAttribute('opacity', '1');
        studs.forEach(s => {
          s.setAttribute('fill', '#FEF3C7');
          s.setAttribute('stroke', '#F59E0B');
          s.removeAttribute('stroke-dasharray');
          s.setAttribute('opacity', '1');
        });
      } else {
        // Henüz sırası gelmemiş üst katlar (Yarı saydam hayalet Lego yuvası)
        bodyRect.setAttribute('fill', 'rgba(241, 245, 249, 0.55)');
        bodyRect.setAttribute('stroke', '#CBD5E1');
        bodyRect.setAttribute('stroke-dasharray', '8 6');
        bodyRect.setAttribute('opacity', '0.75');
        studs.forEach(s => {
          s.setAttribute('fill', 'rgba(226, 232, 240, 0.55)');
          s.setAttribute('stroke', '#CBD5E1');
          s.setAttribute('stroke-dasharray', '5 4');
          s.setAttribute('opacity', '0.75');
        });
      }
    }
  }

  Object.assign(app, {
    renderTower,
    updateTowerVisuals
  });
})(window.LegoApp);

