import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, ChevronDown, Plus, RotateCcw } from 'lucide-react';
import type { Category, SortOption } from '../types';
import { BUDGET_OPTIONS } from '../data/foods';

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  category: Category | 'all';
  onCategory: (c: Category | 'all') => void;
  budget: number;
  onBudget: (b: number) => void;
  sort: SortOption;
  onSort: (s: SortOption) => void;
  selectedRarity: string;
  onRarity: (r: string) => void;
  totalResults: number;
  onAddFood?: () => void;
  onResetFoods?: () => void;
}

const CATEGORIES: { value: Category | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Tất cả', icon: '🍱' },
  { value: 'main', label: 'Món chính', icon: '🍜' },
  { value: 'snack', label: 'Món nhẹ', icon: '🍓' },
  { value: 'drink', label: 'Đồ uống', icon: '🧋' },
  { value: 'dessert', label: 'Đồ ngọt', icon: '🍰' },
];

const RARITIES = ['all', 'QUỐC DÂN', 'HIẾM', 'CỰC PHẨM', 'ĐẶC BIỆT', 'TỐI MẬT'] as const;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'random', label: '🎲 Ngẫu nhiên' },
  { value: 'price-asc', label: '💰 Giá thấp → cao' },
  { value: 'price-desc', label: '💎 Giá cao → thấp' },
  { value: 'name', label: '🔤 Tên A→Z' },
];

const FilterBar: React.FC<FilterBarProps> = ({
  search, onSearch,
  category, onCategory,
  budget, onBudget,
  sort, onSort,
  selectedRarity, onRarity,
  totalResults,
  onAddFood,
  onResetFoods,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = category !== 'all' || budget !== 999999 || selectedRarity !== 'all' || sort !== 'random';

  return (
    <div className="bg-[#0e1622] py-3">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Row 1: Search + Quick Tools */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Tìm kiếm món ăn trong hòm..."
              className="w-full bg-[#131d2a] border border-[#1e2d3e] text-white text-xs sm:text-sm pl-9 pr-8 py-2 rounded-lg focus:outline-none focus:border-[#e5b358] placeholder:text-slate-500"
            />
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative hidden sm:block">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sort}
              onChange={e => onSort(e.target.value as SortOption)}
              className="bg-[#131d2a] border border-[#1e2d3e] text-slate-300 text-xs pl-8 pr-7 py-2 rounded-lg cursor-pointer focus:outline-none focus:border-[#e5b358] appearance-none min-w-[150px]"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
              showFilters || hasActiveFilters
                ? 'border-[#e5b358] text-[#e5b358] bg-[#e5b358]/10'
                : 'border-[#1e2d3e] text-slate-400 bg-[#131d2a] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Bộ lọc</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#e5b358]" />
            )}
          </button>

          {/* Add custom food */}
          {onAddFood && (
            <button
              onClick={onAddFood}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e5b358]/40 bg-[#e5b358]/10 text-[#e5b358] hover:bg-[#e5b358]/20 text-xs font-bold transition-all"
              title="Tự thêm món ăn"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thêm món</span>
            </button>
          )}

          {/* Reset custom foods */}
          {onResetFoods && (
            <button
              onClick={onResetFoods}
              className="p-2 rounded-lg border border-[#1e2d3e] bg-[#131d2a] text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all"
              title="Khôi phục danh sách món gốc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Count */}
          <div className="hidden md:flex items-center gap-1.5 ml-auto text-xs text-slate-400">
            <span className="text-[#e5b358] font-bold font-mono">{totalResults}</span>
            <span>món ăn</span>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => onCategory(cat.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat.value
                  ? 'bg-[#e5b358] text-[#0e1622] font-bold shadow-md'
                  : 'bg-[#131d2a] border border-[#1e2d3e] text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Expandable Advanced Filters */}
        {showFilters && (
          <div className="mt-3 p-3 bg-[#131d2a] border border-[#1e2d3e] rounded-lg">
            <div className="flex flex-wrap gap-4">
              {/* Rarity filter */}
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-mono">Độ hiếm</div>
                <div className="flex gap-1.5 flex-wrap">
                  {RARITIES.map(r => (
                    <button
                      key={r}
                      onClick={() => onRarity(r)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                        selectedRarity === r
                          ? 'border-[#e5b358] bg-[#e5b358]/20 text-[#e5b358]'
                          : 'border-[#1e2d3e] text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {r === 'all' ? 'Tất cả' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget filter */}
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-mono">Ngân sách</div>
                <div className="flex gap-1.5 flex-wrap">
                  {BUDGET_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => onBudget(opt.value)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                        budget === opt.value
                          ? 'border-[#637d36] bg-[#637d36]/20 text-emerald-400'
                          : 'border-[#1e2d3e] text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    onCategory('all');
                    onBudget(999999);
                    onSort('random');
                    onRarity('all');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all self-end"
                >
                  <X className="w-3 h-3" />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
