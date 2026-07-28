'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  AlarmClock,
  Globe,
  Timer,
  TimerReset,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  Flame
} from 'lucide-react';
import { audioSynth } from '@/lib/audioSynth';

export default function Header({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  ambientSound,
  setAmbientSound,
  onOpenSettings
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const tabs = [
    { id: 'clock', label: 'Clock', icon: Clock },
    { id: 'alarm', label: 'Alarms', icon: AlarmClock },
    { id: 'world', label: 'World Time', icon: Globe },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'stopwatch', label: 'Stopwatch', icon: TimerReset },
    { id: 'focus', label: 'Focus Mode', icon: Flame },
  ];

  const themes = [
    { id: 'cyber', label: 'Cyber Neon', color: 'from-cyan-500 to-blue-600' },
    { id: 'aurora', label: 'Aurora Emerald', color: 'from-emerald-400 to-teal-600' },
    { id: 'obsidian', label: 'Obsidian Purple', color: 'from-purple-500 to-indigo-600' },
    { id: 'sunburst', label: 'Sunburst Gold', color: 'from-amber-400 to-orange-600' },
    { id: 'minimal', label: 'Midnight Slate', color: 'from-slate-400 to-slate-600' },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const toggleAmbientSound = () => {
    if (isAudioPlaying) {
      audioSynth.stopAmbient();
      setIsAudioPlaying(false);
      setAmbientSound('none');
    } else {
      const soundType = ambientSound === 'none' ? 'rain' : ambientSound;
      audioSynth.startAmbient(soundType, 0.4);
      setIsAudioPlaying(true);
      setAmbientSound(soundType);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/60 border-b border-white/10 px-4 py-3 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              ChronoPulse
            </h1>
            <p className="text-[10px] uppercase font-semibold tracking-widest text-cyan-400/80">
              Next-Gen Smart Suite
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioSynth.playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Controls Header */}
        <div className="flex items-center gap-2">
          
          {/* Theme Selector */}
          <div className="relative group">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-white text-xs font-semibold rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-cyan-400 cursor-pointer hover:bg-white/10 transition-all"
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.label}
                </option>
              ))}
            </select>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleAmbientSound}
            title={isAudioPlaying ? 'Mute Ambient Soundscape' : 'Play Ambient Soundscape'}
            className={`p-2.5 rounded-xl border border-white/10 transition-all ${
              isAudioPlaying
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/20 animate-pulse'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSettings}
            title="Database & Preferences Settings"
            className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
