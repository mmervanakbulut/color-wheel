/**
 * @file js/app.js
 * @description Ana uygulama denetleyicisi: UI etkileşimleri, hızlı öğretmen araç çubuğu,
 *              renk/ayar modalı ve oyun döngüsü yönetimi.
 */

(function (app) {
  const { state } = app;

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('main-stage')) {
      initApp();
    }
  });

  function initApp() {
    app.cancelAnimation?.();
    app.clearAutoNextTimer?.();
    state.isSpinning = false;
    app.loadState();
    bindTopBarEvents();
    bindStageAndActionEvents();
    bindSettingsModalEvents();
    refreshFullUI();
  }

  app.initApp = initApp;

  function handleQuizAnswered(primaryColor) {
    const currentGlobalIdx = app.getCurrentFingerGlobalIndex();
    if (currentGlobalIdx !== null && primaryColor) {
      state.assignedColors[currentGlobalIdx] = primaryColor;
    }
    state.stepCompleted = true;
    updateStatusBanner();
    updateActionButtons();
    renderSequenceProgressBar();
  }

  function handleQuizNextQuestion() {
    app.clearAutoNextTimer?.();
    state.currentStepIndex += 1;
    if (state.currentStepIndex >= state.sequence.length) {
      state.sequence.push(state.currentStepIndex);
    }
    state.stepCompleted = false;
    app.generateQuizQuestion();
    renderStageTarget();
    updateStatusBanner();
    updateActionButtons();
    renderSequenceProgressBar();
  }

  function finishActivityManually() {
    if (state.isSpinning || state.allCompleted) return;
    app.cancelAnimation();
    app.clearAutoNextTimer?.();
    state.allCompleted = true;
    app.playCelebration();
    app.speakText('Tebrikler! Etkinlik tamamlandı!');
    launchConfetti();
    updateStageVisuals();
    updateStatusBanner();
    updateActionButtons();
    renderSequenceProgressBar();
  }

  function renderStageTarget() {
    if (state.settings.activity === 'quiz') {
      app.renderQuiz({
        onAnswered: handleQuizAnswered,
        onAutoAdvance: handleQuizNextQuestion
      });
    } else if (state.settings.activity === 'tower') {
      app.renderTower(handleDirectFingerClick);
    } else {
      app.renderHands(handleDirectFingerClick);
    }
  }

  function updateStageVisuals(previewColor = null) {
    if (state.settings.activity === 'quiz') {
      app.renderQuiz({
        onAnswered: handleQuizAnswered,
        onAutoAdvance: handleQuizNextQuestion
      });
    } else if (state.settings.activity === 'tower') {
      app.updateTowerVisuals(previewColor);
    } else {
      app.updateHandVisuals(previewColor);
    }
  }

  function refreshFullUI() {
    const stageEl = document.getElementById('main-stage');
    if (stageEl) {
      stageEl.dataset.gameMode = state.settings.activity === 'quiz'
        ? 'finger-only'
        : state.settings.gameMode;
    }

    syncQuickControlsUI();
    renderStageTarget();
    app.drawWheel();
    updateStatusBanner();
    updateActionButtons();
    renderSequenceProgressBar();
  }

  function syncQuickControlsUI() {
    const isQuiz = state.settings.activity === 'quiz';
    const isTower = state.settings.activity === 'tower';
    const isHand = state.settings.activity === 'hand';

    document.querySelectorAll('[data-activity]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.activity === state.settings.activity);
    });

    // Ayarlar modalındaki etkinliğe özel grupları filtrele
    const groupHand = document.getElementById('settings-group-hand');
    if (groupHand) groupHand.classList.toggle('hidden', !isHand);

    const groupTower = document.getElementById('settings-group-tower');
    if (groupTower) groupTower.classList.toggle('hidden', !isTower);

    const groupWheelCommon = document.getElementById('settings-group-wheel-common');
    if (groupWheelCommon) groupWheelCommon.classList.toggle('hidden', isQuiz);

    const groupQuiz = document.getElementById('settings-group-quiz');
    if (groupQuiz) groupQuiz.classList.toggle('hidden', !isQuiz);

    const quickHandControls = document.getElementById('quick-hand-controls');
    if (quickHandControls) {
      quickHandControls.classList.toggle('hidden', !isHand);
    }

    const wheelModeControls = document.getElementById('quick-wheel-mode-controls');
    if (wheelModeControls) {
      wheelModeControls.classList.toggle('hidden', isQuiz);
    }

    const quickTowerControls = document.getElementById('quick-tower-controls');
    if (quickTowerControls) {
      quickTowerControls.classList.toggle('hidden', !isTower);
    }

    const quickQuizControls = document.getElementById('quick-quiz-controls');
    if (quickQuizControls) {
      quickQuizControls.classList.toggle('hidden', !isQuiz);
    }

    const quickTowerLabel = document.getElementById('quick-tower-count-label');
    if (quickTowerLabel) {
      quickTowerLabel.textContent = `${state.settings.towerHeight} Kat 🧱`;
    }

    const quickQuizLengthLabel = document.getElementById('quick-quiz-length-label');
    if (quickQuizLengthLabel) {
      const qLen = Number(state.settings.quizLength) || 1;
      const suffixes = { 1: "1'li", 2: "2'li", 3: "3'lü", 4: "4'lü", 5: "5'li", 6: "6'lı" };
      quickQuizLengthLabel.textContent = `${suffixes[qLen] || (qLen + "'li")} 🧱`;
    }

    document.querySelectorAll('[data-quiz-preset]').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.quizPreset) === Number(state.settings.quizLength));
    });

    document.querySelectorAll('[data-quiz-layout]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.quizLayout === state.settings.quizLayout);
    });

    document.querySelectorAll('[data-quiz-autonext-mode]').forEach(btn => {
      const currentMode = state.settings.quizAutoNext ? 'auto' : 'manual';
      btn.classList.toggle('active', btn.dataset.quizAutonextMode === currentMode);
    });

    const autoNextBtn = document.getElementById('btn-quiz-autonext');
    if (autoNextBtn) {
      autoNextBtn.classList.toggle('is-active', Boolean(state.settings.quizAutoNext));
      autoNextBtn.innerHTML = state.settings.quizAutoNext
        ? '⏭️ <span>Otomatik</span>'
        : '✋ <span>Tuşla Geç</span>';
    }

    document.querySelectorAll('[data-tower-preset]').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.towerPreset) === Number(state.settings.towerHeight));
    });

    const towerHeightInput = document.getElementById('setting-tower-height');
    if (towerHeightInput) {
      towerHeightInput.value = String(state.settings.towerHeight);
    }

    document.querySelectorAll('[data-hand-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.handType === state.settings.handType);
    });

    document.querySelectorAll('[data-hand-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.handView === state.settings.handView);
    });

    document.querySelectorAll('[data-game-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gameMode === state.settings.gameMode);
    });

    document.querySelectorAll('[data-duration-preset]').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.durationPreset) === Number(state.settings.durationSec));
    });

    const customDurationInput = document.getElementById('setting-custom-duration');
    if (customDurationInput) {
      customDurationInput.value = String(state.settings.durationSec);
    }

    const orderSelect = document.getElementById('quick-order-select');
    if (orderSelect) {
      orderSelect.value = state.settings.fingerOrder;
    }

    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.classList.toggle('is-muted', !state.settings.soundEnabled);
      soundBtn.textContent = state.settings.soundEnabled ? '🔊' : '🔇';
    }

    const voiceBtn = document.getElementById('btn-toggle-voice');
    if (voiceBtn) {
      voiceBtn.classList.toggle('is-active', state.settings.voiceEnabled);
      voiceBtn.innerHTML = state.settings.voiceEnabled
        ? '🗣️ <span>Açık</span>'
        : '💬 <span>Kapalı</span>';
    }

    renderActiveColorPills();
  }

  function renderActiveColorPills() {
    const container = document.getElementById('active-colors-strip');
    if (!container) return;
    const active = app.getActiveColors();
    container.innerHTML = active.map(c => `
      <span class="color-mini-dot" style="background:${c.hex}; border-color:${c.border}" title="${c.name}"></span>
    `).join('');
  }

  function renderSequenceProgressBar() {
    const bar = document.getElementById('sequence-steps-bar');
    if (!bar) return;

    if (state.settings.activity !== 'quiz') {
      bar.classList.add('hidden');
      bar.innerHTML = '';
      return;
    }

    bar.classList.remove('hidden');
    const solvedEntries = Object.values(state.assignedColors);
    const solvedCount = solvedEntries.length;
    const recentColors = solvedEntries.slice(-6);

    bar.innerHTML = `
      <span class="px-2.5 py-1 font-extrabold text-sm text-slate-800">⭐ ${solvedCount}</span>
      ${recentColors.map(c => `
        <span class="color-mini-dot" style="background:${c.hex}; border-color:${c.border}"></span>
      `).join('')}
    `;
  }

  function handleDirectFingerClick(globalIndex) {
    if (state.isSpinning) return;
    const stepIdx = state.sequence.indexOf(globalIndex);
    if (stepIdx === -1) return;
    app.playClick();
    state.currentStepIndex = stepIdx;
    state.allCompleted = false;
    state.stepCompleted = Boolean(state.assignedColors[globalIndex]);
    updateStageVisuals();
    updateStatusBanner();
    updateActionButtons();
    renderSequenceProgressBar();
  }

  function updateStatusBanner(previewColor = null, remainingSec = null) {
    const timerFillEl = document.getElementById('timer-progress-fill');
    if (!timerFillEl) return;

    if (state.allCompleted) {
      timerFillEl.style.width = '100%';
      return;
    }

    const currentGlobalIdx = app.getCurrentFingerGlobalIndex();
    const assigned = state.assignedColors[currentGlobalIdx];

    if (state.isSpinning && remainingSec !== null) {
      const pct = Math.min(100, Math.max(0, ((state.settings.durationSec - remainingSec) / state.settings.durationSec) * 100));
      timerFillEl.style.width = `${pct}%`;
    } else if (assigned) {
      timerFillEl.style.width = '100%';
    } else {
      timerFillEl.style.width = '0%';
    }
  }

  function updateActionButtons() {
    const mainBtn = document.getElementById('btn-main-action');
    const nextAndSpinBtn = document.getElementById('btn-next-and-spin');
    const respinBtn = document.getElementById('btn-respin');
    const finishBtn = document.getElementById('btn-finish-activity');

    if (!mainBtn) return;

    if (state.isSpinning) {
      mainBtn.disabled = true;
      mainBtn.className = 'action-btn primary is-spinning';
      mainBtn.innerHTML = '⏳';
      if (nextAndSpinBtn) nextAndSpinBtn.classList.add('hidden');
      if (respinBtn) respinBtn.classList.add('hidden');
      if (finishBtn) finishBtn.classList.add('hidden');
      return;
    }

    mainBtn.disabled = false;

    if (state.allCompleted) {
      mainBtn.className = 'action-btn celebrate';
      mainBtn.innerHTML = '🔄 <span>YENİDEN BAŞLA</span>';
      if (nextAndSpinBtn) nextAndSpinBtn.classList.add('hidden');
      if (respinBtn) respinBtn.classList.add('hidden');
      if (finishBtn) finishBtn.classList.add('hidden');
      return;
    }

    if (finishBtn) finishBtn.classList.remove('hidden');

    if (state.settings.activity === 'quiz') {
      if (nextAndSpinBtn) nextAndSpinBtn.classList.add('hidden');
      if (respinBtn) respinBtn.classList.add('hidden');

      if (app.quizState && app.quizState.answered) {
        mainBtn.className = 'action-btn success pulse-attention';
        mainBtn.innerHTML = '➡️ <span>SIRADAKİ SORU</span>';
      } else {
        mainBtn.className = 'action-btn subtle';
        mainBtn.innerHTML = '🎲 <span>FARKLI SORU</span>';
      }
      return;
    }

    const currentGlobalIdx = app.getCurrentFingerGlobalIndex();
    const hasColorOnCurrent = Boolean(state.assignedColors[currentGlobalIdx]);
    const isLastStep = state.currentStepIndex >= state.sequence.length - 1;

    if (!hasColorOnCurrent) {
      mainBtn.className = 'action-btn primary pulse-attention';
      mainBtn.innerHTML = '🎲 <span>BAŞLAT</span>';
      if (nextAndSpinBtn) nextAndSpinBtn.classList.add('hidden');
      if (respinBtn) respinBtn.classList.add('hidden');
    } else {
      if (isLastStep) {
        const nextRoundLabel = state.settings.activity === 'tower' ? 'YENİ KULE' : 'YENİ EL';
        mainBtn.className = 'action-btn success pulse-attention';
        mainBtn.innerHTML = `🔄 <span>${nextRoundLabel}</span>`;
      } else {
        const nextStepLabel = state.settings.activity === 'tower' ? 'SIRADAKİ KAT' : 'SIRADAKİ PARMAK';
        mainBtn.className = 'action-btn success pulse-attention';
        mainBtn.innerHTML = `➡️ <span>${nextStepLabel}</span>`;
      }
      if (nextAndSpinBtn) {
        nextAndSpinBtn.classList.add('hidden');
      }
      if (respinBtn) {
        respinBtn.classList.remove('hidden');
      }
    }
  }

  function triggerSpinForCurrentFinger() {
    if (state.isSpinning || state.allCompleted) return;
    const currentGlobalIdx = app.getCurrentFingerGlobalIndex();
    if (currentGlobalIdx === null) return;

    delete state.assignedColors[currentGlobalIdx];
    state.stepCompleted = false;
    updateStageVisuals();
    updateActionButtons();

    app.startColorSelection({
      onPreviewUpdate(previewColor, remainingSec) {
        updateStageVisuals(previewColor);
        updateStatusBanner(previewColor, remainingSec);
      },
      onComplete(winnerColor) {
        state.assignedColors[currentGlobalIdx] = winnerColor;
        state.stepCompleted = true;
        app.playLockIn();

        const meta = app.getFingerMeta(currentGlobalIdx);
        app.speakText(`${meta.name}, ${winnerColor.name}`);

        updateStageVisuals(null);
        updateStatusBanner();
        updateActionButtons();
        renderSequenceProgressBar();
      }
    });
  }

  function advanceToNextFinger(autoSpin = false) {
    if (state.isSpinning) return;

    if (state.currentStepIndex < state.sequence.length - 1) {
      app.playClick();
      state.currentStepIndex += 1;
      state.stepCompleted = Boolean(state.assignedColors[app.getCurrentFingerGlobalIndex()]);
      updateStageVisuals();
      updateStatusBanner();
      updateActionButtons();
      renderSequenceProgressBar();

      if (autoSpin) {
        triggerSpinForCurrentFinger();
      } else {
        const meta = app.getFingerMeta(app.getCurrentFingerGlobalIndex());
        app.speakText(`Sıradaki: ${meta.name}`);
      }
    } else {
      // Kule veya el tamamlandığında oyunu bitirme; yeni kule/el turuna sıfırdan devam et!
      app.playClick();
      app.rebuildFingerSequence();
      refreshFullUI();
      if (autoSpin) {
        triggerSpinForCurrentFinger();
      }
    }
  }

  function restartGame() {
    app.cancelAnimation();
    app.clearAutoNextTimer?.();
    app.playClick();
    app.rebuildFingerSequence();
    refreshFullUI();
  }

  function setTowerHeight(newHeight) {
    if (state.isSpinning) return;
    const clamped = Math.min(10, Math.max(3, Number(newHeight) || 5));
    state.settings.towerHeight = clamped;
    app.saveState();
    if (state.settings.activity === 'tower') {
      app.rebuildFingerSequence();
    }
    refreshFullUI();
  }

  function setQuizLength(newLength) {
    const clamped = Math.min(6, Math.max(1, Number(newLength) || 1));
    state.settings.quizLength = clamped;
    app.saveState();
    if (state.settings.activity === 'quiz') {
      app.generateQuizQuestion();
    }
    refreshFullUI();
  }

  function bindOnce(el, eventName, handler) {
    if (!el) return;
    const flag = `__lego_bound_${eventName}`;
    if (el[flag]) return;
    el[flag] = true;
    el.addEventListener(eventName, handler);
  }

  function bindTopBarEvents() {
    document.querySelectorAll('[data-activity]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        if (state.isSpinning) return;
        app.clearAutoNextTimer?.();
        app.playClick();
        state.settings.activity = btn.dataset.activity;
        app.saveState();
        app.rebuildFingerSequence();
        refreshFullUI();
      });
    });

    document.querySelectorAll('[data-quiz-preset]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        app.playClick();
        setQuizLength(btn.dataset.quizPreset);
      });
    });

    const quizDecBtn = document.getElementById('btn-quiz-dec');
    bindOnce(quizDecBtn, 'click', () => {
      app.playClick();
      setQuizLength((Number(state.settings.quizLength) || 1) - 1);
    });

    const quizIncBtn = document.getElementById('btn-quiz-inc');
    bindOnce(quizIncBtn, 'click', () => {
      app.playClick();
      setQuizLength((Number(state.settings.quizLength) || 1) + 1);
    });

    document.querySelectorAll('[data-quiz-layout]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        app.playClick();
        state.settings.quizLayout = btn.dataset.quizLayout;
        app.saveState();
        refreshFullUI();
      });
    });

    const autoNextBtn = document.getElementById('btn-quiz-autonext');
    bindOnce(autoNextBtn, 'click', () => {
      app.playClick();
      state.settings.quizAutoNext = !state.settings.quizAutoNext;
      app.saveState();
      syncQuickControlsUI();
    });

    document.querySelectorAll('[data-quiz-autonext-mode]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        app.playClick();
        state.settings.quizAutoNext = (btn.dataset.quizAutonextMode === 'auto');
        app.saveState();
        syncQuickControlsUI();
      });
    });

    document.querySelectorAll('[data-tower-preset]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        app.playClick();
        setTowerHeight(btn.dataset.towerPreset);
      });
    });

    const towerHeightInput = document.getElementById('setting-tower-height');
    bindOnce(towerHeightInput, 'change', (e) => {
      app.playClick();
      setTowerHeight(e.target.value);
    });

    const towerDecBtn = document.getElementById('btn-tower-dec');
    bindOnce(towerDecBtn, 'click', () => {
      if (state.isSpinning) return;
      app.playClick();
      setTowerHeight((Number(state.settings.towerHeight) || 5) - 1);
    });

    const towerIncBtn = document.getElementById('btn-tower-inc');
    bindOnce(towerIncBtn, 'click', () => {
      if (state.isSpinning) return;
      app.playClick();
      setTowerHeight((Number(state.settings.towerHeight) || 5) + 1);
    });

    document.querySelectorAll('[data-hand-type]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        if (state.isSpinning) return;
        app.playClick();
        state.settings.handType = btn.dataset.handType;
        app.saveState();
        app.rebuildFingerSequence();
        refreshFullUI();
      });
    });

    document.querySelectorAll('[data-hand-view]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        if (state.isSpinning) return;
        app.playClick();
        state.settings.handView = btn.dataset.handView;
        app.saveState();
        refreshFullUI();
      });
    });

    document.querySelectorAll('[data-game-mode]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        if (state.isSpinning) return;
        app.playClick();
        state.settings.gameMode = btn.dataset.gameMode;
        app.saveState();
        refreshFullUI();
      });
    });

    document.querySelectorAll('[data-duration-preset]').forEach(btn => {
      bindOnce(btn, 'click', () => {
        app.playClick();
        state.settings.durationSec = Number(btn.dataset.durationPreset) || 3;
        app.saveState();
        syncQuickControlsUI();
      });
    });

    const orderSelect = document.getElementById('quick-order-select');
    bindOnce(orderSelect, 'change', (e) => {
      if (state.isSpinning) return;
      app.playClick();
      state.settings.fingerOrder = e.target.value;
      app.saveState();
      app.rebuildFingerSequence();
      refreshFullUI();
    });

    const soundBtn = document.getElementById('btn-toggle-sound');
    bindOnce(soundBtn, 'click', () => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
      if (state.settings.soundEnabled) app.playClick();
      app.saveState();
      syncQuickControlsUI();
    });

    const fsBtn = document.getElementById('btn-fullscreen');
    bindOnce(fsBtn, 'click', () => {
      app.playClick();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    });

    const resetBtn = document.getElementById('btn-reset');
    bindOnce(resetBtn, 'click', restartGame);
  }

  function bindStageAndActionEvents() {
    const mainBtn = document.getElementById('btn-main-action');
    const nextAndSpinBtn = document.getElementById('btn-next-and-spin');
    const respinBtn = document.getElementById('btn-respin');
    const finishBtn = document.getElementById('btn-finish-activity');
    const wheelCanvas = document.getElementById('wheel-canvas');

    const handlePrimaryAction = () => {
      if (state.isSpinning) return;
      if (state.allCompleted) {
        restartGame();
        return;
      }

      if (state.settings.activity === 'quiz') {
        app.playClick();
        if (app.quizState && app.quizState.answered) {
          handleQuizNextQuestion();
        } else {
          app.generateQuizQuestion();
          renderStageTarget();
          updateActionButtons();
        }
        return;
      }

      const currentGlobalIdx = app.getCurrentFingerGlobalIndex();
      const hasColor = Boolean(state.assignedColors[currentGlobalIdx]);
      if (!hasColor) {
        triggerSpinForCurrentFinger();
      } else {
        advanceToNextFinger(true);
      }
    };

    bindOnce(mainBtn, 'click', handlePrimaryAction);

    bindOnce(nextAndSpinBtn, 'click', () => {
      if (state.isSpinning) return;
      advanceToNextFinger(true);
    });

    bindOnce(respinBtn, 'click', () => {
      if (state.isSpinning) return;
      triggerSpinForCurrentFinger();
    });

    bindOnce(finishBtn, 'click', () => {
      finishActivityManually();
    });

    bindOnce(wheelCanvas, 'click', () => {
      if (state.isSpinning || state.allCompleted) return;
      triggerSpinForCurrentFinger();
    });

    if (!app._keydownBound) {
      app._keydownBound = true;
      window.addEventListener('keydown', (e) => {
        if (!document.getElementById('main-stage')) return;
        const modal = document.getElementById('settings-modal');
        if (modal && !modal.classList.contains('hidden')) return;
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          handlePrimaryAction();
        }
      });
    }
  }

  function bindSettingsModalEvents() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('btn-open-settings');
    const closeBtn = document.getElementById('btn-close-settings');
    const addColorForm = document.getElementById('add-color-form');
    const noRepeatCheckbox = document.getElementById('setting-no-repeat');
    const customDurationInput = document.getElementById('setting-custom-duration');
    const resetDefaultsBtn = document.getElementById('btn-reset-defaults');

    const openModal = () => {
      if (state.isSpinning) return;
      app.playClick();
      syncQuickControlsUI();
      renderSettingsModalContent();
      modal.classList.remove('hidden');
    };

    const closeModal = () => {
      app.playClick();
      modal.classList.add('hidden');
      refreshFullUI();
    };

    bindOnce(openBtn, 'click', openModal);
    bindOnce(closeBtn, 'click', closeModal);
    bindOnce(modal, 'click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Sekme (Tab) geçişleri
    document.querySelectorAll('.modal-tab-btn[data-settings-tab]').forEach(tabBtn => {
      bindOnce(tabBtn, 'click', () => {
        app.playClick();
        const targetTab = tabBtn.dataset.settingsTab;
        document.querySelectorAll('.modal-tab-btn[data-settings-tab]').forEach(b => {
          b.classList.toggle('active', b.dataset.settingsTab === targetTab);
        });
        document.querySelectorAll('.settings-tab-panel[data-tab-panel]').forEach(panel => {
          panel.classList.toggle('hidden', panel.dataset.tabPanel !== targetTab);
        });
      });
    });

    bindOnce(addColorForm, 'submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('new-color-name');
      const hexInput = document.getElementById('new-color-hex');
      if (!nameInput || !hexInput) return;

      const name = nameInput.value.trim();
      const hex = hexInput.value;
      if (!name) return;

      app.playClick();
      app.addCustomColor(name, hex);
      nameInput.value = '';
      renderSettingsModalContent();
      refreshFullUI();
    });

    bindOnce(noRepeatCheckbox, 'change', (e) => {
      state.settings.noRepeatAdjacent = e.target.checked;
      app.saveState();
    });

    bindOnce(customDurationInput, 'change', (e) => {
      const val = Math.min(15, Math.max(1, Number(e.target.value) || 3));
      state.settings.durationSec = val;
      e.target.value = val;
      app.saveState();
      syncQuickControlsUI();
    });

    bindOnce(resetDefaultsBtn, 'click', () => {
      app.playClick();
      app.resetToDefaults();
      renderSettingsModalContent();
      refreshFullUI();
    });
  }

  function renderSettingsModalContent() {
    const listEl = document.getElementById('settings-colors-list');
    const noRepeatCheckbox = document.getElementById('setting-no-repeat');
    const customDurationInput = document.getElementById('setting-custom-duration');

    if (noRepeatCheckbox) noRepeatCheckbox.checked = Boolean(state.settings.noRepeatAdjacent);
    if (customDurationInput) customDurationInput.value = state.settings.durationSec;

    if (!listEl) return;

    listEl.innerHTML = state.colors.map(c => `
      <div class="color-toggle-card ${c.active ? 'is-active' : ''}" data-color-id="${c.id}">
        <button type="button" class="color-toggle-btn" data-toggle-id="${c.id}">
          <span class="color-swatch" style="background:${c.hex}; border-color:${c.border}"></span>
          <span class="color-label">${c.name}</span>
          <span class="color-status">${c.active ? '✓ Aktif' : 'Kapalı'}</span>
        </button>
        ${c.isCustom ? `<button type="button" class="color-delete-btn" data-delete-id="${c.id}" title="Rengi Sil">🗑️</button>` : ''}
      </div>
    `).join('');

    listEl.querySelectorAll('[data-toggle-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.toggleId;
        const target = state.colors.find(c => c.id === id);
        if (!target) return;

        const activeCount = state.colors.filter(c => c.active).length;
        if (target.active && activeCount <= 2) {
          alert('Etkinlik için en az 2 renk aktif olmalıdır!');
          return;
        }

        app.playClick();
        target.active = !target.active;
        app.ensureMinimumActiveColors();
        app.saveState();
        renderSettingsModalContent();
        refreshFullUI();
      });
    });

    listEl.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        app.playClick();
        app.removeCustomColor(btn.dataset.deleteId);
        renderSettingsModalContent();
        refreshFullUI();
      });
    });
  }

  function launchConfetti() {
    const container = document.getElementById('confetti-layer');
    if (!container) return;
    container.innerHTML = '';

    const activeHexes = app.getActiveColors().map(c => c.hex);
    for (let i = 0; i < 45; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = activeHexes[i % activeHexes.length] || '#FFD600';
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      piece.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
      container.appendChild(piece);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 3500);
  }
})(window.LegoApp);
