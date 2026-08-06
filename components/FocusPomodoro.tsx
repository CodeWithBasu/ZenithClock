'use client';

import { useState, useEffect } from 'react';
import { Flame, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, Award, Zap } from 'lucide-react';
import { audioSynth } from '@/lib/audioSynth';
import confetti from 'canvas-confetti';

interface FocusPomodoroProps {
  ambientSound: string;
  setAmbientSound: (sound: string) => void;
}

type PhaseType = 'work' | 'shortBreak' | 'longBreak';

export default function FocusPomodoro({ ambientSound, setAmbientSound }: FocusPomodoroProps) {
  const [phase, setPhase] = useState<PhaseType>('work'); // 'work', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);

  const phaseConfigs = {
    work: { title: 'Deep Work Session', defaultSecs: 1500, icon: Flame },
    shortBreak: { title: 'Short Break', defaultSecs: 300, icon: Zap },
    longBreak: { title: 'Long Break', defaultSecs: 900, icon: Sparkles },
  };

  const currentConfig = phaseConfigs[phase];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
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
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
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

  const switchPhase = (newPhase: PhaseType) => {
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

  const formatTime = (secs: number) => {
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-transparent border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/5 text-white border border-white/5">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Focus & Pomodoro Studio</h2>
            <p className="text-xs text-zinc-400">Maximize focus with structured work/break cycles & ambient soundscapes.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-zinc-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-zinc-300">
            <Flame className="w-4 h-4 text-white" /> Streak: {streakCount}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-zinc-300">
            <Award className="w-4 h-4 text-white" /> Completed: {completedSessions}
          </div>
        </div>
      </div>

      {/* Main Focus Card */}
      <div className="bg-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-2xl text-center shadow-sm relative overflow-hidden">
        {/* Phase Selector Chips */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(Object.keys(phaseConfigs) as PhaseType[]).map((pKey) => {
            const cfg = phaseConfigs[pKey];
            const isActive = phase === pKey;
            return (
              <button
                key={pKey}
                onClick={() => switchPhase(pKey)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? `bg-white text-black shadow-sm scale-105`
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {cfg.title}
              </button>
            );
          })}
        </div>

        {/* Display Time */}
        <div className="my-6">
          <span className="text-7xl sm:text-9xl font-extrabold font-hud tracking-widest">
            {formatTime(timeLeft)}
          </span>
        </div>

        <p className="text-xs italic text-zinc-400 mb-8 max-w-md mx-auto">{randomQuote}</p>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-base shadow-sm transition-all scale-[1.02] ${
              isRunning
                ? 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause Focus' : 'Start Focus'}
          </button>

          <button
            onClick={resetTimer}
            className="p-4 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
