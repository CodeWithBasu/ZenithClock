'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, CloudRain, Calendar, Clock as ClockIcon, Sparkles, BedDouble } from 'lucide-react';

interface ClockSectionProps {
  format12h: boolean;
  setFormat12h: (val: boolean) => void;
}

export default function ClockSection({ format12h, setFormat12h }: ClockSectionProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [clockType, setClockType] = useState<string>('both'); // 'digital', 'analog', 'both'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderTime = time || new Date('2024-01-01T00:00:00');

  const hours = renderTime.getHours();
  const minutes = renderTime.getMinutes();
  const seconds = renderTime.getSeconds();

  // Analog Clock angles
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  // Day progress calculation
  const secondsPassedToday = hours * 3600 + minutes * 60 + seconds;
  const dayProgressPercent = ((secondsPassedToday / 86400) * 100).toFixed(1);

  // Bedtime Calculator (REM 90-min cycles)
  const calculateSleepCycles = () => {
    const now = new Date(renderTime);
    now.setMinutes(now.getMinutes() + 14); // 14 mins average to fall asleep
    const cycles = [3, 4, 5, 6]; // 4.5h, 6h, 7.5h, 9h
    return cycles.map((c) => {
      const wakeTime = new Date(now.getTime() + c * 90 * 60 * 1000);
      return {
        cycles: c,
        hours: (c * 1.5).toFixed(1),
        time: mounted 
          ? wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '--:--', // Avoid hydration mismatch on toLocaleTimeString which is locale dependent
      };
    });
  };

  const sleepTimes = calculateSleepCycles();

  // Formatting Digital Clock
  const displayHours = format12h ? (hours % 12 || 12).toString().padStart(2, '0') : hours.toString().padStart(2, '0');
  const displayMinutes = minutes.toString().padStart(2, '0');
  const displaySeconds = seconds.toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const dateString = mounted
    ? renderTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Loading...';

  const isNight = hours < 6 || hours >= 19;

  return (
    <div className="h-full flex flex-col justify-between space-y-2 animate-fadeIn pb-2">
      {/* Clock Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-black/20 border border-white/5 p-3 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          {isNight ? <Moon className="w-5 h-5 text-zinc-400" /> : <Sun className="w-5 h-5 text-zinc-400" />}
          <span className="text-sm font-semibold text-zinc-300">
            {isNight ? 'Evening Atmosphere' : 'Daylight Mode'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFormat12h(!format12h)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/5 text-white border border-white/5 hover:bg-white/10 transition-all"
          >
            Format: {format12h ? '12-Hour' : '24-Hour'}
          </button>

          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
            {['both', 'digital', 'analog'].map((type) => (
              <button
                key={type}
                onClick={() => setClockType(type)}
                className={`px-3 py-1 rounded-lg text-xs capitalize font-medium transition-all ${
                  clockType === type
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Display Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center min-h-0">
        
        {/* Digital Clock Card */}
        {(clockType === 'digital' || clockType === 'both') && (
          <div
            className={`bg-transparent border border-white/5 rounded-3xl p-4 md:p-6 backdrop-blur-2xl text-center shadow-xl relative overflow-hidden group flex flex-col justify-center ${
              clockType === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-4 text-zinc-400 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-zinc-500" /> Live Local Standard Time
            </div>

            {/* Time Digits */}
            <div className="flex items-baseline justify-center gap-2 sm:gap-4 my-2 md:my-4">
              <span className="text-6xl sm:text-8xl md:text-9xl font-hud tracking-widest">
                {displayHours}:{displayMinutes}
              </span>
              <div className="flex flex-col items-start gap-1">
                <span className="text-2xl sm:text-4xl font-medium text-zinc-400">
                  :{displaySeconds}
                </span>
                {format12h && (
                  <span className="text-base sm:text-xl font-bold text-zinc-500 tracking-wider">
                    {ampm}
                  </span>
                )}
              </div>
            </div>

            {/* Date Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 text-sm font-medium">
              <Calendar className="w-4 h-4 text-zinc-500" />
              {dateString}
            </div>

            {/* Day Progress Bar */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs text-zinc-500 mb-2 font-medium">
                <span>Day Progress</span>
                <span className="text-white font-bold">{dayProgressPercent}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-1000"
                  style={{ width: `${dayProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Analog Clock Card */}
        {(clockType === 'analog' || clockType === 'both') && (
          <div
            className={`bg-transparent border border-white/5 rounded-3xl p-4 md:p-6 backdrop-blur-2xl flex flex-col items-center justify-center shadow-xl relative overflow-hidden h-full ${
              clockType === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'
            }`}
          >
            <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-6 flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-zinc-600" /> Analog Dial
            </h3>

            {/* SVG Analog Clock */}
            <div className="relative w-full aspect-square max-h-[30vh] max-w-[30vh] flex items-center justify-center mx-auto">
              {mounted && (
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Clock Face Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    className="fill-black stroke-white/5"
                    strokeWidth="1"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    className="fill-none stroke-white/5"
                    strokeWidth="1"
                  />

                  {/* Clock Hour Ticks */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = 100 + 76 * Math.cos(angle);
                    const y1 = 100 + 76 * Math.sin(angle);
                    const x2 = 100 + 86 * Math.cos(angle);
                    const y2 = 100 + 86 * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        className="stroke-zinc-600"
                        strokeWidth={i % 3 === 0 ? "2" : "1"}
                      />
                    );
                  })}

                  {/* Hour Hand */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 45 * Math.cos((hourDeg * Math.PI) / 180)}
                    y2={100 + 45 * Math.sin((hourDeg * Math.PI) / 180)}
                    className="stroke-white"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Minute Hand */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 65 * Math.cos((minuteDeg * Math.PI) / 180)}
                    y2={100 + 65 * Math.sin((minuteDeg * Math.PI) / 180)}
                    className="stroke-zinc-400"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Second Hand */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 75 * Math.cos((secondDeg * Math.PI) / 180)}
                    y2={100 + 75 * Math.sin((secondDeg * Math.PI) / 180)}
                    className="stroke-rose-600"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />

                  {/* Center Pin */}
                  <circle cx="100" cy="100" r="3" className="fill-white" />

                </svg>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Smart Sleep & Bedtime Calculator Section */}
      <div className="bg-transparent border border-white/5 rounded-3xl p-4 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <BedDouble className="w-5 h-5 text-zinc-500" />
          <h3 className="text-base font-bold text-white">Smart Bedtime & Sleep Cycle Calculator</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-6">
          If you go to sleep <span className="text-white font-bold">right now</span>, set your alarm for one of these wake-up times to align with 90-minute REM sleep cycles:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sleepTimes.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="text-xs font-semibold text-zinc-500 mb-1">{item.hours} Hours ({item.cycles} cycles)</div>
              <div className="text-xl sm:text-2xl font-bold text-zinc-300 group-hover:text-white transition-colors">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
