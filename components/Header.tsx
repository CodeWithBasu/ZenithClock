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
import { useIsMobile } from '@/hooks/use-mobile';
import { audioSynth } from '@/lib/audioSynth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  ambientSound: string;
  setAmbientSound: (sound: string) => void;
  onOpenSettings: () => void;
}

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

export default function Header({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  ambientSound,
  setAmbientSound,
  onOpenSettings
}: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const isMobile = useIsMobile();

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
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-black/40 border-b border-white/5 px-4 py-3 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4 w-full">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-white/10 border border-white/5 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-widest text-white transition-all">
              {isMobile ? 'CHRONO' : 'CHRONOPULSE'}
            </h1>
            <p className="text-[9px] uppercase font-semibold tracking-[0.2em] text-zinc-500">
              Smart Suite
            </p>
          </div>
        </div>

        {/* Tab Navigation (Desktop Only) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto max-w-full">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Controls Header */}
        <div className="flex items-center gap-2">
          
          {/* Animated Theme Toggler */}
          <div className="hidden sm:block">
            <AnimatedThemeToggler className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all" />
          </div>

          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSettings}
            title="Database & Preferences Settings"
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
