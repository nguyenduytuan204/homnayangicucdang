import React, { useState } from 'react';
import { History, Trash2, ChevronDown, ChevronUp, Clock, Zap } from 'lucide-react';
import type { HistoryEntry } from '../types';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

const RARITY_COLOR: Record<string, string> = {
  'THƯỜNG': 'text-rarity-common',
  'HIẾM': 'text-rarity-rare',
  'CỰC PHẨM': 'text-rarity-epic',
  'TỐI MẬT': 'text-rarity-secret',
};

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60000) return 'Vừa xong';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
  return d.toLocaleDateString('vi-VN');
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear, onSelect }) => {
  const [expanded, setExpanded] = useState(true);

  if (history.length === 0) return null;

  return (
    <div className="panel overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-bg-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-accent-purple" />
          <span className="text-sm font-semibold text-text-primary">Lịch sử random</span>
          <span className="px-1.5 py-0.5 rounded bg-accent-purple/15 text-accent-purple text-[10px] font-bold">
            {history.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={e => { e.stopPropagation(); onClear(); }}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-muted hover:text-accent-red hover:bg-accent-red/5 border border-transparent hover:border-accent-red/20 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              Xóa
            </button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="border-t border-border-dim">
          <div className="max-h-72 overflow-y-auto">
            {history.slice(0, 20).map((entry, idx) => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors border-b border-border-dim/50 last:border-0 text-left group"
              >
                {/* Index */}
                <div className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center bg-bg-card border border-border-dim text-[10px] font-mono text-text-muted">
                  {idx + 1}
                </div>

                {/* Image thumbnail */}
                <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden border border-border-dim">
                  <img
                    src={entry.food.image}
                    alt={entry.food.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-text-primary group-hover:text-accent-gold transition-colors truncate">
                    {entry.food.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-accent-green text-[11px] font-mono font-bold">
                      {entry.food.price.toLocaleString()}đ
                    </span>
                    <span className={`text-[9px] font-bold ${RARITY_COLOR[entry.food.rarity]}`}>
                      {entry.food.rarity}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 flex items-center gap-1 text-[10px] text-text-muted">
                  <Clock className="w-2.5 h-2.5" />
                  {formatTime(entry.timestamp)}
                </div>
              </button>
            ))}
          </div>

          {history.length > 20 && (
            <div className="px-4 py-2 text-center text-xs text-text-muted border-t border-border-dim">
              Hiển thị 20/{history.length} lần random gần nhất
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {expanded && history.length > 0 && (
        <div className="border-t border-border-dim px-4 py-2.5 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs">
            <Zap className="w-3 h-3 text-accent-gold" />
            <span className="text-text-muted">Tổng random:</span>
            <span className="text-accent-gold font-bold font-mono">{history.length}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-text-muted">Phổ biến nhất:</span>
            <span className="text-accent-purple font-medium truncate max-w-[120px]">
              {(() => {
                const freq: Record<string, number> = {};
                history.forEach(h => { freq[h.food.name] = (freq[h.food.name] || 0) + 1; });
                const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
                return top ? top[0] : '-';
              })()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
