import React from 'react';
import { ShieldCheck, Flame, Compass } from 'lucide-react';
import { TabType, FocusStats } from '../types';

interface HeaderProps {
  activeTab: TabType;
  stats: FocusStats;
  interceptedCount: number;
  onSelectTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  stats,
  interceptedCount,
  onSelectTab,
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'tasks':
        return 'Execution List';
      case 'focus':
        return 'Deep Focus';
      case 'notes':
        return 'Local Archive';
      case 'reels':
        return 'Friction Bait Feed';
      default:
        return 'Boring Focus';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
            <Compass className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-zinc-200">
              BORING<span className="text-zinc-500 font-light">FOCUS</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-tight uppercase">
              {getTabLabel()}
            </p>
          </div>
        </div>

        {/* Anti-Dopamine & Focus Metrics */}
        <div className="flex items-center space-x-2">
          {/* Focus Cycles Today */}
          <button
            onClick={() => onSelectTab('focus')}
            title="Focus sessions completed today"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 hover:border-zinc-700 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500/80" />
            <span className="font-mono text-[11px] font-medium">{stats.completedSessionsToday}</span>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">cycles</span>
          </button>

          {/* Intercepted Doom-Scrolls */}
          <button
            onClick={() => onSelectTab('reels')}
            title="Mindless scroll impulses intercepted"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 hover:border-zinc-700 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
            <span className="font-mono text-[11px] font-medium">{interceptedCount}</span>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">bypassed</span>
          </button>
        </div>
      </div>
    </header>
  );
};
