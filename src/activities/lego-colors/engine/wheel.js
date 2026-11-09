/**
 * @file js/wheel.js
 * @description Renk çarkı (Canvas) çizimi ve zamanlayıcılı çark / parmak-üzeri renk döngüsü animasyonu.
 */

(function (app) {
  let currentRotationRad = 0;
  let animFrameId = null;

  function getWheelSlices() {
    const active = app.getActiveColors();
    if (active.length === 0) return [];
    if (active.length <= 3) return [...active, ...active, ...active];
    if (active.length <= 5) return [...active, ...active];
    return active;
  }

  function drawWheel(highlightColor = null) {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slices = getWheelSlices();
    if (slices.length === 0) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;
    const sliceAngle = (Math.PI * 2) / slices.length;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.restore();

    slices.forEach((color, i) => {
      const startAngle = currentRotationRad + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = color.hex;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      const midAngle = startAngle + sliceAngle / 2;
      const studRadius = radius * 0.66;
      const tx = center + Math.cos(midAngle) * studRadius;
      const ty = center + Math.sin(midAngle) * studRadius;

      // Dilim içi 3D Lego çıkıntısı (Stud) halkası (Yazısız)
      ctx.beginPath();
      ctx.arc(tx, ty, 13, 0, Math.PI * 2);
      ctx.fillStyle = color.hex;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tx - 3, ty - 3, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();
      ctx.restore();
    });

    slices.forEach((_, i) => {
      const angle = currentRotationRad + i * sliceAngle;
      const px = center + Math.cos(angle) * (radius - 4);
      const py = center + Math.sin(angle) * (radius - 4);
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#0F172A';
      ctx.stroke();
    });

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, 38, 0, Math.PI * 2);
    ctx.fillStyle = highlightColor ? highlightColor.hex : '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1E293B';
    ctx.stroke();

    // Merkezde iç Lego halkası
    ctx.beginPath();
    ctx.arc(center, center, 16, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  function getSliceAtTopPointer(slices) {
    const sliceAngle = (Math.PI * 2) / slices.length;
    const pointerAngle = (Math.PI * 1.5);
    const normalizedRot = ((pointerAngle - currentRotationRad) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const idx = Math.floor(normalizedRot / sliceAngle) % slices.length;
    return { slice: slices[idx], index: idx };
  }

  function startColorSelection({ onPreviewUpdate, onComplete }) {
    if (app.state.isSpinning) return;
    cancelAnimation();

    const activeColors = app.getActiveColors();
    if (activeColors.length === 0) return;

    app.state.isSpinning = true;
    const durationMs = Math.max(1, Number(app.state.settings.durationSec) || 3) * 1000;
    const slices = getWheelSlices();
    const sliceAngle = (Math.PI * 2) / slices.length;

    let candidateSlices = slices.map((s, idx) => ({ color: s, idx }));
    if (app.state.settings.noRepeatAdjacent && app.state.currentStepIndex > 0 && activeColors.length > 1) {
      const prevGlobalIdx = app.state.sequence[app.state.currentStepIndex - 1];
      const prevColor = app.state.assignedColors[prevGlobalIdx];
      if (prevColor) {
        const filtered = candidateSlices.filter(item => item.color.id !== prevColor.id);
        if (filtered.length > 0) candidateSlices = filtered;
      }
    }

    const chosen = candidateSlices[Math.floor(Math.random() * candidateSlices.length)];
    const targetSliceIndex = chosen.idx;

    const sliceCenterOffset = (targetSliceIndex + 0.3 + Math.random() * 0.4) * sliceAngle;
    const desiredEndMod = ((Math.PI * 1.5 - sliceCenterOffset) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const currentMod = ((currentRotationRad % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let deltaRad = desiredEndMod - currentMod;
    if (deltaRad <= 0) deltaRad += Math.PI * 2;

    const extraSpins = Math.max(3, Math.round(app.state.settings.durationSec * 1.8));
    const totalRotationDelta = extraSpins * Math.PI * 2 + deltaRad;
    const startRotation = currentRotationRad;

    const startTime = performance.now();
    let lastTickSliceIndex = -1;
    let lastFingerSlotSwitchMs = 0;
    let slotCursor = 0;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const remainingSec = Math.max(0, (durationMs - elapsed) / 1000);

      const eased = 1 - Math.pow(1 - progress, 3);
      currentRotationRad = startRotation + totalRotationDelta * eased;

      const { slice: wheelCurrentColor, index: currentSliceIdx } = getSliceAtTopPointer(slices);

      if (app.state.settings.gameMode === 'finger-only') {
        const intervalMs = 85 + progress * 240;
        if (now - lastFingerSlotSwitchMs >= intervalMs) {
          lastFingerSlotSwitchMs = now;
          slotCursor = (slotCursor + 1) % activeColors.length;
          const previewColor = progress > 0.92 ? chosen.color : activeColors[slotCursor];
          app.playTick(progress);
          onPreviewUpdate(previewColor, remainingSec);
        }
      } else {
        drawWheel(wheelCurrentColor);
        if (currentSliceIdx !== lastTickSliceIndex) {
          lastTickSliceIndex = currentSliceIdx;
          app.playTick(progress);
          const previewColor = app.state.settings.gameMode === 'wheel-only' ? null : wheelCurrentColor;
          onPreviewUpdate(previewColor, remainingSec);
        }
      }

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      } else {
        app.state.isSpinning = false;
        animFrameId = null;
        drawWheel(chosen.color);
        onComplete(chosen.color);
      }
    }

    animFrameId = requestAnimationFrame(step);
  }

  function cancelAnimation() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    app.state.isSpinning = false;
  }

  Object.assign(app, {
    drawWheel,
    startColorSelection,
    cancelAnimation
  });
})(window.LegoApp);
