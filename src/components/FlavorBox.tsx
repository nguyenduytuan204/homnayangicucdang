import React, { useRef, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import type { Food, Category } from '../types';
import { useRoulette, CARD_W, CARD_GAP } from '../hooks/useRoulette';
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
  { value: 'main',    label: 'Món chính',       icon: '🍴' },
  { value: 'snack',   label: 'Ăn vặt',           icon: '🍓' },
  { value: 'drink',   label: 'Đồ uống',           icon: '☕' },
  { value: 'dessert', label: 'Đồ ngọt',           icon: '🍰' },
  { value: 'all',     label: 'Tất cả',            icon: '🍱' },
];

// CS:GO rarity colour palette
const RARITY_COLOR: Record<string, string> = {
  'THƯỜNG':    '#b0c3d9',
  'QUỐC DÂN': '#4b69ff',
  'HIẾM':     '#8847ff',
  'CỰC PHẨM': '#d32ce6',
  'ĐẶC BIỆT': '#eb4b4b',
  'TỐI MẬT':  '#e4ae39',
};

const RARITY_GLOW: Record<string, string> = {
  'THƯỜNG':    'rgba(176,195,217,0.25)',
  'QUỐC DÂN': 'rgba(75,105,255,0.30)',
  'HIẾM':     'rgba(136,71,255,0.35)',
  'CỰC PHẨM': 'rgba(211,44,230,0.35)',
  'ĐẶC BIỆT': 'rgba(235,75,75,0.40)',
  'TỐI MẬT':  'rgba(228,174,57,0.45)',
};

// Individual strip card
const StripCard: React.FC<{
  food: Food;
  isWinner: boolean;
}> = ({ food, isWinner }) => {
  const color = RARITY_COLOR[food.rarity] ?? '#4b69ff';
  const glow  = RARITY_GLOW[food.rarity]  ?? 'rgba(75,105,255,0.3)';

  return (
    <div
      className="flex-shrink-0 flex flex-col overflow-hidden select-none"
      style={{
        width:  `${CARD_W}px`,
        height: '178px',
        borderRadius: '4px',
        background: '#0d1826',
        border: `2px solid ${isWinner ? color : '#1e2d40'}`,
        boxShadow: isWinner
          ? `0 0 18px ${glow}, 0 0 6px ${glow}, inset 0 0 25px ${glow}`
          : 'none',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        position: 'relative',
      }}
    >
      {/* Rarity bg tint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center top, ${glow} 0%, transparent 65%)`,
          pointerEvents: 'none',
          opacity: isWinner ? 1 : 0.4,
          transition: 'opacity 0.4s',
        }}
      />

      {/* Food image */}
      <div className="flex items-center justify-center flex-1 z-10 pt-3">
        <img
          src={food.image}
          alt={food.name}
          draggable={false}
          className="rounded-full object-cover shadow-md"
          style={{
            width:  isWinner ? '88px' : '76px',
            height: isWinner ? '88px' : '76px',
            transition: 'width 0.4s, height 0.4s',
            boxShadow: isWinner ? `0 0 12px ${glow}` : 'none',
          }}
        />
      </div>

      {/* Name */}
      <div className="z-10 px-2 pb-1.5 text-center">
        <p
          className="text-white font-bold leading-tight"
          style={{
            fontSize: isWinner ? '12px' : '11px',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {food.name}
        </p>
      </div>

      {/* Bottom rarity stripe */}
      <div style={{ height: '4px', background: color, flexShrink: 0 }} />
    </div>
  );
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  const { isSpinning, stripItems, translateX, revealIdx, spin } =
    useRoulette({ items: displayFoods, isMuted, onComplete: handleComplete });

  const handleSpin = () => {
    const cw = containerRef.current?.offsetWidth ?? 800;
    spin(cw);
  };

  return (
    <section className="relative bg-[#0e1622] py-4">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">

        {/* ── CS:GO Case Strip ─────────────────────────────────── */}
        <div
          className="relative overflow-hidden mb-4 rounded-sm"
          style={{
            height: '200px',
            background: 'linear-gradient(180deg, #0a1320 0%, #0d1826 50%, #0a1320 100%)',
            border: '1px solid #1a2b3f',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Top / bottom golden borders */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, #c8a951, transparent)',
            zIndex: 25,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, #c8a951, transparent)',
            zIndex: 25,
          }} />

          {/* Left / right edge fade */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px',
            background: 'linear-gradient(90deg, #0a1320 0%, transparent 100%)',
            zIndex: 20, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px',
            background: 'linear-gradient(270deg, #0a1320 0%, transparent 100%)',
            zIndex: 20, pointerEvents: 'none',
          }} />

          {/* Center needle */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: '50%', transform: 'translateX(-50%)',
            width: '3px',
            background: 'linear-gradient(180deg, transparent, #e5b358 15%, #e5b358 85%, transparent)',
            boxShadow: '0 0 10px #e5b358, 0 0 24px rgba(229,179,88,0.6)',
            zIndex: 30, pointerEvents: 'none',
          }} />
          {/* Triangle pointer top */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
            borderTop: '12px solid #e5b358',
            zIndex: 31, filter: 'drop-shadow(0 0 4px #e5b358)',
          }} />
          {/* Triangle pointer bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
            borderBottom: '12px solid #e5b358',
            zIndex: 31, filter: 'drop-shadow(0 0 4px #e5b358)',
          }} />

          {/* Scrolling strip */}
          <div
            ref={containerRef}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {stripItems.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: `${CARD_GAP}px`,
                  transform: `translateX(${translateX}px)`,
                  willChange: 'transform',
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  marginTop: `-89px`, /* half of card height 178/2 */
                }}
              >
                {stripItems.map((food, i) => (
                  <StripCard
                    key={i}
                    food={food}
                    isWinner={revealIdx === i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* ─────────────────────────────────────────────────────── */}

        {/* Category tabs + controls */}
        <div className="flex flex-col items-center gap-3">

          {/* Tabs */}
          <div className="flex items-center justify-center gap-0.5 sm:gap-3 border-b border-[#1a2b3f] pb-1 w-full max-w-2xl overflow-x-auto no-scrollbar">
            {CATEGORY_TABS.map(tab => {
              const active = selectedCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => { if (!isSpinning) onCategoryChange(tab.value); }}
                  disabled={isSpinning}
                  className={`relative px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active ? 'text-[#e5b358]' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e5b358] shadow-[0_0_6px_#e5b358]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Budget + spin */}
          <div className="flex items-center justify-center gap-3 w-full max-w-md">
            {/* Budget */}
            <div className="relative">
              <select
                value={budget}
                onChange={e => { if (!isSpinning) onBudgetChange(Number(e.target.value)); }}
                disabled={isSpinning}
                className="bg-[#0d1826] border border-[#1e2d40] text-xs sm:text-sm text-slate-200 font-medium px-3 py-2.5 rounded cursor-pointer hover:border-slate-500 focus:outline-none appearance-none pr-7 min-w-[90px]"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394a3b8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 6px center',
                  backgroundSize: '16px',
                }}
              >
                {BUDGET_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* MỞ HÒM button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || displayFoods.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded bg-[#4a7219] hover:bg-[#568320] active:scale-95 text-white font-black text-sm sm:text-base uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                boxShadow: isSpinning ? 'none' : '0 0 14px rgba(100,160,40,0.5), 0 2px 0 #2d4d0e',
                border: '1px solid #6aaa28',
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isSpinning ? 'ĐANG QUAY...' : 'MỞ HÒM'}</span>
            </button>
          </div>

          {/* Item count hint */}
          <p className="text-[10px] text-slate-600 font-mono">
            {displayFoods.length} món · {CATEGORY_TABS.find(t => t.value === selectedCategory)?.label}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FlavorBox;
