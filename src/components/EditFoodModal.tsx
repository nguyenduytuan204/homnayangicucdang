import React, { useState, useEffect } from 'react';
// framer-motion replaced with simple stubs for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const motion: any = new Proxy({}, { get: (_, tag: string) => (props: any) => { const {initial:_i,animate:_a,exit:_e,transition:_t,whileHover:_wh,whileTap:_wt,...rest} = props; return React.createElement(tag, rest); }});
const AnimatePresence = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { X, Save, Trash2, Image, DollarSign, Tag, FileText, Sparkles } from 'lucide-react';
import type { Food, Category, Rarity } from '../types';

interface EditFoodModalProps {
  food: Food | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFood: Food) => void;
  onDelete?: (foodId: string) => void;
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({
  food,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(35000);
  const [category, setCategory] = useState<Category>('main');
  const [rarity, setRarity] = useState<Rarity>('THƯỜNG');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  useEffect(() => {
    if (food) {
      setName(food.name);
      setImage(food.image);
      setPrice(food.price);
      setCategory(food.category);
      setRarity(food.rarity);
      setDescription(food.description);
      setTagsStr(food.tags.join(', '));
    } else {
      setName('');
      setImage('https://picsum.photos/seed/customfood/400/300');
      setPrice(45000);
      setCategory('main');
      setRarity('HIẾM');
      setDescription('');
      setTagsStr('Mới, Thơm ngon');
    }
  }, [food, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const updatedFood: Food = {
      id: food ? food.id : `custom-${Date.now()}`,
      name: name.trim(),
      image: image.trim() || 'https://picsum.photos/seed/food/400/300',
      price: Number(price) || 0,
      category,
      rarity,
      description: description.trim() || 'Món ăn tự thêm bởi người dùng.',
      tags: tags.length > 0 ? tags : ['Đặc biệt'],
      rating: food?.rating || 4.8,
    };

    onSave(updatedFood);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-bg-panel border border-accent-gold/40 rounded-xl overflow-hidden shadow-glow-gold"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-dim bg-bg-card">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-gold" />
              <h3 className="text-base font-bold text-text-primary">
                {food ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Image Preview & URL */}
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-accent-purple" />
                Link hình ảnh (URL)
              </label>
              <div className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded overflow-hidden border border-border-dim bg-bg-card flex-shrink-0">
                  <img
                    src={image || 'https://picsum.photos/seed/placeholder/400/300'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/400/300';
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="input-field flex-1 text-xs"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                Tên món ăn <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Cơm Tấm Sườn Bì Chả"
                required
                className="input-field w-full text-sm font-semibold text-text-primary"
              />
            </div>

            {/* Price & Category Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Price */}
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-accent-green" />
                  Giá tiền (VNĐ)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  step={1000}
                  min={0}
                  className="input-field w-full text-sm font-mono font-bold text-accent-green"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                  Danh mục
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="input-field w-full text-xs bg-bg-card cursor-pointer"
                >
                  <option value="main">🍜 Món chính</option>
                  <option value="snack">🍓 Món nhẹ / Dễ ăn</option>
                  <option value="drink">🧋 Đồ uống</option>
                  <option value="dessert">🍰 Đồ ngọt</option>
                </select>
              </div>
            </div>

            {/* Rarity */}
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                Độ hiếm (Rarity)
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {(['QUỐC DÂN', 'HIẾM', 'CỰC PHẨM', 'ĐẶC BIỆT', 'TỐI MẬT'] as Rarity[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRarity(r)}
                    className={`flex-1 min-w-[70px] py-1.5 rounded text-[11px] font-bold border transition-all ${
                      rarity === r
                        ? r === 'QUỐC DÂN'
                          ? 'border-[#4b69ff] bg-[#4b69ff]/20 text-[#4b69ff]'
                          : r === 'HIẾM'
                          ? 'border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]'
                          : r === 'CỰC PHẨM'
                          ? 'border-[#ec4899] bg-[#ec4899]/20 text-[#ec4899]'
                          : 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : 'border-border-dim text-text-muted hover:border-border-glow'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-accent-cyan" />
                Mô tả ngắn
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Mô tả thành phần, hương vị đặc trưng..."
                className="input-field w-full text-xs resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-accent-gold" />
                Tags (cách nhau bởi dấu phẩy)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="Ngon, Giòn, Cay, Đặc sản"
                className="input-field w-full text-xs"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border-dim">
              {food && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Bạn có chắc muốn xóa món "${food.name}"?`)) {
                      onDelete(food.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 rounded border border-accent-red/40 text-accent-red hover:bg-accent-red/10 text-xs flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa món
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="btn-outline text-xs px-4 py-2 ml-auto"
              >
                Hủy
              </button>

              <button
                type="submit"
                className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditFoodModal;
