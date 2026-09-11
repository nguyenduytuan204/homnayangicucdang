import { useRef, useState, useCallback } from 'react';
import type { Food } from '../types';
import { soundEffects } from '../utils/audio';

interface UseRouletteOptions {
  items: Food[];
  isMuted?: boolean;
  onComplete: (food: Food) => void;
}

export function useRoulette({ items, isMuted = false, onComplete }: UseRouletteOptions) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spin = useCallback(() => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setSelectedFood(null);

    // Phát âm thanh mở hòm CS:GO chuẩn
    soundEffects.playCSGOCaseOpen(isMuted);

    const totalDuration = 2800 + Math.random() * 1200;
    const finalIndex = Math.floor(Math.random() * items.length);

    let speed = 60;
    let idx = 0;
    let elapsed = 0;

    const tick = () => {
      idx = (idx + 1) % items.length;
      setCurrentIndex(idx);
      elapsed += speed;

      // Play CS:GO tick sound on every item step
      soundEffects.playTick(isMuted);

      // Gradually slow down
      if (elapsed > totalDuration * 0.5) {
        speed = Math.min(speed * 1.12, 450);
      }

      if (elapsed >= totalDuration) {
        if (intervalRef.current) clearTimeout(intervalRef.current);
        setCurrentIndex(finalIndex);
        setIsSpinning(false);
        setSelectedFood(items[finalIndex]);

        // Play CS:GO reveal fanfare chime based on Rarity!
        soundEffects.playWin(items[finalIndex].rarity, isMuted);

        timeoutRef.current = setTimeout(() => {
          onComplete(items[finalIndex]);
        }, 400);
      } else {
        intervalRef.current = setTimeout(tick, speed);
      }
    };

    intervalRef.current = setTimeout(tick, speed);
  }, [isSpinning, items, isMuted, onComplete]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSpinning(false);
  }, []);

  return { isSpinning, currentIndex, selectedFood, spin, stop };
}
