import React from 'react';
import { Package, Sparkles, PiggyBank } from 'lucide-react';
import type { Tab } from '../types';

interface HeroSectionProps {
  totalOpens: number;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ totalOpens, activeTab, onTabChange }) => {
  return (
    <section className="relative bg-[#0e1622] pt-5 pb-3">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Centered counter: "Lượt quay toàn trạm: 1.223.948" */}
        <div className="text-center mb-6">
          <span className="text-xs sm:text-sm text-slate-400 font-medium">
            Lượt quay toàn trạm:{' '}
            <span className="text-[#e5b358] font-bold font-mono text-sm sm:text-base">
              {(1223948 + totalOpens).toLocaleString()}
            </span>
          </span>
        </div>

        {/* Section title "ĐỔI KHÔNG KHÍ" */}
        <div className="mb-3">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            ĐỔI KHÔNG KHÍ
          </div>
        </div>

        {/* 3 Tabs according to Reference Image 1 */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Tab 1: Trạm tiếp tế */}
          <button
            onClick={() => onTabChange('station')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${
              activeTab === 'station'
                ? 'bg-[#162232] border border-[#e5b358] shadow-[0_0_12px_rgba(229,179,88,0.15)] text-white'
                : 'bg-[#121c2a] border border-[#1f2d40] text-slate-400 hover:text-white hover:border-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded ${activeTab === 'station' ? 'text-[#e5b358]' : 'text-slate-400'}`}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold leading-tight">Trạm tiếp tế</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Mở hòm</div>
            </div>
          </button>

          {/* Tab 2: Duyên vị */}
          <button
            onClick={() => onTabChange('destiny')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${
              activeTab === 'destiny'
                ? 'bg-[#162232] border border-[#e5b358] shadow-[0_0_12px_rgba(229,179,88,0.15)] text-white'
                : 'bg-[#121c2a] border border-[#1f2d40] text-slate-400 hover:text-white hover:border-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded ${activeTab === 'destiny' ? 'text-[#e5b358]' : 'text-slate-400'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold leading-tight">Duyên vị</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">CẦU NGUYỆN</div>
            </div>
          </button>

          {/* Tab 3: Khui vị */}
          <button
            onClick={() => onTabChange('piggy')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${
              activeTab === 'piggy'
                ? 'bg-[#162232] border border-[#e5b358] shadow-[0_0_12px_rgba(229,179,88,0.15)] text-white'
                : 'bg-[#121c2a] border border-[#1f2d40] text-slate-400 hover:text-white hover:border-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded ${activeTab === 'piggy' ? 'text-[#e5b358]' : 'text-slate-400'}`}>
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold leading-tight">Khui vị</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Đập heo</div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
