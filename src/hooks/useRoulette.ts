import { useRef, useState, useCallback, useEffect } from 'react';
import type { Food } from '../types';
import { soundEffects } from '../utils/audio';

// Card dimensions exported so FlavorBox can use them
export const CARD_W = 150;
export const CARD_GAP = 5;
export const CARD_STEP = CARD_W + CARD_GAP;

const STRIP_LEN = 64;       // total items in strip
const WINNER_IDX = 50;      // winner lands here
const PREVIEW_ANCHOR = 6;   // preview center item

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

// Valve CS:GO Case Opening Easing: Fast acceleration -> long dramatic smooth deceleration
function csgoEasing(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function useRoulette({ items, isMuted = false, onComplete }: UseRouletteOptions) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [stripItems, setStripItems] = useState<Food[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [revealIdx, setRevealIdx] = useState<number | null>(null);

  const isSpinningRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Init preview strip on mount or when items change
  useEffect(() => {
    if (items.length === 0 || isSpinningRef.current) return;
    const { strip } = buildStrip(items, PREVIEW_ANCHOR);
    setStripItems(strip);
    setTranslateX(400 - PREVIEW_ANCHOR * CARD_STEP - CARD_W / 2);
    setRevealIdx(null);
  }, [items]);

  const spin = useCallback((containerWidth: number) => {
    if (isSpinningRef.current || items.length === 0) return;

    // 1. Dừng bất kỳ animation hay timer cũ nào
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (endTimerRef.current) clearTimeout(endTimerRef.current);

    // 2. Phát tiếng bấm mở hòm tức thì (không delay)
    soundEffects.playCrateOpen(isMuted);

    // 3. Chuẩn bị dải 64 món & người thắng
    const { strip, winner } = buildStrip(items, WINNER_IDX);
    setStripItems(strip);
    setRevealIdx(null);

    const cw = containerWidth;
    const startX = cw / 2 - PREVIEW_ANCHOR * CARD_STEP - CARD_W / 2;
    // Độ lệch ngẫu nhiên nhẹ trong phạm vi card người thắng (chân thực như game CS:GO)
    const randomOffset = (Math.random() - 0.5) * (CARD_W * 0.45);
    const targetX = cw / 2 - WINNER_IDX * CARD_STEP - CARD_W / 2 + randomOffset;

    // Thời gian quay chuẩn CS:GO: ~6.2 giây
    const totalDuration = 6200;

    isSpinningRef.current = true;
    setIsSpinning(true);
    setTranslateX(startX);

    const startTime = performance.now();
    let lastCrossedIdx = -1;

    // 4. RequestAnimationFrame physics engine: Đồng bộ tuyệt đối 1:1 giữa vị trí vạch kim và tiếng tick
    const updateLoop = (now: number) => {
      if (!isSpinningRef.current) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const eased = csgoEasing(progress);
      const currentX = startX + (targetX - startX) * eased;

      setTranslateX(currentX);

      // Tính chính xác vị trí tâm kim đối chiếu với các thẻ
      // Khi kim đi qua ranh giới giữa 2 thẻ liên tiếp, lập tức phát 1 tiếng tick
      const needleCenterOffset = cw / 2 - currentX;
      const currentItemIdx = Math.floor(needleCenterOffset / CARD_STEP);

      if (currentItemIdx !== lastCrossedIdx && currentItemIdx >= 0 && currentItemIdx < STRIP_LEN) {
        lastCrossedIdx = currentItemIdx;
        soundEffects.playTick(isMuted);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      } else {
        // Hoàn tất quay! Dừng chính xác tại thẻ trúng giải
        isSpinningRef.current = false;
        setIsSpinning(false);
        setRevealIdx(WINNER_IDX);

        // Phát nhạc vinh danh phẩm chất đồ mở được
        soundEffects.playWin(winner.rarity, isMuted);

        // Hiển thị popup kết quả sau khi thẻ lóe sáng hiệu ứng
        endTimerRef.current = setTimeout(() => {
          onComplete(winner);
        }, 700);
      }
    };

    // Bắt đầu quay mượt mà ngay frame kế tiếp
    animFrameRef.current = requestAnimationFrame(updateLoop);
  }, [items, isMuted, onComplete]);

  // Dọn dẹp animation khi unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, []);

  return {
    isSpinning,
    stripItems,
    translateX,
    revealIdx,
    spin,
  };
}
