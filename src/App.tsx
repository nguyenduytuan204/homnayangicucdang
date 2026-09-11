import { useState, useMemo, useCallback, useEffect, useRef, type ReactNode } from 'react';

// Simple pass-through to replace AnimatePresence for debugging
const AnimatePresence = ({ children }: { children?: ReactNode; mode?: string }) => <>{children}</>;
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FlavorBox from './components/FlavorBox';
import FilterBar from './components/FilterBar';
import FoodGrid from './components/FoodGrid';
import FoodModal from './components/FoodModal';
import ResultPopup from './components/ResultPopup';
import HistoryPanel from './components/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FOODS } from './data/foods';
import type { Food, Category, SortOption, HistoryEntry, Tab } from './types';
import { Sparkles, PiggyBank, RotateCcw } from 'lucide-react';

import EditFoodModal from './components/EditFoodModal';
import { soundEffects } from './utils/audio';

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function App() {
  // Persistent state
  const [foodsList, setFoodsList] = useLocalStorage<Food[]>('custom-foods-list-v2', FOODS);
  const [favorites, setFavorites] = useLocalStorage<string[]>('food-favorites', []);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('food-history', []);
  const [totalOpens, setTotalOpens] = useLocalStorage<number>('food-total-opens', 0);
  const [points, setPoints] = useLocalStorage<number>('food-points', 150);
  const [isMuted, setIsMuted] = useLocalStorage<boolean>('food-muted', false);
  const [isBGMPlaying, setIsBGMPlaying] = useState<boolean>(false);

  // Edit Food Modal state
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // Section reference for quick scroll to inventory
  const inventoryRef = useRef<HTMLDivElement>(null);

  const handleToggleBGM = () => {
    if (isBGMPlaying) {
      soundEffects.stopBGM();
      setIsBGMPlaying(false);
    } else {
      soundEffects.startBGM();
      setIsBGMPlaying(true);
    }
  };

  const handleSaveFood = (updatedFood: Food) => {
    setFoodsList(prev => {
      const exists = prev.some(f => f.id === updatedFood.id);
      if (exists) {
        return prev.map(f => f.id === updatedFood.id ? updatedFood : f);
      }
      return [updatedFood, ...prev];
    });
  };

  const handleDeleteFood = (foodId: string) => {
    setFoodsList(prev => prev.filter(f => f.id !== foodId));
  };

  const handleResetFoods = () => {
    if (window.confirm('Khôi phục lại danh sách món ăn gốc mặc định? (Tất cả món tự thêm/sửa sẽ bị xóa)')) {
      setFoodsList(FOODS);
    }
  };

  // UI state
  const [activeTab, setActiveTab] = useState<Tab>('station');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('main');
  const [budget, setBudget] = useState<number>(50000);
  const [sort, setSort] = useState<SortOption>('random');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [resultFood, setResultFood] = useState<Food | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Filtered & sorted foods
  const filteredFoods = useMemo(() => {
    let result = [...foodsList];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (category !== 'all') {
      result = result.filter(f => f.category === category);
    }

    // Budget
    if (budget !== 999999) {
      result = result.filter(f => f.price <= budget);
    }

    // Rarity
    if (selectedRarity !== 'all') {
      result = result.filter(f => f.rarity === selectedRarity);
    }

    // Sort
    switch (sort) {
      case 'random':
        result = shuffle(result);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
    }

    return result;
    // eslint-disable-next-line
  }, [foodsList, search, category, budget, selectedRarity, sort, shuffleSeed]);

  const handleResult = useCallback((food: Food) => {
    setResultFood(food);
    setShowResult(true);
  }, []);

  const handleOpenBox = useCallback(() => {
    setTotalOpens(prev => prev + 1);
    setPoints(prev => prev + 10);
  }, [setTotalOpens, setPoints]);

  const handleAddToHistory = useCallback((food: Food) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${food.id}`,
      food,
      timestamp: Date.now(),
      budget,
    };
    setHistory(prev => [entry, ...prev].slice(0, 100));
  }, [budget, setHistory]);

  // When result popup appears, add to history
  useEffect(() => {
    if (resultFood && showResult) {
      handleAddToHistory(resultFood);
    }
    // eslint-disable-next-line
  }, [resultFood, showResult]);

  const handleReroll = useCallback(() => {
    setShowResult(false);
    setTimeout(() => {
      const pool = foodsList.filter(f =>
        (category === 'all' || f.category === category) &&
        (budget === 999999 || f.price <= budget)
      );
      if (pool.length === 0) return;
      const food = pool[Math.floor(Math.random() * pool.length)];
      handleResult(food);
      handleOpenBox();
      handleAddToHistory(food);
    }, 200);
  }, [foodsList, category, budget, handleResult, handleOpenBox, handleAddToHistory]);

  const handleFavorite = useCallback((food: Food) => {
    setFavorites(prev => {
      if (prev.includes(food.id)) {
        return prev.filter(id => id !== food.id);
      }
      return [...prev, food.id];
    });
  }, [setFavorites]);

  const handleHistorySelect = (entry: HistoryEntry) => {
    setSelectedFood(entry.food);
  };

  const handleRandomFromModal = (food: Food) => {
    setSelectedFood(null);
    handleResult(food);
    handleOpenBox();
  };

  const handleReshuffle = () => {
    setShuffleSeed(s => s + 1);
  };

  const scrollToInventory = () => {
    if (activeTab !== 'station') {
      setActiveTab('station');
    }
    setTimeout(() => {
      inventoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Piggy bank smash handler
  const handleSmashPiggy = () => {
    const pool = foodsList;
    const randomFood = pool[Math.floor(Math.random() * pool.length)];
    const bonusPoints = Math.floor(20 + Math.random() * 50);
    setPoints(p => p + bonusPoints);
    handleResult(randomFood);
    handleOpenBox();
  };

  return (
    <div className="min-h-screen bg-[#0e1622] text-slate-100 font-sans selection:bg-[#e5b358]/30">
      <div className="relative z-10">
        {/* Header (Reference Image 1) */}
        <Header
          points={points}
          totalOpens={totalOpens}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(m => !m)}
          isBGMPlaying={isBGMPlaying}
          onToggleBGM={handleToggleBGM}
          onOpenInventory={scrollToInventory}
        />

        {/* Hero Section with "ĐỔI KHÔNG KHÍ" and 3 Tabs (Reference Image 1) */}
        <HeroSection
          totalOpens={totalOpens}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'station' ? (
            <div key="station">
              {/* Flavor Box Carousel & "MỞ HÒM" (Reference Image 1) */}
              <FlavorBox
                foods={foodsList}
                budget={budget}
                onBudgetChange={setBudget}
                selectedCategory={category}
                onCategoryChange={setCategory}
                isMuted={isMuted}
                onResult={handleResult}
                onOpen={handleOpenBox}
              />

              {/* History Panel if exists */}
              {history.length > 0 && (
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 my-4">
                  <HistoryPanel
                    history={history}
                    onClear={() => setHistory([])}
                    onSelect={handleHistorySelect}
                  />
                </div>
              )}

              {/* SECTION: "Vật phẩm trong hòm" (Reference Image 2) */}
              <div ref={inventoryRef} className="max-w-screen-2xl mx-auto px-4 sm:px-8 pt-8 pb-4">
                <div className="flex items-center justify-between mb-4 border-b border-[#1b2636] pb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    Vật phẩm trong hòm
                  </h2>
                  <button
                    onClick={handleReshuffle}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#233347] bg-[#141f2e] text-slate-300 hover:text-white text-xs font-semibold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#e5b358]" />
                    <span>Trộn vị</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <FilterBar
                search={search}
                onSearch={setSearch}
                category={category}
                onCategory={setCategory}
                budget={budget}
                onBudget={setBudget}
                sort={sort}
                onSort={v => { setSort(v); if (v === 'random') handleReshuffle(); }}
                selectedRarity={selectedRarity}
                onRarity={setSelectedRarity}
                totalResults={filteredFoods.length}
                onAddFood={() => {
                  setEditingFood(null);
                  setShowEditModal(true);
                }}
                onResetFoods={handleResetFoods}
              />

              {/* Food Grid (6 columns on desktop - Reference Image 2) */}
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
                <FoodGrid
                  foods={filteredFoods}
                  onCardClick={setSelectedFood}
                  onFavorite={handleFavorite}
                  favorites={favorites}
                />
              </div>
            </div>
          ) : activeTab === 'destiny' ? (
            <div key="destiny" className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-10">
              {/* Destiny Tab: Favorites & Prayers */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-[#e5b358] mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#e5b358]" /> Duyên Vị Cầu Nguyện
                </h2>
                <p className="text-slate-400 text-sm">Những món ăn bạn đã gửi gắm yêu thích</p>
              </div>

              {/* Favorites Grid */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">YÊU THÍCH</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold font-mono">
                    {favorites.length} món
                  </span>
                </div>

                {favorites.length === 0 ? (
                  <div className="bg-[#131d2a] border border-[#1e2d3e] rounded-xl p-10 text-center">
                    <div className="text-4xl mb-3">❤️</div>
                    <p className="text-slate-300 text-sm font-semibold">Chưa có món nào được yêu thích</p>
                    <p className="text-slate-500 text-xs mt-1">Nhấn biểu tượng trái tim trên thẻ món để lưu vào Duyên vị</p>
                  </div>
                ) : (
                  <FoodGrid
                    foods={foodsList.filter(f => favorites.includes(f.id))}
                    onCardClick={setSelectedFood}
                    onFavorite={handleFavorite}
                    favorites={favorites}
                  />
                )}
              </div>

              {/* History */}
              {history.length > 0 && (
                <HistoryPanel
                  history={history}
                  onClear={() => setHistory([])}
                  onSelect={handleHistorySelect}
                />
              )}
            </div>
          ) : (
            <div key="piggy" className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-10">
              {/* Piggy Tab: "Khui vị - Đập heo" */}
              <div className="max-w-lg mx-auto bg-[#131d2a] border border-[#e5b358]/40 rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#e5b358]/20 border border-[#e5b358] flex items-center justify-center text-4xl mb-4 animate-bounce">
                  🐷
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase">
                  KHUI VỊ // ĐẬP HEO TIẾP TẾ
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Đập heo đất để nhận ngay điểm thưởng may mắn và khui 1 món ăn ngẫu nhiên siêu hấp dẫn!
                </p>

                <div className="bg-[#0e1622] p-4 rounded-xl border border-[#1e2d3e] mb-6 flex items-center justify-around">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Điểm hiện có</div>
                    <div className="text-xl font-black text-[#e5b358] font-mono">{points} pts</div>
                  </div>
                  <div className="w-[1px] h-8 bg-[#1e2d3e]" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Heo tích lũy</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">ĐẦY ẮP ✨</div>
                  </div>
                </div>

                <button
                  onClick={handleSmashPiggy}
                  className="w-full py-4 rounded-xl bg-[#e5b358] hover:bg-[#d8a346] active:scale-95 text-[#0e1622] font-black text-base uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(229,179,88,0.4)] flex items-center justify-center gap-2"
                >
                  <PiggyBank className="w-5 h-5" />
                  <span>ĐẬP HEO NGAY!</span>
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="border-t border-[#1a2536] py-6 mt-12 bg-[#0a101a]">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">TRƯA NAY ĂN GÌ</span>
                <span>•</span>
                <span>Hệ thống chọn món ăn thông minh</span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span>{foodsList.length} món ăn</span>
                <span>•</span>
                <span className="text-[#e5b358]">{(1223948 + totalOpens).toLocaleString()} lượt mở</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedFood && (
          <FoodModal
            food={selectedFood}
            onClose={() => setSelectedFood(null)}
            onFavorite={handleFavorite}
            isFavorite={favorites.includes(selectedFood.id)}
            onRandom={handleRandomFromModal}
            onEdit={(foodToEdit) => {
              setEditingFood(foodToEdit);
              setShowEditModal(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResult && resultFood && (
          <ResultPopup
            food={resultFood}
            onClose={() => setShowResult(false)}
            onReroll={() => { setShowResult(false); setTimeout(handleReroll, 100); }}
            onFavorite={handleFavorite}
            isFavorite={favorites.includes(resultFood.id)}
          />
        )}
      </AnimatePresence>

      {/* Edit / Add Food Modal */}
      <EditFoodModal
        food={editingFood}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveFood}
        onDelete={handleDeleteFood}
      />
    </div>
  );
}

export default App;
