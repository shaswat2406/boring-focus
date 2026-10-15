import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  AlertTriangle,
  Check,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { VisualReelItem, TabType } from '../../types';
import { playTickSound } from '../../utils/audio';

interface BoringReelsProps {
  interceptedCount: number;
  onIncrementIntercepted: () => void;
  onSelectTab: (tab: TabType) => void;
}

const VISUAL_REELS: VisualReelItem[] = [
  {
    id: 'r-1',
    title: 'You Have 4,000 Weeks',
    subtitle: 'The Brutal Reality of Human Time',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    badge: 'Memento Mori',
    accent: 'from-amber-500/20 to-transparent',
    body: 'If you live to 80 years old, you have approximately 4,000 weeks on Earth. The average human spends nearly 1,000 of those weeks staring at a glass rectangle. Notice this moment. How many weeks do you have left?',
    stat: '3.4 hours/day scrolling = 51 entire 24-hour days lost every single year.',
    quote: '“It is not that we have a short time to live, but that we waste a lot of it.” — Seneca',
    delay: 5,
  },
  {
    id: 'r-2',
    title: 'The Digital Trance',
    subtitle: 'You Are Trading Life for Pixels',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80',
    badge: 'Behavioral Intercept',
    accent: 'from-rose-500/20 to-transparent',
    body: 'You opened this feed because your brain craved an effortless hit of neurochemistry. You wanted an escape from an uncomfortable task or micro-anxiety. Notice the rectangle in your hand. Look up. Breathe.',
    stat: '83% of phone unlocks are involuntary autonomic habit loops, not conscious choices.',
    quote: '“If you do not rule your mind, someone else’s algorithm will rule it for you.”',
    delay: 6,
  },
  {
    id: 'r-3',
    title: 'The Silent Arena',
    subtitle: 'Outwork The Distraction',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    badge: 'Discipline',
    accent: 'from-blue-500/20 to-transparent',
    body: 'Right now, while you are seeking another swipe, your peers and competitors are deep in focused work. They are learning, building, and sweating. You don’t need more motivation — you need to close this screen.',
    stat: 'Elite performance requires 4 hours of uninterrupted deep cognitive immersion per day.',
    quote: '“At dawn, when you have trouble getting out of bed, tell yourself: ‘I have work to do as a human being.’” — Marcus Aurelius',
    delay: 5,
  },
  {
    id: 'r-4',
    title: 'The Curing of Concrete',
    subtitle: 'Reaction Velocity: 28 Days to Full Cure',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    badge: 'Deliberate Dryness',
    accent: 'from-slate-500/20 to-transparent',
    body: 'When water reacts with tricalcium silicate in cement, hydration forms crystalline calcium silicate hydrate. It hardens over 28 continuous days. True craft, deep skill, and meaningful careers cure just like concrete — slowly and patiently.',
    stat: 'Compressive strength reaches 70% at day 7, 100% at day 28. Nothing great happens in 15 seconds.',
    quote: 'Nature never hurries, yet everything is accomplished.',
    delay: 6,
  },
  {
    id: 'r-5',
    title: 'Downregulate Your Nervous System',
    subtitle: 'The 4-4-4-4 Box Breathing Gate',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    badge: 'Mindful Gate',
    accent: 'from-emerald-500/20 to-transparent',
    body: 'Inhale for 4 seconds... Hold for 4 seconds... Exhale for 4 seconds... Empty hold for 4 seconds. Your nervous system is over-stimulated by algorithmic flashing feeds. Slow breathing activates your vagal brake.',
    stat: 'A 60-second box breathing cycle drops resting heart rate by 6-9 bpm and halts cortisol spikes.',
    quote: 'Between stimulus and response there is a space. In that space is our power to choose our response.',
    delay: 8,
  },
  {
    id: 'r-6',
    title: 'The Real-Time Grass Growth Monitor',
    subtitle: 'Velocity: 0.000035 mm / Second',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    badge: 'Slow Growth',
    accent: 'from-emerald-600/20 to-transparent',
    body: 'A single blade of Kentucky bluegrass expands at 0.000035 millimeters per second. Steady, peaceful, unbothered by metrics, zero notifications. Watching living grass grow is fundamentally healthier than toxic algorithmic rage-bait.',
    stat: 'Growth rate: ~2.5 mm per 24 hours. The quiet power of unhurried compounding.',
    quote: 'Patience is not the ability to wait, but how you act while waiting.',
    delay: 5,
  },
];

export const BoringReels: React.FC<BoringReelsProps> = ({
  interceptedCount,
  onIncrementIntercepted,
  onSelectTab,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [secondsInReels, setSecondsInReels] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [unlocked, setUnlocked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflectionInput, setReflectionInput] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track 5-minute total reel session limit (300 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsInReels((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cooldown timer per reel
  useEffect(() => {
    setUnlocked(false);
    const reqDelay = VISUAL_REELS[activeIndex]?.delay || 5;
    setCountdown(reqDelay);

    const cd = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setUnlocked(true);
          clearInterval(cd);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(cd);
  }, [activeIndex]);

  const showToast = (msg: string) => {
    setToast(msg);
    playTickSound();
    setTimeout(() => setToast(null), 3000);
  };

  const scrollToReel = (idx: number) => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.snap-card');
      if (cards[idx]) {
        cards[idx].scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAdvance = () => {
    if (!unlocked) {
      showToast(`Friction active: please pause for ${countdown}s.`);
      return;
    }
    playTickSound();
    onIncrementIntercepted();
    const nextIdx = (activeIndex + 1) % VISUAL_REELS.length;
    setActiveIndex(nextIdx);
    scrollToReel(nextIdx);
  };

  const isOverLimit = secondsInReels >= 300;
  const isNearLimit = secondsInReels >= 180 && secondsInReels < 300;

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="relative max-w-md mx-auto w-full h-[calc(100vh-9.5rem)] flex flex-col justify-between">
      {toast && (
        <div className="absolute top-2 left-3 right-3 z-50 p-3 rounded-xl bg-zinc-900 border border-white/20 text-xs text-white text-center shadow-2xl backdrop-blur-xl">
          {toast}
        </div>
      )}

      {/* 5-Minute Reality Lockdown Overlay */}
      {isOverLimit && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4 border border-rose-500/30 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">5-Minute Scroll Limit Reached</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              You promised yourself you would not doom-scroll today. Your dopamine loop has been deliberately interrupted through behavioral friction.
            </p>
          </div>
          <div className="w-full space-y-2 pt-2">
            <button
              onClick={() => onSelectTab('tasks')}
              className="w-full py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-slate-100 flex items-center justify-center gap-2 transition-all shadow"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Return to Action Tasks</span>
            </button>
            <button
              onClick={() => onSelectTab('focus')}
              className="w-full py-3 rounded-xl bg-sky-400 text-zinc-950 font-bold text-xs hover:bg-sky-300 flex items-center justify-center gap-2 transition-all shadow"
            >
              <Clock className="w-4 h-4" />
              <span>Start 25m Deep Work</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Session Progress Bar */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-xs backdrop-blur-md mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isNearLimit ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-slate-400 font-mono text-[11px]">Reel Session:</span>
          <span className="font-mono text-white font-bold text-[11px]">{formatTime(secondsInReels)} / 05:00 max</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
            {interceptedCount} Intercepts
          </span>
        </div>
      </div>

      {/* Full-Height Vertical Snap Scroll Feed */}
      <div
        ref={containerRef}
        className="flex-1 rounded-2xl overflow-hidden border border-white/10 relative snap-container shadow-2xl"
      >
        {VISUAL_REELS.map((reel, rIdx) => (
          <div
            key={reel.id}
            className="snap-card relative h-full w-full flex flex-col justify-between p-5 overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={reel.image}
                alt={reel.title}
                className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1] scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
            </div>

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                {reel.badge}
              </span>
              <span className="text-[11px] font-mono text-slate-300 bg-black/50 px-2 py-0.5 rounded-md">
                {rIdx + 1} / {VISUAL_REELS.length}
              </span>
            </div>

            {/* Subversive Engagement Side-Rail */}
            <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-3">
              <button
                onClick={() => showToast('❤️ Likes are an illusion of external validation. Your finished work is real.')}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors shadow-lg"
                title="Like"
              >
                <Heart className="w-5 h-5" />
              </button>

              <button
                onClick={() => setReflectionOpen(true)}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-slate-300 hover:text-sky-400 transition-colors shadow-lg"
                title="Self Reflection"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`"${reel.title}" - Boring Focus Anti-Dopamine`);
                  showToast('📋 Copied reflection to clipboard.');
                }}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors shadow-lg"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Center Content */}
            <div className="relative z-10 my-auto py-4 space-y-2.5 max-w-[85%]">
              <h2 className="text-xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                {reel.title}
              </h2>
              <p className="text-xs font-mono text-sky-400 tracking-wide">
                {reel.subtitle}
              </p>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md text-slate-200 text-xs leading-relaxed">
                {reel.body}
              </div>

              {reel.stat && (
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-[11px] text-amber-300/95 font-mono">
                  ⚡ {reel.stat}
                </div>
              )}

              {reel.quote && (
                <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
                  {reel.quote}
                </p>
              )}
            </div>

            {/* Emergency Exit */}
            <div className="relative z-10 pt-2 flex items-center gap-2">
              <button
                onClick={() => onSelectTab('tasks')}
                className="flex-1 py-2 px-3 rounded-xl bg-black/70 hover:bg-black/90 border border-white/20 text-xs text-white flex items-center justify-center gap-1.5 backdrop-blur-md transition-all"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Go to Tasks</span>
              </button>
              <button
                onClick={() => onSelectTab('focus')}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Start 25m Focus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Behavioral Friction Controls */}
      <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-white/10 mt-2 space-y-1.5 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{unlocked ? '✓ Friction Cleared' : `Pause ${countdown}s before next reel`}</span>
          <span className="text-[10px] text-slate-500">Scroll with wheel or tap below</span>
        </div>

        {unlocked ? (
          <button
            onClick={handleAdvance}
            className="w-full py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-slate-100 flex items-center justify-center gap-2 transition-all shadow"
          >
            <span>Proceed to Next Visual Reel</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        ) : (
          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-slate-500 font-mono text-xs cursor-not-allowed"
          >
            Mindful Friction Active ({countdown}s)
          </button>
        )}
      </div>

      {/* Reflection Modal */}
      {reflectionOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-white/15 p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Mindful Self-Audit</h3>
              <button onClick={() => setReflectionOpen(false)} className="text-xs text-slate-500 hover:text-white">Close</button>
            </div>
            <p className="text-xs text-slate-400">
              What uncomfortable task, emotional resistance, or fatigue made you reach for the scroll feed?
            </p>
            <textarea
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="e.g., I was feeling stuck on task #2..."
              rows={3}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={() => {
                setReflectionOpen(false);
                showToast('Awareness acknowledged. Return to reality.');
                setReflectionInput('');
              }}
              className="w-full py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-slate-100"
            >
              Acknowledge & Return to Focus
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
