'use client';

import { useState, useEffect } from 'react';
import { Flame, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, Award, Zap } from 'lucide-react';
import { audioSynth } from '@/lib/audioSynth';
import confetti from 'canvas-confetti';

export default function FocusPomodoro({ ambientSound, setAmbientSound }) {
  const [phase, setPhase] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);

  const phaseConfigs = {
    work: { title: 'Deep Work Session', defaultSecs: 1500, color: 'from-amber-500 to-rose-600', icon: Flame },
    shortBreak: { title: 'Short Break', defaultSecs: 300, color: 'from-emerald-500 to-teal-600', icon: Zap },
    longBreak: { title: 'Long Break', defaultSecs: 900, color: 'from-indigo-500 to-blue-600', icon: Sparkles },
  };

  const currentConfig = phaseConfigs[phase];

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, phase]);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    audioSynth.playCompletionSound();
    confetti({ particleCount: 100, spread: 80 });

    if (phase === 'work') {
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      setCompletedSessions((c) => c + 1);

      if (newStreak % 4 === 0) {
        switchPhase('longBreak');
      } else {
        switchPhase('shortBreak');
      }
    } else {
      switchPhase('work');
    }
  };

  const switchPhase = (newPhase) => {
    setPhase(newPhase);
    setTimeLeft(phaseConfigs[newPhase].defaultSecs);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    audioSynth.playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    audioSynth.playClick();
    setIsRunning(false);
    setTimeLeft(currentConfig.defaultSecs);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const quotes = [
    '"Focus on being productive instead of busy." — Tim Ferriss',
    '"It always seems impossible until it is done." — Nelson Mandela',
    '"Action is the foundational key to all success." — Pablo Picasso',
    '"Done is better than perfect." — Sheryl Sandberg',
  ];
  const randomQuote = quotes[completedSessions % quotes.length];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Focus & Pomodoro Studio</h2>
            <p className="text-xs text-slate-400">Maximize focus with structured work/break cycles & ambient soundscapes.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" /> Streak: {streakCount}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <Award className="w-4 h-4 text-emerald-400" /> Completed: {completedSessions}
          </div>
        </div>
      </div>

      {/* Main Focus Card */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl text-center shadow-2xl relative overflow-hidden">
        {/* Phase Selector Chips */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Object.keys(phaseConfigs).map((pKey) => {
            const cfg = phaseConfigs[pKey];
            const isActive = phase === pKey;
            return (
              <button
                key={pKey}
                onClick={() => switchPhase(pKey)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${cfg.color} text-white shadow-lg scale-105`
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cfg.title}
              </button>
            );
          })}
        </div>

        {/* Display Time */}
        <div className="my-6">
          <span className="text-7xl sm:text-9xl font-extrabold font-mono tracking-tight bg-gradient-to-b from-white via-slate-100 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(245,158,11,0.4)]">
            {formatTime(timeLeft)}
          </span>
        </div>

        <p className="text-xs italic text-slate-400 mb-8 max-w-md mx-auto">{randomQuote}</p>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all scale-[1.02] ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/25'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-500/25'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause Focus' : 'Start Focus'}
          </button>

          <button
            onClick={resetTimer}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
