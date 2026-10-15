import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sliders, ArrowRight } from 'lucide-react';
import { playChimeSound } from '../../utils/audio';

interface PomodoroTimerProps {
  onRecordSession?: (mins: number) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onRecordSession }) => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [customInputOpen, setCustomInputOpen] = useState(false);

  const presets = [15, 20, 25, 30, 45, 50, 60, 90];

  const applyNewWorkDuration = (mins: number) => {
    setWorkMinutes(mins);
    if (!isRunning && mode === 'work') {
      setTimeLeft(mins * 60);
    }
  };

  useEffect(() => {
    let timer: number | null = null;
    if (isRunning) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            setIsRunning(false);
            playChimeSound();
            if (mode === 'work') {
              if (onRecordSession) onRecordSession(workMinutes);
              setMode('break');
              setTimeLeft(breakMinutes * 60);
            } else {
              setMode('work');
              setTimeLeft(workMinutes * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, mode, workMinutes, breakMinutes, onRecordSession]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const totalSec = mode === 'work' ? workMinutes * 60 : breakMinutes * 60;
  const progress = totalSec > 0 ? (totalSec - timeLeft) / totalSec : 0;

  return (
    <div className="space-y-6 max-w-lg mx-auto w-full pt-2 text-center">
      {/* Duration Presets Bar */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <span className="text-[11px] font-mono text-slate-400 mr-1">Choose Work Time:</span>
        {presets.map((m) => (
          <button
            key={m}
            onClick={() => applyNewWorkDuration(m)}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
              workMinutes === m
                ? 'bg-white text-zinc-950 font-bold shadow'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {m}m
          </button>
        ))}
        <button
          onClick={() => setCustomInputOpen(!customInputOpen)}
          className="px-2 py-1 text-xs rounded-lg border border-white/15 text-sky-400 hover:text-white"
          title="Custom Duration Input"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Custom Duration Stepper */}
      {customInputOpen && (
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span>Focus (mins):</span>
            <input
              type="number"
              min="1"
              max="180"
              value={workMinutes}
              onChange={(e) =>
                applyNewWorkDuration(Math.max(1, parseInt(e.target.value, 10) || 25))
              }
              className="w-16 bg-black/40 border border-white/20 rounded-lg px-2 py-1 text-center font-bold text-white focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Break (mins):</span>
            <input
              type="number"
              min="1"
              max="60"
              value={breakMinutes}
              onChange={(e) =>
                setBreakMinutes(Math.max(1, parseInt(e.target.value, 10) || 5))
              }
              className="w-16 bg-black/40 border border-white/20 rounded-lg px-2 py-1 text-center font-bold text-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Monospace Countdown */}
      <div className="relative flex flex-col items-center justify-center py-6">
        <div className="font-mono text-7xl font-light tracking-tight text-white select-none">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mt-3">
          {mode === 'work' ? `${workMinutes}m Deep Focus Block` : `${breakMinutes}m Rest Period`}
        </span>
        <div className="w-48 h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-sky-400 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(mode === 'work' ? workMinutes * 60 : breakMinutes * 60);
          }}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white"
        >
          Reset
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-9 py-3.5 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-slate-100 shadow-xl active:scale-95 transition-all"
        >
          {isRunning ? 'Pause Session' : 'Start Flow'}
        </button>
        <button
          onClick={() => {
            if (mode === 'work') {
              setMode('break');
              setTimeLeft(breakMinutes * 60);
            } else {
              setMode('work');
              setTimeLeft(workMinutes * 60);
            }
          }}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white"
        >
          Switch Mode
        </button>
      </div>
    </div>
  );
};
