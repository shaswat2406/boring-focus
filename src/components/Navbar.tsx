import React from 'react';
import { CheckSquare, Clock, FolderArchive, Clapperboard } from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingTasksCount: number;
  isTimerRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount,
  isTimerRunning,
}) => {
  const navItems = [
    {
      id: 'tasks' as TabType,
      label: 'Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
    },
    {
      id: 'focus' as TabType,
      label: 'Focus',
      icon: Clock,
      pulsingDot: isTimerRunning,
    },
    {
      id: 'notes' as TabType,
      label: 'Notes Box',
      icon: FolderArchive,
    },
    {
      id: 'reels' as TabType,
      label: 'Reels',
      icon: Clapperboard,
      subtext: 'Bait',
      isBait: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800/90 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 px-3 backdrop-blur-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all select-none ${
                isActive
                  ? 'text-zinc-100 bg-zinc-900/80 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                
                {/* Active timer pulsating indicator */}
                {item.pulsingDot && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}

                {/* Pending task badge */}
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-mono rounded bg-zinc-800 text-zinc-300 border border-zinc-700 leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 font-medium tracking-tight flex items-center gap-0.5 ${
                  isActive ? 'text-zinc-100' : 'text-zinc-400'
                }`}
              >
                {item.label}
                {item.isBait && (
                  <span className="text-[9px] px-1 py-0 rounded bg-zinc-800/80 text-zinc-400 font-mono scale-90">
                    Bait
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
