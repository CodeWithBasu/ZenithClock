'use client';

import { useState, useEffect, useRef } from 'react';
import { TimerReset, Play, Pause, RotateCcw, Flag, Download, Award, TrendingUp, Sparkles } from 'lucide-react';
import { audioSynth } from '@/lib/audioSynth';

interface LapData {
  id: number;
  lapMs: number;
  totalMs: number;
  timestamp: string;
}

export default function StopwatchSection() {
  const [timeMs, setTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapData[]>([]);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - timeMs;
      const update = () => {
        setTimeMs(Date.now() - (startTimeRef.current || 0));
        requestRef.current = requestAnimationFrame(update);
      };
      requestRef.current = requestAnimationFrame(update);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, timeMs]);

  const toggleStartPause = () => {
    audioSynth.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    audioSynth.playClick();
    setIsRunning(false);
    setTimeMs(0);
    setLaps([]);
  };

  const handleLap = () => {
    audioSynth.playClick();
    if (!isRunning) return;

    const previousTotal = laps.length > 0 ? laps[0].totalMs : 0;
    const lapDuration = timeMs - previousTotal;

    const newLap: LapData = {
      id: laps.length + 1,
      lapMs: lapDuration,
      totalMs: timeMs,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLaps([newLap, ...laps]);
  };

  const formatMs = (totalMs: number) => {
    const ms = Math.floor((totalMs % 1000) / 10);
    const s = Math.floor((totalMs / 1000) % 60);
    const m = Math.floor((totalMs / (1000 * 60)) % 60);
    const h = Math.floor(totalMs / (1000 * 60 * 60));

    const formattedMs = ms.toString().padStart(2, '0');
    const formattedS = s.toString().padStart(2, '0');
    const formattedM = m.toString().padStart(2, '0');
    const formattedH = h.toString().padStart(2, '0');

    if (h > 0) {
      return { main: `${formattedH}:${formattedM}:${formattedS}`, ms: formattedMs };
    }
    return { main: `${formattedM}:${formattedS}`, ms: formattedMs };
  };

  const formatted = formatMs(timeMs);

  // Lap statistics
  const lapTimes = laps.map((l) => l.lapMs);
  const minLapMs = lapTimes.length > 0 ? Math.min(...lapTimes) : 0;
  const maxLapMs = lapTimes.length > 0 ? Math.max(...lapTimes) : 0;
  const avgLapMs = lapTimes.length > 0 ? Math.round(lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length) : 0;

  // Export CSV function
  const exportCSV = () => {
    if (laps.length === 0) return;
    let csv = 'Lap #,Lap Time (ms),Total Time (ms),Timestamp\n';
    laps.forEach((l) => {
      csv += `${l.id},${l.lapMs},${l.totalMs},${l.timestamp}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chronopulse_Lap_Stats_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <TimerReset className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Precision Stopwatch</h2>
            <p className="text-xs text-slate-400">Millisecond accurate stopwatch with lap analytics & CSV export.</p>
          </div>
        </div>

        {laps.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-all"
          >
            <Download className="w-4 h-4 text-purple-400" /> Export Laps CSV
          </button>
        )}
      </div>

      {/* Main Stopwatch Card */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl text-center shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-4 text-purple-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Millisecond Counter
        </div>

        {/* Display Digits */}
        <div className="flex items-baseline justify-center gap-2 my-6">
          <span className="text-6xl sm:text-8xl md:text-9xl font-extrabold font-mono tracking-tight bg-gradient-to-b from-white via-slate-100 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
            {formatted.main}
          </span>
          <span className="text-2xl sm:text-4xl font-extrabold font-mono text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            .{formatted.ms}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={toggleStartPause}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all scale-[1.02] ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/25'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-purple-500/25'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 text-white font-bold text-base transition-all"
          >
            <Flag className="w-5 h-5 text-purple-400" /> Lap
          </button>

          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lap Stats & Analytics Header */}
      {laps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-emerald-400">Fastest Lap</div>
              <div className="text-xl font-extrabold font-mono text-white">
                {formatMs(minLapMs).main}.{formatMs(minLapMs).ms}
              </div>
            </div>
            <Award className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-rose-400">Slowest Lap</div>
              <div className="text-xl font-extrabold font-mono text-white">
                {formatMs(maxLapMs).main}.{formatMs(maxLapMs).ms}
              </div>
            </div>
            <TrendingUp className="w-6 h-6 text-rose-400" />
          </div>

          <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-indigo-400">Average Lap</div>
              <div className="text-xl font-extrabold font-mono text-white">
                {formatMs(avgLapMs).main}.{formatMs(avgLapMs).ms}
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
      )}

      {/* Lap Table */}
      {laps.length > 0 && (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Flag className="w-4 h-4 text-purple-400" /> Lap History Breakdown
          </h3>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {laps.map((l) => {
              const formattedLap = formatMs(l.lapMs);
              const formattedTotal = formatMs(l.totalMs);

              const isFastest = laps.length > 1 && l.lapMs === minLapMs;
              const isSlowest = laps.length > 1 && l.lapMs === maxLapMs;

              return (
                <div
                  key={l.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-mono transition-all ${
                    isFastest
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : isSlowest
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                      : 'bg-white/5 border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 font-bold">
                    <span>Lap #{l.id}</span>
                    {isFastest && <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans">Fastest</span>}
                    {isSlowest && <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-sans">Slowest</span>}
                  </div>

                  <div className="flex items-center gap-6 font-bold">
                    <div>
                      <span className="text-slate-500 font-sans text-[10px] block">Lap Time</span>
                      <span>+{formattedLap.main}.{formattedLap.ms}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-sans text-[10px] block">Overall Time</span>
                      <span>{formattedTotal.main}.{formattedTotal.ms}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
