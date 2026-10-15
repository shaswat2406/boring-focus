import { Task, Note, PomodoroSettings, FocusStats } from '../types';

const STORAGE_KEYS = {
  TASKS: 'bf_tasks_v1',
  NOTES: 'bf_notes_v1',
  POMODORO_SETTINGS: 'bf_pomodoro_settings_v1',
  FOCUS_STATS: 'bf_focus_stats_v1',
  INTERCEPTED_REELS: 'bf_intercepted_reels_count_v1',
  FRICTION_LEVEL: 'bf_friction_level_v1',
};

// Default Tasks
const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Review deep focus goals for the morning',
    completed: true,
    priority: 'high',
    category: 'Focus',
    createdAt: Date.now() - 3600000,
    completedAt: Date.now() - 1800000,
  },
  {
    id: 't-2',
    title: 'Write draft of project outline (no distraction mode)',
    completed: false,
    priority: 'high',
    category: 'Work',
    createdAt: Date.now() - 2400000,
  },
  {
    id: 't-3',
    title: 'Hydrate: Drink 500ml water and stretch shoulders',
    completed: false,
    priority: 'medium',
    category: 'Health',
    createdAt: Date.now() - 1200000,
  },
  {
    id: 't-4',
    title: 'Clean desk surface: remove clutter & phone to drawer',
    completed: false,
    priority: 'low',
    category: 'Environment',
    createdAt: Date.now() - 600000,
  },
];

// Default Notes
const DEFAULT_NOTES: Note[] = [
  {
    id: 'n-1',
    title: 'The Antidote to Doom-Scrolling',
    content: `# The Antidote to Doom-Scrolling

> "Distraction wastes both your attention and your life. The cure is not more willpower, but deliberate friction."

### Friction Principles
1. **Notice the craving**: The urge to scroll is usually anxiety, boredom, or cognitive fatigue.
2. **Introduce delay**: A 5-second pause dissolves 80% of impulsive neurochemical triggers.
3. **Choose boredom**: Boredom is the fertile soil where original thinking grows.

---
*Offline note saved directly in your browser's private local storage.*`,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 3600000,
    pinned: true,
  },
  {
    id: 'n-2',
    title: 'Quick Scratchpad & Unsent Thoughts',
    content: `### Scratchpad
- Idea: Replace phone morning check with 10 deep breaths.
- Meeting takeaways: Focus on finishing the core prototype before adding secondary cosmetic bells.
- Book to read: Seneca's *Letters from a Stoic*.`,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1200000,
    pinned: false,
  },
];

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreaks: false,
  soundEnabled: true,
  ambientSound: 'none',
};

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const StorageService = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  },

  getNotes(): Note[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  },

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  },

  getPomodoroSettings(): PomodoroSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POMODORO_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  savePomodoroSettings(settings: PomodoroSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.POMODORO_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save pomodoro settings', e);
    }
  },

  getFocusStats(): FocusStats {
    const today = getTodayKey();
    const defaultStats: FocusStats = {
      completedSessionsToday: 0,
      totalFocusMinutesToday: 0,
      lastActiveDate: today,
      history: { [today]: 0 },
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOCUS_STATS);
      if (!data) return defaultStats;
      const parsed: FocusStats = JSON.parse(data);
      if (parsed.lastActiveDate !== today) {
        parsed.completedSessionsToday = 0;
        parsed.totalFocusMinutesToday = 0;
        parsed.lastActiveDate = today;
      }
      return parsed;
    } catch {
      return defaultStats;
    }
  },

  recordCompletedSession(durationMinutes: number): FocusStats {
    const stats = this.getFocusStats();
    const today = getTodayKey();
    stats.completedSessionsToday += 1;
    stats.totalFocusMinutesToday += durationMinutes;
    stats.lastActiveDate = today;
    stats.history = stats.history || {};
    stats.history[today] = (stats.history[today] || 0) + 1;
    try {
      localStorage.setItem(STORAGE_KEYS.FOCUS_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to record session', e);
    }
    return stats;
  },

  getInterceptedReelsCount(): number {
    try {
      const count = localStorage.getItem(STORAGE_KEYS.INTERCEPTED_REELS);
      return count ? parseInt(count, 10) : 0;
    } catch {
      return 0;
    }
  },

  incrementInterceptedReels(): number {
    try {
      const current = this.getInterceptedReelsCount() + 1;
      localStorage.setItem(STORAGE_KEYS.INTERCEPTED_REELS, current.toString());
      return current;
    } catch {
      return 1;
    }
  },

  getFrictionLevel(): 'mild' | 'moderate' | 'strict' {
    try {
      const lvl = localStorage.getItem(STORAGE_KEYS.FRICTION_LEVEL);
      return (lvl as 'mild' | 'moderate' | 'strict') || 'moderate';
    } catch {
      return 'moderate';
    }
  },

  saveFrictionLevel(level: 'mild' | 'moderate' | 'strict'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FRICTION_LEVEL, level);
    } catch (e) {
      console.error(e);
    }
  },

  // Export all application data as JSON
  exportAllData(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: this.getTasks(),
      notes: this.getNotes(),
      settings: this.getPomodoroSettings(),
      stats: this.getFocusStats(),
      interceptedReels: this.getInterceptedReelsCount(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import application data
  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.tasks)) this.saveTasks(data.tasks);
      if (Array.isArray(data.notes)) this.saveNotes(data.notes);
      if (data.settings) this.savePomodoroSettings(data.settings);
      return { success: true, message: 'Data imported successfully' };
    } catch (err) {
      return { success: false, message: 'Invalid JSON file format' };
    }
  },
};
