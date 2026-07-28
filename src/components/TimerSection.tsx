'use client';

import { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, Trash2, CheckCircle2, Sparkles, Coffee, Flame, Zap } from 'lucide-react';
import { audioSynth } from '@/lib/audioSynth';
import confetti from 'canvas-confetti';

interface TimerData {
  id: string;
  title: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  category: string;
}

export default function TimerSection() {
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
            return { ...t, remainingSeconds: 0, isRunning: false };
          }

          return { ...t, remainingSeconds: t.remainingSeconds - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    if (totalSecs <= 0) return;

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
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Multi-Timer Suite</h2>
            <p className="text-xs text-slate-400">Run multiple simultaneous timers with visual SVG progress rings.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> New Timer
        </button>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 whitespace-nowrap">
          Presets:
        </span>
        {presets.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.title}
              onClick={() => addPreset(p.title, p.mins, p.category)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-slate-300 text-xs font-semibold whitespace-nowrap transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-amber-400" />
              {p.title} ({p.mins}m)
            </button>
          );
        })}
      </div>

      {/* Active Timers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timers.map((t) => {
          const progress = ((t.totalSeconds - t.remainingSeconds) / t.totalSeconds) * 100;
          const isDone = t.remainingSeconds === 0;

          return (
            <div
              key={t.id}
              className={`p-6 rounded-3xl border backdrop-blur-xl transition-all relative overflow-hidden flex flex-col items-center justify-between text-center ${
                isDone
                  ? 'bg-amber-950/40 border-amber-500/50 shadow-2xl shadow-amber-500/20 animate-pulse'
                  : t.isRunning
                  ? 'bg-slate-900/90 border-cyan-500/30 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/50 border-white/10'
              }`}
            >
              <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 mb-4">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-amber-300 font-bold uppercase">
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
                    className="fill-none stroke-white/10"
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
                    stroke={isDone ? '#f59e0b' : t.isRunning ? '#06b6d4' : '#64748b'}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
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
                  className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    t.isRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
                  }`}
                >
                  {t.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {t.isRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={() => resetTimer(t.id)}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Timer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Create Custom Timer
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Timer Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-amber-400 focus:outline-none"
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
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomTimer}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20"
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
