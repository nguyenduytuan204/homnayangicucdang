import {
  Package, LayoutGrid, Volume2, VolumeX, Music
} from 'lucide-react';

interface HeaderProps {
  points: number;
  totalOpens: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isBGMPlaying: boolean;
  onToggleBGM: () => void;
  onOpenInventory?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  isBGMPlaying,
  onToggleBGM,
  onOpenInventory,
}) => {
  return (
    <header className="relative z-40 bg-[#0e1622] border-b border-[#1b2636] px-4 sm:px-8 py-3">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo "TRƯA NAY ĂN GÌ" */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative flex items-center gap-2">
            {/* Chest Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#e5b358] border-2 border-black rounded-lg flex items-center justify-center shadow-[0_2px_0_#000] relative">
              <div className="text-black font-black text-xs sm:text-sm">🍜</div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-300 rounded-full border border-black animate-pulse" />
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <div className="text-[11px] font-black italic tracking-widest text-[#f5f5f5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none">
                TRƯA NAY
              </div>
              <div className="text-xl sm:text-2xl font-black italic tracking-wider text-[#e5b358] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-none mt-0.5">
                ĂN GÌ
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & "Kho tiếp tế" button like Reference Image 1 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* BGM Toggle */}
          <button
            onClick={onToggleBGM}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              isBGMPlaying
                ? 'border-[#e5b358] bg-[#e5b358]/20 text-[#e5b358]'
                : 'border-[#223147] bg-[#141f2e] text-slate-400 hover:text-white'
            }`}
            title="Bật/tắt nhạc nền"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Sound SFX Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              !isMuted
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : 'border-[#223147] bg-[#141f2e] text-slate-400 hover:text-white'
            }`}
            title="Bật/tắt hiệu ứng âm thanh"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* "Kho tiếp tế" Button (Reference Image 1) */}
          <button
            onClick={onOpenInventory}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#e5b358] text-[#121a24] font-bold text-xs sm:text-sm hover:bg-[#d8a346] active:scale-95 transition-all shadow-md"
          >
            <Package className="w-4 h-4" />
            <span>Kho tiếp tế</span>
          </button>

          {/* Grid Menu Button (Reference Image 1) */}
          <div className="w-9 h-9 rounded-lg border border-[#26374d] bg-[#141f2e] flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
