'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, CloudRain, Calendar, Clock as ClockIcon, Sparkles, BedDouble } from 'lucide-react';

interface ClockSectionProps {
  format12h: boolean;
  setFormat12h: (val: boolean) => void;
}

export default function ClockSection({ format12h, setFormat12h }: ClockSectionProps) {
  const [time, setTime] = useState(new Date());
  const [clockType, setClockType] = useState<string>('both'); // 'digital', 'analog', 'both'

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Analog Clock angles
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  // Day progress calculation
  const secondsPassedToday = hours * 3600 + minutes * 60 + seconds;
  const dayProgressPercent = ((secondsPassedToday / 86400) * 100).toFixed(1);

  // Bedtime Calculator (REM 90-min cycles)
  const calculateSleepCycles = () => {
    const now = new Date(time);
    now.setMinutes(now.getMinutes() + 14); // 14 mins average to fall asleep
    const cycles = [3, 4, 5, 6]; // 4.5h, 6h, 7.5h, 9h
    return cycles.map((c) => {
      const wakeTime = new Date(now.getTime() + c * 90 * 60 * 1000);
      return {
        cycles: c,
        hours: (c * 1.5).toFixed(1),
        time: wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    });
  };

  const sleepTimes = calculateSleepCycles();

  // Formatting Digital Clock
  const displayHours = format12h ? (hours % 12 || 12).toString().padStart(2, '0') : hours.toString().padStart(2, '0');
  const displayMinutes = minutes.toString().padStart(2, '0');
  const displaySeconds = seconds.toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isNight = hours < 6 || hours >= 19;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Clock Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          {isNight ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
          <span className="text-sm font-semibold text-slate-200">
            {isNight ? 'Evening Atmosphere' : 'Daylight Mode'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFormat12h(!format12h)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
          >
            Format: {format12h ? '12-Hour' : '24-Hour'}
          </button>

          <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
            {['both', 'digital', 'analog'].map((type) => (
              <button
                key={type}
                onClick={() => setClockType(type)}
                className={`px-3 py-1 rounded-lg text-xs capitalize font-medium transition-all ${
                  clockType === type
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Digital Clock Card */}
        {(clockType === 'digital' || clockType === 'both') && (
          <div
            className={`bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl text-center shadow-2xl relative overflow-hidden group ${
              clockType === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'
            }`}
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/30 transition-all duration-700" />
            
            <div className="flex items-center justify-center gap-2 mb-4 text-cyan-400 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4" /> Live Local Standard Time
            </div>

            {/* Glowing Time Digits */}
            <div className="flex items-baseline justify-center gap-2 sm:gap-4 my-6">
              <span className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                {displayHours}:{displayMinutes}
              </span>
              <div className="flex flex-col items-start gap-1">
                <span className="text-2xl sm:text-4xl font-semibold text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  :{displaySeconds}
                </span>
                {format12h && (
                  <span className="text-base sm:text-xl font-black text-amber-400 tracking-wider">
                    {ampm}
                  </span>
                )}
              </div>
            </div>

            {/* Date Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium">
              <Calendar className="w-4 h-4 text-cyan-400" />
              {dateString}
            </div>

            {/* Day Progress Bar */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                <span>Day Progress</span>
                <span className="text-cyan-400 font-bold">{dayProgressPercent}%</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${dayProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Analog Clock Card */}
        {(clockType === 'analog' || clockType === 'both') && (
          <div
            className={`bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden ${
              clockType === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'
            }`}
          >
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-purple-400" /> Analog Dial
            </h3>

            {/* SVG Analog Clock */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Clock Face Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  className="fill-slate-950/80 stroke-white/10"
                  strokeWidth="3"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  className="fill-none stroke-cyan-500/20"
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
                      className="stroke-cyan-400/70"
                      strokeWidth={i % 3 === 0 ? "3" : "1.5"}
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
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Minute Hand */}
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 65 * Math.cos((minuteDeg * Math.PI) / 180)}
                  y2={100 + 65 * Math.sin((minuteDeg * Math.PI) / 180)}
                  className="stroke-cyan-400"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Second Hand */}
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 75 * Math.cos((secondDeg * Math.PI) / 180)}
                  y2={100 + 75 * Math.sin((secondDeg * Math.PI) / 180)}
                  className="stroke-rose-500"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Center Pin */}
                <circle cx="100" cy="100" r="5" className="fill-rose-500 stroke-white" strokeWidth="2" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Smart Sleep & Bedtime Calculator Section */}
      <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <BedDouble className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Smart Bedtime & Sleep Cycle Calculator</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          If you go to sleep <span className="text-cyan-400 font-bold">right now</span>, set your alarm for one of these wake-up times to align with 90-minute REM sleep cycles:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sleepTimes.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:border-indigo-400/50 hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="text-xs font-semibold text-slate-400 mb-1">{item.hours} Hours ({item.cycles} cycles)</div>
              <div className="text-xl sm:text-2xl font-black text-indigo-300 group-hover:text-cyan-300 transition-colors">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
