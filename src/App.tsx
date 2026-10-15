import React, { useState, useEffect } from 'react';
import { TabType, Task, HubSection, HubFileItem, FocusStats } from './types';
import { TaskList } from './components/tasks/TaskList';
import { PomodoroTimer } from './components/focus/PomodoroTimer';
import { LocalFileHub } from './components/hub/LocalFileHub';
import { InfiniteVoidReel } from './components/reels/InfiniteVoidReel';
import {
  CheckSquare,
  Clock,
  FolderGit2,
  Infinity,
} from 'lucide-react';

const DEFAULT_SECTIONS: HubSection[] = [
  { id: 'sec-python', name: 'Python', color: '#38bdf8', icon: '🐍' },
  { id: 'sec-web', name: 'Web Dev & React', color: '#8b5cf6', icon: '⚛️' },
  { id: 'sec-notes', name: 'Cheatsheets & PDFs', color: '#10b981', icon: '📄' },
  { id: 'sec-projects', name: 'Projects & Screenshots', color: '#f59e0b', icon: '🖼️' },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('reels');
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const t = localStorage.getItem('bf_hub_tasks_v4');
      return t ? JSON.parse(t) : [
        { id: 't-1', title: 'Complete Python file organization', completed: false, priority: 'high', category: 'Python' },
        { id: 't-2', title: 'Review PDF documentation without distraction', completed: true, priority: 'medium', category: 'Study' },
      ];
    } catch { return []; }
  });

  const [sections, setSections] = useState<HubSection[]>(() => {
    try {
      const s = localStorage.getItem('bf_hub_sections_v4');
      return s ? JSON.parse(s) : DEFAULT_SECTIONS;
    } catch { return DEFAULT_SECTIONS; }
  });

  const [files, setFiles] = useState<HubFileItem[]>([]);
  const [stats, setStats] = useState<FocusStats>({ cycles: 4, minutes: 100 });
  const [voidSwipeCount, setVoidSwipeCount] = useState<number>(() => {
    try {
      const c = localStorage.getItem('bf_void_swipes_count');
      return c ? parseInt(c, 10) : 0;
    } catch { return 0; }
  });

  useEffect(() => {
    try { localStorage.setItem('bf_hub_sections_v4', JSON.stringify(sections)); } catch {}
  }, [sections]);

  useEffect(() => {
    try { localStorage.setItem('bf_hub_tasks_v4', JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  useEffect(() => {
    try { localStorage.setItem('bf_void_swipes_count', voidSwipeCount.toString()); } catch {}
  }, [voidSwipeCount]);

  return (
    <div className="flex-1 flex flex-col min-h-screen text-slate-200 bg-zinc-950 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-xl border-b border-white/5 px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold tracking-tight text-white">
                  BORING<span className="text-slate-400 font-light">FOCUS</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-widest rounded bg-white/5 text-slate-400 border border-white/10">
                  Candy-Cigarette Edition
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                {activeTab === 'reels' && 'Infinite Void Reel (Tactile Dopamine Extinction)'}
                {activeTab === 'hub' && 'Local Files & Sections Hub (Python, PDFs, PNGs)'}
                {activeTab === 'tasks' && 'Action Queue'}
                {activeTab === 'focus' && 'Pomodoro Flow Block'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs text-slate-300">
              <span className="text-slate-400 font-mono text-[10px]">Swipes:</span>
              <span className="font-mono text-[11px] font-semibold text-white">{voidSwipeCount}</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs text-slate-300">
              <span className="text-slate-400 font-mono text-[10px]">Files:</span>
              <span className="font-mono text-[11px] font-semibold text-sky-400">{files.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 pt-2 pb-24 flex flex-col">
        {activeTab === 'reels' && (
          <InfiniteVoidReel
            voidSwipeCount={voidSwipeCount}
            onIncrementSwipe={() => setVoidSwipeCount((c) => c + 1)}
            onExitToTasks={() => setActiveTab('tasks')}
            onExitToHub={() => setActiveTab('hub')}
          />
        )}

        {activeTab === 'hub' && (
          <LocalFileHub
            sections={sections}
            setSections={setSections}
            files={files}
            setFiles={setFiles}
            onSaveFileToDB={async (item) => {
              setFiles((prev) => [item, ...prev]);
            }}
            onDeleteFileFromDB={async (id) => {
              setFiles((prev) => prev.filter((f) => f.id !== id));
            }}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            onAddTask={(title, priority, category) => {
              setTasks([
                { id: 't-' + Date.now(), title, completed: false, priority, category: category || 'Python' },
                ...tasks,
              ]);
            }}
            onToggleTask={(id) =>
              setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
            }
            onDeleteTask={(id) => setTasks(tasks.filter((t) => t.id !== id))}
            onClearCompleted={() => setTasks(tasks.filter((t) => !t.completed))}
            onStartFocusOnTask={() => setActiveTab('focus')}
          />
        )}

        {activeTab === 'focus' && (
          <PomodoroTimer
            settings={{ workDuration: 25 * 60, shortBreakDuration: 5 * 60, longBreakDuration: 15 * 60, autoStartBreaks: false, soundEnabled: true, ambientSound: 'none' }}
            stats={{ completedSessionsToday: stats.cycles, totalFocusMinutesToday: stats.minutes, lastActiveDate: '', history: {} }}
            activeFocusTask={null}
            onClearFocusTask={() => {}}
            onRecordSession={(mins) =>
              setStats((s) => ({ cycles: s.cycles + 1, minutes: s.minutes + mins }))
            }
            onUpdateSettings={() => {}}
          />
        )}
      </main>

      {/* Floating Luxury Dock */}
      <nav className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] grid grid-cols-4 gap-1">
          {[
            { id: 'reels' as TabType, label: 'Void Reel', icon: Infinity },
            { id: 'hub' as TabType, label: 'Local Hub', icon: FolderGit2, count: files.length },
            { id: 'tasks' as TabType, label: 'Tasks', icon: CheckSquare, count: tasks.filter((t) => !t.completed).length },
            { id: 'focus' as TabType, label: 'Focus', icon: Clock },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-b from-white/10 to-white/5 text-white shadow-inner border border-white/15'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-white' : ''}`} />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-mono rounded-full bg-sky-400 text-zinc-950 font-bold leading-tight">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 font-medium tracking-tight flex items-center gap-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
