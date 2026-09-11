import { useRef, useState, useCallback, useEffect } from 'react';
import type { Food } from '../types';
import { soundEffects } from '../utils/audio';

// Card dimensions exported so FlavorBox can use them
export const CARD_W = 150;
export const CARD_GAP = 5;
export const CARD_STEP = CARD_W + CARD_GAP;

const STRIP_LEN = 64;       // total items in strip
const WINNER_IDX = 50;      // winner lands here (near end of strip)
const PREVIEW_ANCHOR = 6;   // which item appears at center during preview

interface UseRouletteOptions {
  items: Food[];
  isMuted?: boolean;
  onComplete: (food: Food) => void;
}

function buildStrip(items: Food[], winnerIdx: number): { strip: Food[]; winner: Food } {
  const winner = items[Math.floor(Math.random() * items.length)];
  const strip: Food[] = Array.from({ length: STRIP_LEN }, () =>
    items[Math.floor(Math.random() * items.length)]
  );
  strip[winnerIdx] = winner;
  return { strip, winner };
}

export function useRoulette({ items, isMuted = false, onComplete }: UseRouletteOptions) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [stripItems, setStripItems] = useState<Food[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [animDuration, setAnimDuration] = useState(0);
  const [revealIdx, setRevealIdx] = useState<number | null>(null);
  const isSpinningRef = useRef(false);
  const containerWidthRef = useRef(800);

  // Init preview strip on mount / when items change
  useEffect(() => {
    if (items.length === 0 || isSpinningRef.current) return;
    const { strip } = buildStrip(items, PREVIEW_ANCHOR);
    setStripItems(strip);
    // Position so PREVIEW_ANCHOR item is at center of 800px estimate
    // will be refined on actual spin
    setTranslateX(400 - PREVIEW_ANCHOR * CARD_STEP - CARD_W / 2);
    setAnimDuration(0);
  }, [items]);

  const spin = useCallback((containerWidth: number) => {
    if (isSpinningRef.current || items.length === 0) return;

    containerWidthRef.current = containerWidth;
    const cw = containerWidth;

    soundEffects.playCSGOCaseOpen(isMuted);

    const { strip, winner } = buildStrip(items, WINNER_IDX);
    setStripItems(strip);
    setRevealIdx(null);

    // Start position: PREVIEW_ANCHOR at center
    const startX = cw / 2 - PREVIEW_ANCHOR * CARD_STEP - CARD_W / 2;
    // End position: WINNER_IDX at center (with small random offset for realism)
    const randomOffset = (Math.random() - 0.5) * (CARD_W * 0.4);
    const targetX = cw / 2 - WINNER_IDX * CARD_STEP - CARD_W / 2 + randomOffset;

    const totalDur = 6800 + Math.random() * 1800; // 6.8s – 8.6s

    // Step 1: reset position without animation
    setAnimDuration(0);
    setTranslateX(startX);
    isSpinningRef.current = true;
    setIsSpinning(true);

    // Step 2: two rAF frames to flush the reset, then start animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimDuration(totalDur);
        setTranslateX(targetX);

        // --- Tick tracking (approximating CSS ease-out cubic) ---
        const startTime = performance.now();
        let lastTickIdx = -1;

        const trackTicks = (now: number) => {
          if (!isSpinningRef.current) return;
          const elapsed = now - startTime;
          const t = Math.min(elapsed / totalDur, 1);

          // Approximate CSS cubic-bezier(0.09, 0.80, 0.15, 1.00) with ease-out cubic
          const eased = 1 - Math.pow(1 - t, 3);
          const curX = startX + (targetX - startX) * eased;

          // Which item index is currently at center?
          const centerIdx = Math.round((cw / 2 - curX - CARD_W / 2) / CARD_STEP);

          if (centerIdx !== lastTickIdx && centerIdx >= 0 && centerIdx < STRIP_LEN) {
            lastTickIdx = centerIdx;
            soundEffects.playTick(isMuted);
          }

          if (t < 0.999) {
            requestAnimationFrame(trackTicks);
          }
        };
        requestAnimationFrame(trackTicks);

        // Step 3: after animation ends, reveal winner
        const endTimer = setTimeout(() => {
          isSpinningRef.current = false;
          setIsSpinning(false);
          setRevealIdx(WINNER_IDX);
          soundEffects.playWin(winner.rarity, isMuted);
          setTimeout(() => onComplete(winner), 800);
        }, totalDur + 80);

        // Cleanup guard
        return () => clearTimeout(endTimer);
      });
    });
  }, [items, isMuted, onComplete]);

  return {
    isSpinning,
    stripItems,
    translateX,
    animDuration,
    revealIdx,
    spin,
  };
}
