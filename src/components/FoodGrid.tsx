import React from 'react';
import { PackageX } from 'lucide-react';
import type { Food } from '../types';
import FoodCard from './FoodCard';

interface FoodGridProps {
  foods: Food[];
  onCardClick: (food: Food) => void;
  onFavorite: (food: Food) => void;
  favorites: string[];
  isLoading?: boolean;
}

const FoodGrid: React.FC<FoodGridProps> = ({ foods, onCardClick, onFavorite, favorites, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-64 rounded-lg bg-[#151f2b] border border-[#1e2c3e] animate-pulse" />
        ))}
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-[#111822] rounded-lg border border-[#1d2736]">
        <div className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center mb-3 bg-[#16202c]">
          <PackageX className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-200 mb-1">Không tìm thấy món ăn nào</h3>
        <p className="text-slate-400 text-xs max-w-xs">
          Hãy thử đổi bộ lọc hoặc tìm kiếm tên món khác
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {foods.map(food => (
        <FoodCard
          key={food.id}
          food={food}
          onClick={onCardClick}
          onFavorite={onFavorite}
          isFavorite={favorites.includes(food.id)}
        />
      ))}
    </div>
  );
};

export default FoodGrid;
