'use client';

import { useState, useEffect } from 'react';
import DynamicBackground from '@/components/DynamicBackground';
import Header from '@/components/Header';
import ClockSection from '@/components/ClockSection';
import AlarmSection, { AlarmType } from '@/components/AlarmSection';
import WorldTimeSection from '@/components/WorldTimeSection';
import TimerSection from '@/components/TimerSection';
import StopwatchSection from '@/components/StopwatchSection';
import FocusPomodoro from '@/components/FocusPomodoro';
import SettingsModal from '@/components/SettingsModal';

import {
  Clock,
  AlarmClock,
  Globe,
  Timer,
  TimerReset,
  Flame
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('clock');
  const [theme, setTheme] = useState('cyber');
  const [format12h, setFormat12h] = useState(true);
  const [ambientSound, setAmbientSound] = useState('none');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Alarms State
  const [alarms, setAlarms] = useState<AlarmType[]>([
    {
      id: '1',
      time: '07:30',
      label: 'Morning Rise & Shine',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      enabled: true,
      tone: 'radar',
      challenge: 'math',
    },
    {
      id: '2',
      time: '22:00',
      label: 'Wind Down Bedtime',
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      enabled: false,
      tone: 'chime',
      challenge: 'none',
    },
  ]);

  // Pinned Cities State
  const [pinnedCities, setPinnedCities] = useState<string[]>(['Tokyo', 'New York', 'London', 'Mumbai']);

  // Fetch initial preferences & alarms from API or LocalStorage
  useEffect(() => {
    // LocalStorage load
    const savedAlarms = localStorage.getItem('chronopulse_alarms');
    if (savedAlarms) {
      try {
        setAlarms(JSON.parse(savedAlarms));
      } catch (e) {}
    }

    const savedPinned = localStorage.getItem('chronopulse_pinned');
    if (savedPinned) {
      try {
        setPinnedCities(JSON.parse(savedPinned));
      } catch (e) {}
    }

    const savedTheme = localStorage.getItem('chronopulse_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Attempt MongoDB Sync fetch
    fetch('/api/alarms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setAlarms(data.data.map((a: any) => ({ ...a, id: a._id || a.id })));
        }
      })
      .catch(() => {});
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('chronopulse_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem('chronopulse_pinned', JSON.stringify(pinnedCities));
  }, [pinnedCities]);

  useEffect(() => {
    localStorage.setItem('chronopulse_theme', theme);
  }, [theme]);

  const tabs = [
    { id: 'clock', label: 'Clock', icon: Clock },
    { id: 'alarm', label: 'Alarms', icon: AlarmClock },
    { id: 'world', label: 'World', icon: Globe },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'stopwatch', label: 'Stopwatch', icon: TimerReset },
    { id: 'focus', label: 'Focus', icon: Flame },
  ];

  return (
    <main className="h-screen overflow-hidden text-[#FFE5F1] relative font-sans selection:bg-white selection:text-[#010030] flex flex-col">
      {/* HTML5 Canvas Ambient Particle Background */}
      <DynamicBackground theme={theme} />

      {/* Main Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        ambientSound={ambientSound}
        setAmbientSound={setAmbientSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Content Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-0 md:px-4 py-0 md:py-6 pb-24 md:pb-6 overflow-y-auto md:overflow-hidden flex flex-col custom-scrollbar">
        {activeTab === 'clock' && (
          <ClockSection format12h={format12h} setFormat12h={setFormat12h} />
        )}
        {activeTab === 'alarm' && (
          <AlarmSection alarms={alarms} setAlarms={setAlarms} />
        )}
        {activeTab === 'world' && (
          <WorldTimeSection pinnedCities={pinnedCities} setPinnedCities={setPinnedCities} />
        )}
        {activeTab === 'timer' && <TimerSection />}
        {activeTab === 'stopwatch' && <StopwatchSection />}
        {activeTab === 'focus' && (
          <FocusPomodoro ambientSound={ambientSound} setAmbientSound={setAmbientSound} />
        )}
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-t border-white/5 pb-safe">
        <div className="flex items-center justify-around px-2 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-white/10' : 'bg-transparent'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MongoDB & Audio Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />
    </main>
  );
}
