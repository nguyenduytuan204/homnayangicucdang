import React, { useEffect, useRef } from 'react';
// framer-motion replaced with simple stubs for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const motion: any = new Proxy({}, { get: (_, tag: string) => (props: any) => { const {initial:_i,animate:_a,exit:_e,transition:_t,whileHover:_wh,whileTap:_wt,...rest} = props; return React.createElement(tag, rest); }});
const AnimatePresence = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { X, RotateCcw, Heart, Share2, Sparkles } from 'lucide-react';
import type { Food } from '../types';

interface ResultPopupProps {
  food: Food | null;
  onClose: () => void;
  onReroll: () => void;
  onFavorite: (food: Food) => void;
  isFavorite: boolean;
}

const CS2_GRADE_INFO: Record<string, { label: string; sub: string; color: string; glow: string; bg: string }> = {
  'QUỐC DÂN': {
    label: 'QUỐC DÂN GRADE',
    sub: 'Món ăn quen thuộc ưa chuộng',
    color: '#4b69ff',
    glow: 'rgba(75,105,255,0.5)',
    bg: 'from-[#4b69ff]/20 to-transparent',
  },
  'THƯỜNG': {
    label: 'MIL-SPEC GRADE',
    sub: 'Tiêu chuẩn quốc dân',
    color: '#4b69ff',
    glow: 'rgba(75,105,255,0.5)',
    bg: 'from-[#4b69ff]/20 to-transparent',
  },
  'HIẾM': {
    label: 'RESTRICTED // HIẾM',
    sub: 'Hương vị độc đáo',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.6)',
    bg: 'from-[#8b5cf6]/25 to-transparent',
  },
  'CỰC PHẨM': {
    label: 'CLASSIFIED // CỰC PHẨM',
    sub: 'Hương vị hảo hạng đỉnh cao',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.7)',
    bg: 'from-[#ec4899]/30 to-transparent',
  },
  'ĐẶC BIỆT': {
    label: 'COVERT ITEM ★ ĐẶC BIỆT',
    sub: 'MÓN NGON ĐẶC BIỆT THƯỢNG HẠNG',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.9)',
    bg: 'from-amber-500/40 via-yellow-600/20 to-transparent',
  },
  'TỐI MẬT': {
    label: 'COVERT ITEM ★ TỐI MẬT',
    sub: 'SIÊU PHẨM ẨM THỰC TỐI MẬT',
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.9)',
    bg: 'from-amber-500/40 via-red-500/20 to-transparent',
  },
};

const ResultPopup: React.FC<ResultPopupProps> = ({ food, onClose, onReroll, onFavorite, isFavorite }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!food) return null;

  const grade = CS2_GRADE_INFO[food.rarity];

  return (
    <AnimatePresence>
      <div
        ref={overlayRef}
        className="modal-overlay bg-black/85 backdrop-blur-lg"
        onClick={e => e.target === overlayRef.current && onClose()}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.6, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden border-2 bg-[#0a0d14] text-white shadow-2xl"
          style={{
            borderColor: grade.color,
            boxShadow: `0 0 60px ${grade.glow}, 0 0 140px ${grade.glow}`,
          }}
        >
          {/* Top CS2 Unbox Header */}
          <div className="relative bg-[#111622] px-6 py-4 border-b border-[#1c2436] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <div>
                <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black">
                  CS2 CONTAINER UNBOXED // YOU GOT:
                </div>
                <h3 className="text-base font-black tracking-wider uppercase text-white">
                  HÔM NAY ĂN MÓN NÀY!
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded border border-[#232d42] hover:border-red-500 hover:text-red-400 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CS2 Item Presentation Area (Radial Glow) */}
          <div className={`relative h-60 overflow-hidden flex items-center justify-center p-6 bg-gradient-to-b ${grade.bg} bg-[#080b10]`}>
            {/* StatTrak Counter Tag */}
            <div className="absolute top-3 left-3 bg-[#111622]/90 border border-amber-500/50 px-2.5 py-1 rounded flex items-center gap-1.5 text-[10px] font-mono text-amber-400 font-bold backdrop-blur-sm shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>StatTrak™ Food: #{Math.floor(100 + Math.random() * 900)}</span>
            </div>

            {/* Float Wear Rating */}
            <div className="absolute top-3 right-3 bg-[#111622]/90 border border-[#232d42] px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 backdrop-blur-sm">
              Wear: <span className="text-emerald-400 font-bold">Factory New (0.0042)</span>
            </div>

            {/* Food Image with 3D Inspect Feel */}
            <motion.img
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover rounded-lg border-2 shadow-2xl"
              style={{ borderColor: grade.color }}
            />

            {/* Particle Effects for High Grade Items */}
            {food.rarity !== 'THƯỜNG' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="particle w-1.5 h-1.5 rounded-full"
                    style={{
                      background: grade.color,
                      left: `${8 + i * 9}%`,
                      top: `${15 + (i % 4) * 20}%`,
                      animationDelay: `${i * 0.3}s`,
                      boxShadow: `0 0 10px ${grade.color}`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Item Details Panel */}
          <div className="p-5 bg-[#0e131d] space-y-4">
            {/* Grade Badge */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-black tracking-widest uppercase px-2.5 py-1 rounded border"
                  style={{ color: grade.color, borderColor: `${grade.color}60`, background: `${grade.color}15` }}>
                  {grade.label}
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-1">{grade.sub}</div>
              </div>

              {/* Price Tag */}
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Giá trị vật phẩm</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {food.price.toLocaleString()}đ
                </div>
              </div>
            </div>

            {/* Item Name */}
            <h2 className="text-2xl font-black tracking-wide text-white uppercase leading-tight" style={{ color: grade.color }}>
              {food.name}
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-xs leading-relaxed bg-[#080b10] p-3 rounded border border-[#1b2436]">
              {food.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {food.tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151c2b] border border-[#232d42] text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onReroll}
                className="flex-1 py-3 px-4 rounded font-black text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black border border-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                MỞ LẠI CONTAINER (KEY: 1)
              </button>

              <button
                onClick={() => onFavorite(food)}
                className={`p-3 rounded border transition-all ${
                  isFavorite
                    ? 'border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : 'border-[#232d42] bg-[#121824] text-slate-400 hover:text-red-400'
                }`}
                title="Lưu vật phẩm yêu thích"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>

              <button
                onClick={() => navigator.clipboard?.writeText(`CS2 UNBOX: Tôi vừa trúng ${food.name} (${food.rarity}) - ${food.price.toLocaleString()}đ!`)}
                className="p-3 rounded border border-[#232d42] bg-[#121824] text-slate-400 hover:text-cyan-400 transition-all"
                title="Chia sẻ vật phẩm"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Rarity Stripe */}
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${grade.color}, transparent)` }} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResultPopup;
