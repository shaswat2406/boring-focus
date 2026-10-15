import React, { useState } from 'react';
import { Plus, Trash2, Check, Clock, Filter, ArrowUpDown } from 'lucide-react';
import { Task, Priority } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, priority: Priority, category?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
  onStartFocusOnTask: (taskTitle: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompleted,
  onStartFocusOnTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<string>('General');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), priority, category.trim() || undefined);
    setNewTitle('');
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .filter((task) => {
      if (!searchQuery.trim()) return true;
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return (
          <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono font-medium rounded bg-rose-950/60 text-rose-300 border border-rose-900/60">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono font-medium rounded bg-amber-950/60 text-amber-300 border border-amber-900/60">
            Med
          </span>
        );
      case 'low':
        return (
          <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono font-medium rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto px-4 pt-4">
      {/* Progress & Overview */}
      <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Execution Progress
          </span>
          <span className="text-xs font-mono text-zinc-300">
            {completedCount} of {totalCount} completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleCreate} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="relative">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What is your singular priority right now?"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px]">Priority:</span>
            <div className="inline-flex rounded-md bg-zinc-950 p-0.5 border border-zinc-800">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2 py-1 text-[11px] font-mono rounded capitalize transition-all ${
                    priority === p
                      ? 'bg-zinc-800 text-zinc-100 font-medium'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Tag (e.g. Work)"
              className="w-24 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-200 text-zinc-950 text-xs font-medium hover:bg-white disabled:opacity-40 disabled:hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="inline-flex rounded-lg bg-zinc-900/80 p-0.5 border border-zinc-800">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs rounded-md capitalize transition-all ${
                filter === tab
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="bg-zinc-900/60 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 w-32 sm:w-44"
          />
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Clear completed tasks"
            >
              Clear Done
            </button>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800/70 rounded-xl">
            <p className="text-sm text-zinc-500">No tasks in this view.</p>
            <p className="text-xs text-zinc-600 mt-1">
              Add your immediate priority above or enjoy clear headspace.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
                task.completed
                  ? 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                  : 'bg-zinc-900/40 border-zinc-800/90 hover:border-zinc-700/80 text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Complete Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                    task.completed
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                {/* Title & Tag */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm truncate select-none ${
                      task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getPriorityBadge(task.priority)}
                    {task.category && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        #{task.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                {!task.completed && (
                  <button
                    onClick={() => onStartFocusOnTask(task.title)}
                    title="Focus on this task in Pomodoro"
                    className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteTask(task.id)}
                  title="Delete task"
                  className="p-1.5 rounded text-zinc-600 hover:text-rose-400 hover:bg-zinc-800/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
