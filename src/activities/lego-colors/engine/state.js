/**
 * @file js/state.js
 * @description Uygulama durumu (state), parmak sırası hesaplama ve localStorage yönetimi.
 */

(function (app) {
  const STORAGE_KEY = 'petek_lego_hand_state_v1';

  const state = {
    settings: { ...app.DEFAULT_SETTINGS },
    colors: app.DEFAULT_COLORS.map(c => ({ ...c })),
    sequence: [],          // Parmak global indekslerinin sırası (örn: [0..4] veya 10 parmak için [0..9])
    currentStepIndex: 0,   // sequence dizisindeki mevcut adım
    assignedColors: {},    // { [globalFingerIndex]: colorObj }
    isSpinning: false,     // Şu an çark/parmak dönüyor mu?
    stepCompleted: false,  // Mevcut parmağın rengi sabitlendi mi?
    allCompleted: false    // Tüm parmaklar tamamlandı mı?
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings) {
          state.settings = { ...app.DEFAULT_SETTINGS, ...parsed.settings };
        }
        if (Array.isArray(parsed.colors) && parsed.colors.length >= 2) {
          state.colors = parsed.colors;
        }
      }
    } catch (err) {
      console.warn('Ayarlar yüklenemedi, varsayılanlar kullanılıyor:', err);
    }
    ensureMinimumActiveColors();
    rebuildFingerSequence();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        settings: state.settings,
        colors: state.colors
      }));
    } catch (err) {
      console.warn('Ayarlar kaydedilemedi:', err);
    }
  }

  function ensureMinimumActiveColors() {
    const active = state.colors.filter(c => c.active);
    if (active.length < 2) {
      state.colors.slice(0, 3).forEach(c => { c.active = true; });
    }
  }

  function getActiveColors() {
    return state.colors.filter(c => c.active);
  }

  function rebuildFingerSequence() {
    if (state.settings.activity === 'tower') {
      const count = Math.min(10, Math.max(3, Number(state.settings.towerHeight) || 5));
      state.settings.towerHeight = count;
      state.sequence = Array.from({ length: count }, (_, i) => i);
    } else if (state.settings.activity === 'quiz') {
      state.sequence = [0, 1, 2, 3, 4];
      if (app.generateQuizQuestion) {
        app.generateQuizQuestion();
      }
    } else {
      const totalFingers = state.settings.handType === 'both' ? 10 : 5;
      const indices = Array.from({ length: totalFingers }, (_, i) => i);

      if (state.settings.fingerOrder === 'thumb-first') {
        state.sequence = indices;
      } else if (state.settings.fingerOrder === 'pinky-first') {
        if (totalFingers === 5) {
          state.sequence = indices.reverse();
        } else {
          state.sequence = [4, 3, 2, 1, 0, 9, 8, 7, 6, 5];
        }
      } else if (state.settings.fingerOrder === 'random') {
        state.sequence = shuffleArray([...indices]);
      }
    }

    state.currentStepIndex = 0;
    state.assignedColors = {};
    state.isSpinning = false;
    state.stepCompleted = false;
    state.allCompleted = false;
  }

  function getCurrentFingerGlobalIndex() {
    if (state.allCompleted || state.sequence.length === 0) return null;
    return state.sequence[state.currentStepIndex] ?? null;
  }

  function getFingerMeta(globalIndex) {
    if (globalIndex === null || globalIndex === undefined) return null;

    if (state.settings.activity === 'tower') {
      const level = globalIndex + 1;
      return {
        index: globalIndex,
        globalIndex,
        localIndex: globalIndex,
        name: `${level}. Kat`,
        fullTitle: `${level}. Kat Lego`
      };
    }

    const isSecondHand = globalIndex >= 5;
    const localIndex = globalIndex % 5;
    const base = app.FINGER_DEFINITIONS[localIndex];

    let handLabel = '';
    if (state.settings.handType === 'both') {
      handLabel = isSecondHand ? 'Sağ El - ' : 'Sol El - ';
    }

    return {
      ...base,
      globalIndex,
      localIndex,
      handSide: state.settings.handType === 'both'
        ? (isSecondHand ? 'right' : 'left')
        : state.settings.handType,
      fullTitle: `${handLabel}${base.name}`
    };
  }

  function addCustomColor(name, hex) {
    const cleanName = name.trim() || 'Özel Renk';
    const id = 'custom_' + Date.now();
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textHex = luminance > 0.65 ? '#1E293B' : '#FFFFFF';

    const darken = (v) => Math.max(0, Math.floor(v * 0.75)).toString(16).padStart(2, '0');
    const border = `#${darken(r)}${darken(g)}${darken(b)}`;

    state.colors.push({
      id,
      name: cleanName,
      hex,
      border,
      textHex,
      active: true,
      isCustom: true
    });
    saveState();
  }

  function removeCustomColor(id) {
    state.colors = state.colors.filter(c => c.id !== id);
    ensureMinimumActiveColors();
    saveState();
  }

  function resetToDefaults() {
    state.settings = { ...app.DEFAULT_SETTINGS };
    state.colors = app.DEFAULT_COLORS.map(c => ({ ...c }));
    saveState();
    rebuildFingerSequence();
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  Object.assign(app, {
    state,
    loadState,
    saveState,
    ensureMinimumActiveColors,
    getActiveColors,
    rebuildFingerSequence,
    getCurrentFingerGlobalIndex,
    getFingerMeta,
    addCustomColor,
    removeCustomColor,
    resetToDefaults
  });
})(window.LegoApp);
