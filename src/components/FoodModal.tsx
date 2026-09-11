import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Clock, Flame, Share2, RotateCcw, ChevronRight, Edit3 } from 'lucide-react';
import type { Food } from '../types';

interface FoodModalProps {
  food: Food | null;
  onClose: () => void;
  onFavorite: (food: Food) => void;
  isFavorite: boolean;
  onRandom: (food: Food) => void;
  onEdit?: (food: Food) => void;
}

const RARITY_CONFIG: Record<string, { color: string; glow: string; bgGlow: string }> = {
  'QUỐC DÂN': { color: '#4b69ff', glow: 'rgba(75,105,255,0.4)', bgGlow: 'rgba(75,105,255,0.06)' },
  'THƯỜNG': { color: '#64748b', glow: 'rgba(100,116,139,0.3)', bgGlow: 'rgba(100,116,139,0.05)' },
  'HIẾM': { color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', bgGlow: 'rgba(139,92,246,0.07)' },
  'CỰC PHẨM': { color: '#ec4899', glow: 'rgba(236,72,153,0.5)', bgGlow: 'rgba(236,72,153,0.08)' },
  'ĐẶC BIỆT': { color: '#f59e0b', glow: 'rgba(245,158,11,0.6)', bgGlow: 'rgba(245,158,11,0.1)' },
  'TỐI MẬT': { color: '#f59e0b', glow: 'rgba(245,158,11,0.7)', bgGlow: 'rgba(245,158,11,0.12)' },
};

const CATEGORY_LABEL: Record<string, string> = {
  main: '🍜 Món chính',
  snack: '🍓 Món nhẹ / dễ ăn',
  drink: '🧋 Đồ uống',
  dessert: '🍰 Đồ ngọt',
  nhau: '🍺 Món nhậu',
};

const FoodModal: React.FC<FoodModalProps> = ({ food, onClose, onFavorite, isFavorite, onRandom, onEdit }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!food) return null;

  const rarity = RARITY_CONFIG[food.rarity];

  return (
    <AnimatePresence>
      <div
        ref={overlayRef}
        className="modal-overlay"
        onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="relative w-full max-w-lg rounded-xl overflow-hidden border"
          style={{
            borderColor: rarity.color,
            boxShadow: `0 0 40px ${rarity.glow}, 0 20px 60px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-bg-primary/80 border border-border-dim text-text-muted hover:border-accent-red/50 hover:text-accent-red transition-all backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Hero image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/30 to-transparent" />

            {/* Overlaid title */}
            <div className="absolute bottom-4 left-5 right-14">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border"
                  style={{ color: rarity.color, borderColor: `${rarity.color}50`, background: rarity.bgGlow }}>
                  {food.rarity}
                </span>
                <span className="text-[10px] text-text-muted">{CATEGORY_LABEL[food.category]}</span>
              </div>
              <h2 className="text-xl font-black text-text-primary leading-tight">{food.name}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="bg-bg-panel p-5">
            {/* Price row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-accent-green font-mono">
                  {food.price.toLocaleString()}
                </span>
                <span className="text-text-muted text-sm">đồng</span>
              </div>
              {food.rating && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-accent-gold/30 bg-accent-gold/5">
                  <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />
                  <span className="font-bold text-accent-gold">{food.rating}</span>
                  <span className="text-text-muted text-xs">/5</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="neon-line mb-4" />

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{food.description}</p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {food.calories && (
                <div className="flex items-center gap-2 p-3 rounded border border-border-dim bg-bg-card">
                  <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wide">Calo</div>
                    <div className="text-sm font-bold text-text-primary">{food.calories} kcal</div>
                  </div>
                </div>
              )}
              {food.prepTime && (
                <div className="flex items-center gap-2 p-3 rounded border border-border-dim bg-bg-card">
                  <Clock className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wide">Thời gian</div>
                    <div className="text-sm font-bold text-text-primary">{food.prepTime}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {food.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-bg-card border border-border-dim text-text-secondary">
                  <ChevronRight className="w-2.5 h-2.5 text-accent-purple" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => { onRandom(food); onClose(); }}
                className="btn-gold flex-1 flex items-center justify-center gap-2 py-2.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                CHỌN MÓN NÀY
              </button>

              <button
                onClick={() => onFavorite(food)}
                className={`px-4 py-2.5 rounded border transition-all duration-200 flex items-center gap-1.5 text-xs ${
                  isFavorite
                    ? 'border-accent-red/60 bg-accent-red/10 text-accent-red'
                    : 'border-border-dim bg-bg-card text-text-muted hover:border-accent-red/40 hover:text-accent-red'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-accent-red' : ''}`} />
                {isFavorite ? 'Đã thích' : 'Yêu thích'}
              </button>

              {onEdit && (
                <button
                  onClick={() => { onEdit(food); onClose(); }}
                  className="p-2.5 rounded border border-border-dim bg-bg-card text-text-muted hover:border-accent-gold/50 hover:text-accent-gold transition-all"
                  title="Sửa tên / ảnh món ăn"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => navigator.clipboard?.writeText(`Hôm nay tôi ăn: ${food.name} - ${food.price.toLocaleString()}đ`)}
                className="p-2.5 rounded border border-border-dim bg-bg-card text-text-muted hover:border-accent-cyan/50 hover:text-accent-cyan transition-all"
                title="Chia sẻ"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${rarity.color}, transparent)` }} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FoodModal;
