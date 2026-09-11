import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { Food, Category } from '../types';
import { useRoulette } from '../hooks/useRoulette';
import { BUDGET_OPTIONS } from '../data/foods';

interface FlavorBoxProps {
  foods: Food[];
  budget: number;
  onBudgetChange: (b: number) => void;
  selectedCategory: Category | 'all';
  onCategoryChange: (c: Category | 'all') => void;
  isMuted?: boolean;
  onResult: (food: Food) => void;
  onOpen: () => void;
}

const CATEGORY_TABS: { value: Category | 'all'; label: string; icon: string }[] = [
  { value: 'main', label: 'Món chính', icon: '🍴' },
  { value: 'snack', label: 'Ăn vặt / Món nhẹ', icon: '🍓' },
  { value: 'drink', label: 'Đồ uống', icon: '☕' },
  { value: 'dessert', label: 'Đồ ngọt', icon: '🍰' },
  { value: 'all', label: 'Tất cả món', icon: '🍱' },
];

const RARITY_BAR_COLORS: Record<string, string> = {
  'QUỐC DÂN': 'bg-[#3b82f6]',
  'THƯỜNG': 'bg-[#64748b]',
  'HIẾM': 'bg-[#8b5cf6]',
  'CỰC PHẨM': 'bg-[#ec4899]',
  'ĐẶC BIỆT': 'bg-[#f59e0b]',
  'TỐI MẬT': 'bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300',
};

const RARITY_GLOW_BACKDROP: Record<string, string> = {
  'QUỐC DÂN': 'from-blue-600/30 via-blue-900/10 to-transparent',
  'THƯỜNG': 'from-slate-600/30 via-slate-900/10 to-transparent',
  'HIẾM': 'from-purple-600/40 via-purple-900/10 to-transparent',
  'CỰC PHẨM': 'from-pink-600/40 via-pink-900/10 to-transparent',
  'ĐẶC BIỆT': 'from-amber-600/40 via-amber-900/10 to-transparent',
  'TỐI MẬT': 'from-red-600/50 via-yellow-900/20 to-transparent',
};

const FlavorBox: React.FC<FlavorBoxProps> = ({
  foods,
  budget,
  onBudgetChange,
  selectedCategory,
  onCategoryChange,
  isMuted = false,
  onResult,
  onOpen,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIdx, setCenterIdx] = useState(0);
  const cardWidth = 165; // px

  // Filter foods by Category and Budget
  const displayFoods = useMemo(() => {
    const filtered = foods.filter(f =>
      (selectedCategory === 'all' || f.category === selectedCategory) &&
      (budget === 999999 || f.price <= budget)
    );
    return filtered.length > 0 ? filtered : foods;
  }, [foods, selectedCategory, budget]);

  const handleComplete = (food: Food) => {
    onResult(food);
    onOpen();
  };

  const { isSpinning, currentIndex, spin } = useRoulette({
    items: displayFoods,
    isMuted,
    onComplete: handleComplete,
  });

  // Scroll carousel to center active card
  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const targetIdx = isSpinning ? currentIndex : centerIdx;
    const offset = targetIdx * cardWidth - (el.clientWidth / 2) + cardWidth / 2;
    el.scrollTo({ left: Math.max(0, offset), behavior: isSpinning ? 'instant' : 'smooth' });
  }, [currentIndex, isSpinning]);

  const handleScroll = () => {
    if (!scrollRef.current || isSpinning) return;
    const el = scrollRef.current;
    const idx = Math.round((el.scrollLeft + el.clientWidth / 2 - cardWidth / 2) / cardWidth);
    setCenterIdx(Math.max(0, Math.min(idx, displayFoods.length - 1)));
  };

  const scrollBy = (dir: number) => {
    if (!scrollRef.current || isSpinning) return;
    const newIdx = Math.max(0, Math.min(centerIdx + dir, displayFoods.length - 1));
    setCenterIdx(newIdx);
  };

  const activeIdx = isSpinning ? currentIndex : Math.min(centerIdx, displayFoods.length - 1);

  return (
    <section className="relative bg-[#0e1622] py-4">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Main Carousel Chassis according to Reference Image 1 */}
        <div className="relative bg-[#111a26] border border-[#1d2a3a] rounded-lg overflow-hidden p-2 sm:p-3 shadow-2xl mb-4">
          {/* Arrow Left */}
          <button
            onClick={() => scrollBy(-1)}
            disabled={isSpinning}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded bg-[#162232]/80 border border-[#25374d] flex items-center justify-center text-slate-300 hover:text-white transition-all disabled:opacity-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Arrow Right */}
          <button
            onClick={() => scrollBy(1)}
            disabled={isSpinning}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded bg-[#162232]/80 border border-[#25374d] flex items-center justify-center text-slate-300 hover:text-white transition-all disabled:opacity-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Center Indicator: Vertical Yellow Line (Reference Image 1) */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#e5b358] z-30 pointer-events-none shadow-[0_0_8px_#e5b358]" />

          {/* Fade edge vignettes */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none bg-gradient-to-r from-[#111a26] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none bg-gradient-to-l from-[#111a26] to-transparent" />

          {/* Carousel items scroll */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-2.5 overflow-x-auto no-scrollbar py-2 px-6"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {displayFoods.map((food: Food, idx: number) => {
              const isActive = idx === activeIdx;
              const barColor = RARITY_BAR_COLORS[food.rarity] || 'bg-blue-500';
              const glowBackdrop = RARITY_GLOW_BACKDROP[food.rarity] || 'from-blue-600/30 to-transparent';

              return (
                <div
                  key={food.id}
                  className="flex-shrink-0 cursor-pointer select-none transition-all duration-300"
                  style={{ width: `${cardWidth - 10}px`, scrollSnapAlign: 'center' }}
                  onClick={() => !isSpinning && setCenterIdx(idx)}
                >
                  <div className={`relative h-44 rounded overflow-hidden bg-[#16212e] border transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? 'border-slate-400/80 shadow-lg'
                      : 'border-[#1f2d3d] opacity-75 hover:opacity-100'
                  }`}>
                    {/* Background Radial Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${glowBackdrop} pointer-events-none`} />

                    {/* Food Image (Top / Center) */}
                    <div className="relative h-28 flex items-center justify-center p-2 z-10">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-24 h-24 object-cover rounded-full shadow-md transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Food Name at Bottom-Left (Reference Image 1) */}
                    <div className="px-3 pb-2.5 z-10">
                      <div className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-1">
                        {food.name}
                      </div>
                    </div>

                    {/* Rarity Bottom Stripe */}
                    <div className={`h-[3px] w-full ${barColor}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Tabs according to Reference Image 1 */}
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Category Tabs Row with Yellow Bottom Active Bar */}
          <div className="flex items-center justify-center gap-1 sm:gap-4 border-b border-[#1f2d3d] pb-1 w-full max-w-xl overflow-x-auto no-scrollbar">
            {CATEGORY_TABS.map(tab => {
              const isActive = selectedCategory === tab.value || (selectedCategory === 'all' && tab.value === 'all');
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    if (isSpinning) return;
                    onCategoryChange(tab.value);
                    setCenterIdx(0);
                  }}
                  disabled={isSpinning}
                  className={`relative px-3 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#e5b358]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e5b358] shadow-[0_0_6px_#e5b358]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Row: Budget Dropdown + Olive Green "MỞ HÒM" Button (Reference Image 1) */}
          <div className="flex items-center justify-center gap-3 w-full max-w-md mt-1">
            {/* Budget Selector */}
            <div className="relative">
              <select
                value={budget}
                onChange={e => {
                  if (isSpinning) return;
                  onBudgetChange(Number(e.target.value));
                  setCenterIdx(0);
                }}
                disabled={isSpinning}
                className="bg-[#141f2e] border border-[#243447] text-xs sm:text-sm text-slate-200 font-medium px-4 py-3 rounded-lg cursor-pointer hover:border-slate-500 focus:outline-none appearance-none pr-8 min-w-[90px]"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394a3b8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '18px'
                }}
              >
                {BUDGET_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* "MỞ HÒM" Button (Olive Green as in Reference Image 1) */}
            <button
              onClick={spin}
              disabled={isSpinning || displayFoods.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-8 rounded-lg bg-[#637d36] hover:bg-[#718f3d] active:scale-95 text-white font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-[0_2px_8px_rgba(99,125,54,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>{isSpinning ? 'ĐANG QUAY...' : 'MỞ HÒM'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlavorBox;
