/**
 * @file js/quiz.js
 * @description 1'li, 2'li, 3'lü, 4'lü... (1-6 arası) Rastgele Lego Renk/Örüntü Eşleştirme Modu.
 *              Üstte hedef Lego(lar), altta 3 seçenek kartı (Üst Üste Kule veya Yan Yana dizilim).
 */

(function (app) {
  let lastTargetSignature = '';
  let autoNextTimerId = null;

  const quizState = {
    targetCombo: [],        // ColorObj[] (uzunluk: quizLength)
    options: [],            // [ColorObj[], ColorObj[], ColorObj[]] (3 seçenek)
    correctOptionIndex: 0,  // 0, 1 veya 2
    wrongSelections: {},    // { [optIndex]: true }
    answered: false
  };

  function clearAutoNextTimer() {
    if (autoNextTimerId) {
      clearTimeout(autoNextTimerId);
      autoNextTimerId = null;
    }
  }

  function getComboSignature(combo) {
    return combo.map(c => c.id).join('-');
  }

  /**
   * En az 3 farklı seçenek üretebilmek için renk havuzunu hazırlar.
   */
  function getQuizColorPool() {
    const active = app.getActiveColors();
    if (active.length >= 3) return active;
    const pool = [...active];
    for (const defColor of app.DEFAULT_COLORS) {
      if (!pool.some(c => c.id === defColor.id)) {
        pool.push(defColor);
      }
      if (pool.length >= 3) break;
    }
    return pool;
  }

  /**
   * Belirtilen uzunlukta (`length`) rastgele bir Lego renk dizisi üretir.
   */
  function createRandomCombo(pool, length, avoidAdjacentRepeat) {
    const combo = [];
    for (let i = 0; i < length; i++) {
      let candidates = pool;
      if (avoidAdjacentRepeat && i > 0 && pool.length > 1) {
        candidates = pool.filter(c => c.id !== combo[i - 1].id);
      }
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      combo.push(picked);
    }
    return combo;
  }

  /**
   * Hedef kombinasyona benzeyen ama farklı olan çeldirici (distractor) kombinasyon üretir.
   */
  function createDistractorCombo(targetCombo, pool, existingSignatures) {
    const length = targetCombo.length;

    // 1'li soruda doğrudan havuzdaki diğer farklı renklerden seç
    if (length === 1) {
      const unused = pool.filter(c => !existingSignatures.has(c.id));
      if (unused.length > 0) {
        const picked = unused[Math.floor(Math.random() * unused.length)];
        return [picked];
      }
    }

    // Çoklu (2'li, 3'lü, 4'lü...) sorularda önce 1 veya 2 parçayı değiştirerek yakın çeldirici dene
    for (let attempt = 0; attempt < 40; attempt++) {
      let candidate;
      if (attempt < 20 && length >= 2) {
        candidate = [...targetCombo];
        // Rastgele bir pozisyonu farklı bir renkle değiştir veya iki pozisyonun yerini değiştir
        if (Math.random() < 0.45 && length >= 2) {
          const i = Math.floor(Math.random() * length);
          const j = (i + 1 + Math.floor(Math.random() * (length - 1))) % length;
          [candidate[i], candidate[j]] = [candidate[j], candidate[i]];
        }
        const pos = Math.floor(Math.random() * length);
        const otherColors = pool.filter(c => c.id !== candidate[pos].id);
        if (otherColors.length > 0) {
          candidate[pos] = otherColors[Math.floor(Math.random() * otherColors.length)];
        }
      } else {
        candidate = createRandomCombo(pool, length, false);
      }

      const sig = getComboSignature(candidate);
      if (!existingSignatures.has(sig)) {
        return candidate;
      }
    }

    // Yedek garantili farklı kombinasyon
    const fallback = [...targetCombo];
    const firstOthers = pool.filter(c => c.id !== fallback[0].id);
    if (firstOthers.length > 0) fallback[0] = firstOthers[0];
    return fallback;
  }

  /**
   * Yeni bir rastgele soru ve 3 seçeneğini oluşturur.
   */
  function generateQuizQuestion() {
    clearAutoNextTimer();
    const length = Math.min(6, Math.max(1, Number(app.state.settings.quizLength) || 1));
    const pool = getQuizColorPool();
    const activePool = app.getActiveColors();
    const targetSourcePool = activePool.length >= 2 ? activePool : pool;

    let targetCombo = [];
    let targetSig = '';
    for (let tries = 0; tries < 15; tries++) {
      targetCombo = createRandomCombo(targetSourcePool, length, app.state.settings.noRepeatAdjacent);
      targetSig = getComboSignature(targetCombo);
      if (targetSig !== lastTargetSignature) break;
    }
    lastTargetSignature = targetSig;

    const usedSignatures = new Set([targetSig]);
    const distractor1 = createDistractorCombo(targetCombo, pool, usedSignatures);
    usedSignatures.add(getComboSignature(distractor1));

    const distractor2 = createDistractorCombo(targetCombo, pool, usedSignatures);
    usedSignatures.add(getComboSignature(distractor2));

    const rawOptions = [
      { combo: targetCombo, isCorrect: true },
      { combo: distractor1, isCorrect: false },
      { combo: distractor2, isCorrect: false }
    ];

    // Seçeneklerin sırasını karıştır
    for (let i = rawOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawOptions[i], rawOptions[j]] = [rawOptions[j], rawOptions[i]];
    }

    quizState.targetCombo = targetCombo;
    quizState.options = rawOptions.map(o => o.combo);
    quizState.correctOptionIndex = rawOptions.findIndex(o => o.isCorrect);
    quizState.wrongSelections = {};
    quizState.answered = false;

    // Sesli okuma açıksa hedef renkleri oku
    const spokenNames = targetCombo.map(c => c.name).join(', ');
    app.speakText(spokenNames);
  }

  /**
   * Bir Lego kombinasyonunu ('vertical' kule veya 'horizontal' yan yana) 3D SVG olarak üretir.
   */
  function createBrickGroupSvg(combo, layout, isTarget = false) {
    const count = combo.length;

    if (layout === 'horizontal') {
      // YAN YANA LEGO DİZİLİMİ
      const brickW = count <= 2 ? 84 : count === 3 ? 68 : count === 4 ? 56 : 46;
      const brickH = Math.round(brickW * 0.68);
      const gap = count <= 3 ? 10 : 7;
      const studH = Math.max(7, Math.round(brickH * 0.2));
      const studW = Math.max(10, Math.round(brickW * 0.24));

      const totalW = count * brickW + (count - 1) * gap;
      const svgW = Math.max(180, totalW + 36);
      const svgH = brickH + studH + 34;
      const startX = (svgW - totalW) / 2;
      const bodyY = (svgH - brickH) / 2 + 4;

      const bricksMarkup = combo.map((color, idx) => {
        const x = startX + idx * (brickW + gap);
        const s1x = x + brickW * 0.18;
        const s2x = x + brickW * 0.58;
        return `
          <g>
            <rect x="${s1x.toFixed(1)}" y="${(bodyY - studH + 2).toFixed(1)}" width="${studW}" height="${studH}" rx="3" fill="${color.hex}" stroke="${color.border}" stroke-width="2.5"/>
            <rect x="${s2x.toFixed(1)}" y="${(bodyY - studH + 2).toFixed(1)}" width="${studW}" height="${studH}" rx="3" fill="${color.hex}" stroke="${color.border}" stroke-width="2.5"/>
            <rect x="${x.toFixed(1)}" y="${bodyY.toFixed(1)}" width="${brickW}" height="${brickH}" rx="8" fill="${color.hex}" stroke="${color.border}" stroke-width="3"/>
            <rect x="${(x + 6).toFixed(1)}" y="${(bodyY + 5).toFixed(1)}" width="${(brickW - 12).toFixed(1)}" height="${Math.max(5, brickH * 0.15).toFixed(1)}" rx="3" fill="rgba(255,255,255,0.42)"/>
          </g>
        `;
      }).join('');

      return `
        <svg class="quiz-combo-svg is-horizontal ${isTarget ? 'target-svg' : 'option-svg'}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
          ${bricksMarkup}
        </svg>
      `;
    }

    // ÜST ÜSTE (KULE) LEGO DİZİLİMİ (Aşağıdan yukarıya: idx 0 en altta)
    const brickH = count === 1 ? 66 : count === 2 ? 54 : count === 3 ? 44 : count === 4 ? 36 : 30;
    const brickW = Math.round(brickH * 2.45);
    const studH = Math.max(7, Math.round(brickH * 0.22));
    const studCount = 3;
    const studW = Math.round(brickW * 0.18);
    const studGap = (brickW - studCount * studW) / (studCount + 1);

    const totalTowerH = count * brickH + studH;
    const svgW = Math.max(160, brickW + 44);
    const svgH = Math.max(115, totalTowerH + 28);
    const centerX = svgW / 2;
    const baseY = svgH - 14;

    const bricksMarkup = combo.map((color, idx) => {
      const yBottom = baseY - idx * brickH;
      const yTop = yBottom - brickH;
      const xLeft = centerX - brickW / 2;

      const studs = Array.from({ length: studCount }, (__, sIdx) => {
        const sx = xLeft + studGap + sIdx * (studW + studGap);
        return `<rect x="${sx.toFixed(1)}" y="${(yTop - studH + 2).toFixed(1)}" width="${studW}" height="${studH}" rx="2.5" fill="${color.hex}" stroke="${color.border}" stroke-width="2.2"/>`;
      }).join('');

      return `
        <g>
          ${studs}
          <rect x="${xLeft.toFixed(1)}" y="${yTop.toFixed(1)}" width="${brickW}" height="${brickH}" rx="7" fill="${color.hex}" stroke="${color.border}" stroke-width="2.8"/>
          <rect x="${(xLeft + 7).toFixed(1)}" y="${(yTop + 5).toFixed(1)}" width="${(brickW - 14).toFixed(1)}" height="${Math.max(4, brickH * 0.15).toFixed(1)}" rx="2.5" fill="rgba(255,255,255,0.42)"/>
        </g>
      `;
    }).join('');

    const basePlateW = brickW + 26;
    return `
      <svg class="quiz-combo-svg is-vertical ${isTarget ? 'target-svg' : 'option-svg'}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
        <rect x="${(centerX - basePlateW / 2).toFixed(1)}" y="${baseY}" width="${basePlateW}" height="10" rx="4" fill="#64748B"/>
        ${bricksMarkup}
      </svg>
    `;
  }

  /**
   * Eşleştirme (Quiz) sahnesini `#hands-container` içine çizer.
   * @param {Object} callbacks
   * @param {Function} callbacks.onAnswered Doğru cevap verildiğinde çağrılır
   * @param {Function} callbacks.onAutoAdvance Otomatik geçiş tetiklendiğinde çağrılır
   */
  function renderQuiz({ onAnswered, onAutoAdvance } = {}) {
    const container = document.getElementById('hands-container');
    if (!container) return;

    if (quizState.targetCombo.length === 0) {
      generateQuizQuestion();
    }

    const layout = app.state.settings.quizLayout || 'vertical';
    container.className = 'hands-stage quiz-stage';

    const targetSvg = createBrickGroupSvg(quizState.targetCombo, layout, true);

    const optionsHtml = quizState.options.map((combo, optIdx) => {
      const isWrong = Boolean(quizState.wrongSelections[optIdx]);
      const isCorrect = quizState.answered && optIdx === quizState.correctOptionIndex;
      const stateClass = isCorrect ? 'is-correct' : isWrong ? 'is-wrong' : '';

      return `
        <button type="button"
                class="quiz-option-card ${stateClass}"
                data-option-index="${optIdx}"
                aria-label="Seçenek ${optIdx + 1}">
          <div class="quiz-option-content">
            ${createBrickGroupSvg(combo, layout, false)}
          </div>
          <div class="quiz-feedback-badge">${isCorrect ? '✅' : isWrong ? '❌' : ''}</div>
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="quiz-board">
        <!-- Üst: Hedef Soru Kartı -->
        <div class="quiz-target-section">
          <div class="quiz-target-card ${quizState.answered ? 'is-solved' : ''}">
            ${targetSvg}
          </div>
        </div>

        <!-- Alt: 3 Seçenek Kartı -->
        <div class="quiz-options-grid">
          ${optionsHtml}
        </div>
      </div>
    `;

    container.querySelectorAll('.quiz-option-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const optIdx = Number(btn.dataset.optionIndex);

        if (quizState.answered) {
          // Zaten doğru bilindiyse tekrar tıklamak sonraki soruya geçirir
          if (optIdx === quizState.correctOptionIndex && onAutoAdvance) {
            onAutoAdvance();
          }
          return;
        }

        if (quizState.wrongSelections[optIdx]) return;

        if (optIdx === quizState.correctOptionIndex) {
          quizState.answered = true;
          app.playLockIn();
          app.speakText('Aferin! Doğru!');
          renderQuiz({ onAnswered, onAutoAdvance });

          if (onAnswered) {
            onAnswered(quizState.targetCombo[quizState.targetCombo.length - 1]);
          }

          if (app.state.settings.quizAutoNext && onAutoAdvance) {
            clearAutoNextTimer();
            autoNextTimerId = setTimeout(() => {
              onAutoAdvance();
            }, 1450);
          }
        } else {
          quizState.wrongSelections[optIdx] = true;
          app.playWrong();
          btn.classList.add('is-wrong');
          const badge = btn.querySelector('.quiz-feedback-badge');
          if (badge) badge.textContent = '❌';
        }
      });
    });
  }

  Object.assign(app, {
    quizState,
    generateQuizQuestion,
    renderQuiz,
    clearAutoNextTimer
  });
})(window.LegoApp);

