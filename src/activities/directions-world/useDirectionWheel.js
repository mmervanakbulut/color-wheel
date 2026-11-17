import { useState, useRef, useEffect, useCallback } from 'react';
import { playTick, playLockIn } from '../../utils/sound';
import { WHEEL_SLICES } from './config';

export function useDirectionWheel() {
  const [wheelAngle, setWheelAngle] = useState(0);
  const [wheelPreviewIdx, setWheelPreviewIdx] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpunOnce, setHasSpunOnce] = useState(false);
  const wheelAnimRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wheelAnimRef.current) cancelAnimationFrame(wheelAnimRef.current);
    };
  }, []);

  const triggerWheelSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasSpunOnce(true);

    const winnerIdx = Math.floor(Math.random() * WHEEL_SLICES.length);
    const sliceDeg = 360 / WHEEL_SLICES.length;
    const centerDeg = winnerIdx * sliceDeg + sliceDeg / 2;
    const desiredMod = (270 - centerDeg + 360) % 360;
    const currentMod = ((wheelAngle % 360) + 360) % 360;
    const extraDeg = (desiredMod - currentMod + 360) % 360;
    const totalDelta = 360 * 5 + extraDeg;

    const startAngle = wheelAngle;
    const duration = 2500;
    const startTime = performance.now();
    let lastTickSlice = -1;

    const animate = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + totalDelta * eased;
      setWheelAngle(currentAngle);

      const norm = ((270 - (currentAngle % 360)) % 360 + 360) % 360;
      const activeIdx = Math.floor(norm / sliceDeg) % WHEEL_SLICES.length;
      setWheelPreviewIdx(activeIdx);

      if (activeIdx !== lastTickSlice) {
        lastTickSlice = activeIdx;
        playTick(progress);
      }

      if (progress < 1) {
        wheelAnimRef.current = requestAnimationFrame(animate);
      } else {
        setWheelPreviewIdx(winnerIdx);
        setIsSpinning(false);
        playLockIn();
      }
    };

    wheelAnimRef.current = requestAnimationFrame(animate);
  }, [isSpinning, wheelAngle]);

  const resetWheel = useCallback(() => {
    setHasSpunOnce(false);
  }, []);

  return {
    wheelAngle,
    wheelPreviewIdx,
    isSpinning,
    hasSpunOnce,
    triggerWheelSpin,
    resetWheel,
  };
}
