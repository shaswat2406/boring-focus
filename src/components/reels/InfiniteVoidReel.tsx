import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, FolderGit2, CheckSquare } from 'lucide-react';
import { playTickSound } from '../../utils/audio';

interface InfiniteVoidReelProps {
  voidSwipeCount: number;
  onIncrementSwipe: () => void;
  onExitToTasks: () => void;
  onExitToHub: () => void;
}

export const InfiniteVoidReel: React.FC<InfiniteVoidReelProps> = ({
  voidSwipeCount,
  onIncrementSwipe,
  onExitToTasks,
  onExitToHub,
}) => {
  const [reels, setReels] = useState<{ id: number }[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({ id: i + 1 }))
  );
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Session time counter
  useEffect(() => {
    const t = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const currentIdx = Math.round(el.scrollTop / el.clientHeight);
    if (currentIdx !== activeReelIndex) {
      setActiveReelIndex(currentIdx);
      onIncrementSwipe();
      if (hapticEnabled) playTickSound();

      // Infinite queue append
      if (currentIdx >= reels.length - 8) {
        setReels((prev) => [
          ...prev,
          ...Array.from({ length: 20 }, (_, i) => ({ id: prev.length + i + 1 })),
        ]);
      }
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="relative max-w-md mx-auto w-full h-[calc(100vh-9.2rem)] flex flex-col justify-between select-none">
      {/* Top HUD: Unobtrusive Metrics Bar */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md mb-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-white font-semibold">
            Reel #{activeReelIndex + 1}
          </span>
          <span className="text-slate-500 font-mono">|</span>
          <span className="font-mono text-slate-300">
            Time: {formatTime(sessionSeconds)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              hapticEnabled
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-white/5 text-slate-600'
            }`}
            title="Tactile swipe sound (Candy cigarette physical feedback)"
          >
            {hapticEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Pure Infinite Blank Reel Feed */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 rounded-2xl overflow-hidden border border-white/10 snap-reel-container bg-black shadow-2xl relative"
      >
        {reels.map((reel, idx) => (
          <div
            key={reel.id}
            className="snap-reel-card w-full flex flex-col items-center justify-between p-8 bg-black relative"
          >
            {/* Top Subtle Card Index */}
            <div className="w-full flex justify-between items-center text-slate-800 font-mono text-xs">
              <span>BLANK REEL</span>
              <span>#{idx + 1}</span>
            </div>

            {/* Center Void: Pure Darkness with Faint Monospace Number */}
            <div className="flex flex-col items-center justify-center my-auto">
              <span className="font-mono text-7xl font-light text-[#0f1117] tracking-widest select-none">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-mono text-[#181b24] tracking-wider uppercase mt-3">
                Pure Void • Zero Dopamine
              </span>
            </div>

            {/* Subtle Hint */}
            <div className="w-full text-center pb-2 text-[10px] font-mono text-[#1a1e29]">
              Swipe up to continue flicking • Mindful fidget
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Quick Escape Hatch */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={onExitToHub}
          className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-white/20 transition-all text-center flex items-center justify-center gap-1.5"
        >
          <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Open Local Hub</span>
        </button>
        <button
          onClick={onExitToTasks}
          className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-white/20 transition-all text-center flex items-center justify-center gap-1.5"
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Go to Tasks</span>
        </button>
      </div>
    </div>
  );
};
