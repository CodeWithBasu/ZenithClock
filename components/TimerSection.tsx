'use client';

import { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, Trash2, CheckCircle2, Sparkles, Coffee, Flame, Zap } from 'lucide-react';
import { audioSynth } from '@/lib/audioSynth';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

interface TimerData {
  id: string;
  title: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  category: string;
}

export default function TimerSection() {
  const { toast } = useToast();
  const [timers, setTimers] = useState<TimerData[]>([
    { id: '1', title: 'Pomodoro Focus', totalSeconds: 1500, remainingSeconds: 1500, isRunning: false, category: 'Focus' },
    { id: '2', title: 'Power Nap', totalSeconds: 600, remainingSeconds: 600, isRunning: false, category: 'Rest' },
  ]);

  const [customHours, setCustomHours] = useState(0);
  const [customMins, setCustomMins] = useState(5);
  const [customSecs, setCustomSecs] = useState(0);
  const [customTitle, setCustomTitle] = useState('Custom Countdown');
  const [showAddModal, setShowAddModal] = useState(false);

  // Main countdown ticker loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((t) => {
          if (!t.isRunning) return t;

          if (t.remainingSeconds <= 1) {
            // Timer Finished!
            audioSynth.playCompletionSound();
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            toast({
              title: "Timer Finished",
              description: `${t.title} has completed!`,
            });
            return { ...t, remainingSeconds: 0, isRunning: false };
          }

          return { ...t, remainingSeconds: t.remainingSeconds - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [toast]);

  const toggleTimer = (id: string) => {
    audioSynth.playClick();
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetTimer = (id: string) => {
    audioSynth.playClick();
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false } : t))
    );
  };

  const deleteTimer = (id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddCustomTimer = () => {
    const totalSecs = customHours * 3600 + customMins * 60 + customSecs;
    if (totalSecs <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid time for the custom timer.",
        variant: "destructive"
      });
      return;
    }

    const newT: TimerData = {
      id: Date.now().toString(),
      title: customTitle || 'Timer',
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs,
      isRunning: false,
      category: 'Custom',
    };

    setTimers([newT, ...timers]);
    setShowAddModal(false);
    toast({
      title: "Timer Added",
      description: `Your custom timer for ${newT.title} was added successfully.`
    });
  };

  const addPreset = (title: string, minutes: number, category: string) => {
    const totalSecs = minutes * 60;
    const newT: TimerData = {
      id: Date.now().toString(),
      title,
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs,
      isRunning: false,
      category,
    };
    setTimers([newT, ...timers]);
  };

  const formatSeconds = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const presets = [
    { title: 'Tea & Coffee', mins: 5, category: 'Kitchen', icon: Coffee },
    { title: 'Short Break', mins: 5, category: 'Rest', icon: Zap },
    { title: 'Power Nap', mins: 15, category: 'Rest', icon: Sparkles },
    { title: 'Pomodoro', mins: 25, category: 'Focus', icon: Flame },
    { title: 'Workout', mins: 45, category: 'Fitness', icon: Flame },
  ];

  return (
    <div className="h-auto md:h-full flex flex-col space-y-4 md:space-y-2 animate-fadeIn overflow-hidden pb-2">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-transparent border-b md:border border-white/5 p-4 md:p-6 rounded-none md:rounded-3xl md:backdrop-blur-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto text-center sm:text-left">
          <div className="p-3 rounded-2xl bg-white/5 text-white border border-white/5">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Multi-Timer Suite</h2>
            <p className="text-xs text-zinc-400">Run multiple simultaneous timers with visual SVG progress rings.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> New Timer
        </button>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-2 whitespace-nowrap">
          Presets:
        </span>
        {presets.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.title}
              onClick={() => addPreset(p.title, p.mins, p.category)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-zinc-300 text-xs font-semibold whitespace-nowrap transition-all active:scale-95"
            >
              <Icon className="w-3.5 h-3.5 text-zinc-400" />
              {p.title} ({p.mins}m)
            </button>
          );
        })}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {/* Main Grid: Timer Display + Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {timers.map((t) => {
          const progress = ((t.totalSeconds - t.remainingSeconds) / t.totalSeconds) * 100;
          const isDone = t.remainingSeconds === 0;

          return (
            <div
              key={t.id}
              className={`p-5 md:p-6 rounded-[2rem] border md:backdrop-blur-xl transition-all relative overflow-hidden flex flex-col items-center justify-between text-center ${
                isDone
                  ? 'bg-black border-white shadow-sm animate-pulse'
                  : t.isRunning
                  ? 'bg-zinc-950/80 border-white/10 shadow-sm'
                  : 'bg-black/20 border-white/5'
              }`}
            >
              <div className="w-full flex items-center justify-between text-xs font-semibold text-zinc-500 mb-4">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/5 text-white font-bold uppercase">
                  {t.category}
                </span>
                <button
                  onClick={() => deleteTimer(t.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Animated Circular SVG Progress Ring */}
              <div className="relative w-44 h-44 my-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="fill-none stroke-white/5"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="fill-none stroke-gradient transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray="326.72"
                    strokeDashoffset={326.72 - (326.72 * progress) / 100}
                    strokeLinecap="round"
                    stroke={isDone ? '#ffffff' : t.isRunning ? '#ffffff' : '#3f3f46'}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold font-hud tracking-widest">
                    {formatSeconds(t.remainingSeconds)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 max-w-[120px] truncate">
                    {t.title}
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  onClick={() => toggleTimer(t.id)}
                  className={`flex-1 py-3 md:py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
                    t.isRunning
                      ? 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {t.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {t.isRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={() => resetTimer(t.id)}
                  className="p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Add Custom Timer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-white" /> Create Custom Timer
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Timer Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={customHours}
                    onChange={(e) => setCustomHours(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center text-white font-mono text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customMins}
                    onChange={(e) => setCustomMins(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center text-white font-mono text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customSecs}
                    onChange={(e) => setCustomSecs(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center text-white font-mono text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-zinc-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomTimer}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-sm"
              >
                Create Timer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
