import React from 'react';
import { Heart } from 'lucide-react';
import type { Food } from '../types';

interface FoodCardProps {
  food: Food;
  onClick: (food: Food) => void;
  onFavorite: (food: Food) => void;
  isFavorite: boolean;
}

const RARITY_LABEL_TEXT: Record<string, { label: string; textClass: string; barClass: string }> = {
  'QUỐC DÂN': { label: 'QUỐC DÂN', textClass: 'text-[#4b69ff]', barClass: 'bg-[#4b69ff]' },
  'THƯỜNG': { label: 'QUỐC DÂN', textClass: 'text-[#4b69ff]', barClass: 'bg-[#4b69ff]' },
  'HIẾM': { label: 'HIẾM', textClass: 'text-[#8b5cf6]', barClass: 'bg-[#8b5cf6]' },
  'CỰC PHẨM': { label: 'CỰC PHẨM', textClass: 'text-[#ec4899]', barClass: 'bg-[#ec4899]' },
  'ĐẶC BIỆT': { label: '★ ĐẶC BIỆT', textClass: 'text-[#f59e0b]', barClass: 'bg-[#f59e0b]' },
  'TỐI MẬT': { label: '★ TỐI MẬT', textClass: 'text-[#f59e0b]', barClass: 'bg-gradient-to-r from-amber-500 to-yellow-300' },
};

const FoodCard: React.FC<FoodCardProps> = ({ food, onClick, onFavorite, isFavorite }) => {
  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite(food);
  };

  const rarityInfo = RARITY_LABEL_TEXT[food.rarity] || RARITY_LABEL_TEXT['THƯỜNG'];

  return (
    <div
      className="group relative bg-[#151f2b] border border-[#1e2c3e] hover:border-slate-500 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1"
      onClick={() => onClick(food)}
    >
      {/* Top Half: Food Image Showcase (Reference Image 2) */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-[#1b2636] to-[#121a24] flex items-center justify-center p-3 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover rounded-md shadow-md transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Favorite button overlay */}
        <button
          onClick={handleFav}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500/30 text-red-400 border border-red-500/50 shadow-md'
              : 'bg-black/50 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-white'
          } backdrop-blur-sm`}
          aria-label="Yêu thích"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Bottom Half: Category, Name, Price & Rarity Tag (Reference Image 2) */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          {/* Subcategory Label */}
          <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mb-1 line-clamp-1">
            {food.subCategory || (food.category === 'main' ? 'Bún, phở & mì' : food.category === 'snack' ? 'Ăn vặt & bánh' : food.category === 'drink' ? 'Đồ uống & trà' : 'Bánh ngọt & tráng miệng')}
          </div>

          {/* Food Name */}
          <div className="font-bold text-xs sm:text-sm text-white leading-snug line-clamp-2 min-h-[34px] group-hover:text-[#e5b358] transition-colors">
            {food.name}
          </div>
        </div>

        {/* Price & Rarity Tag Row */}
        <div className="flex items-center justify-between mt-3 pt-1">
          {/* Price */}
          <span className="text-xs sm:text-sm font-bold font-mono text-white">
            {food.price.toLocaleString()}đ
          </span>

          {/* Rarity text tag (Reference Image 2) */}
          <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono ${rarityInfo.textClass}`}>
            {rarityInfo.label}
          </span>
        </div>
      </div>

      {/* Rarity Bottom Stripe */}
      <div className={`h-[3px] w-full ${rarityInfo.barClass}`} />
    </div>
  );
};

export default FoodCard;
