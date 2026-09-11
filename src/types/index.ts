export type Category = 'snack' | 'main' | 'drink' | 'dessert' | 'nhau';
export type Rarity = 'QUỐC DÂN' | 'HIẾM' | 'CỰC PHẨM' | 'ĐẶC BIỆT' | 'TỐI MẬT' | 'THƯỜNG';

export interface Food {
  id: string;
  name: string;
  price: number;
  category: Category;
  subCategory?: string;
  rarity: Rarity;
  image: string;
  description: string;
  tags: string[];
  calories?: number;
  prepTime?: string;
  rating?: number;
}

export interface HistoryEntry {
  id: string;
  food: Food;
  timestamp: number;
  budget?: number;
}

export type SortOption = 'random' | 'price-asc' | 'price-desc' | 'name';
export type BudgetOption = 25000 | 50000 | 75000 | 100000 | 150000 | 999999;
export type Tab = 'station' | 'destiny' | 'piggy';
