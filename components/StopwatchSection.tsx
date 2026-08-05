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
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/50 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/5 text-white border border-white/5">
            <TimerReset className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Precision Stopwatch</h2>
            <p className="text-xs text-zinc-400">Millisecond accurate stopwatch with lap analytics & CSV export.</p>
          </div>
        </div>

        {laps.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all"
          >
            <Download className="w-4 h-4 text-white" /> Export Laps CSV
          </button>
        )}
      </div>

      {/* Main Stopwatch Card */}
      <div className="bg-zinc-950/50 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl text-center shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Millisecond Counter
        </div>

        {/* Display Digits */}
        <div className="flex items-baseline justify-center gap-2 my-6">
          <span className="text-6xl sm:text-8xl md:text-9xl font-extrabold font-mono tracking-tight text-white">
            {formatted.main}
          </span>
          <span className="text-2xl sm:text-4xl font-extrabold font-mono text-zinc-500">
            .{formatted.ms}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={toggleStartPause}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-base shadow-sm transition-all scale-[1.02] ${
              isRunning
                ? 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-40 text-white font-bold text-base transition-all"
          >
            <Flag className="w-5 h-5 text-white" /> Lap
          </button>

          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lap Stats & Analytics Header */}
      {laps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-white">Fastest Lap</div>
              <div className="text-xl font-extrabold font-mono text-white">
                {formatMs(minLapMs).main}.{formatMs(minLapMs).ms}
              </div>
            </div>
            <Award className="w-6 h-6 text-white" />
          </div>

          <div className="bg-black/20 border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-zinc-500">Slowest Lap</div>
              <div className="text-xl font-extrabold font-mono text-white">
                {formatMs(maxLapMs).main}.{formatMs(maxLapMs).ms}
              </div>
            </div>
            <TrendingUp className="w-6 h-6 text-zinc-500" />
          </div>

          <div className="bg-black/20 border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-zinc-400">Average Lap</div>
              <div className="text-xl font-extrabold font-mono text-white">
                {formatMs(avgLapMs).main}.{formatMs(avgLapMs).ms}
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-zinc-400" />
          </div>
        </div>
      )}

      {/* Lap Table */}
      {laps.length > 0 && (
        <div className="bg-zinc-950/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Flag className="w-4 h-4 text-white" /> Lap History Breakdown
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
                      ? 'bg-white/10 border-white/20 text-white'
                      : isSlowest
                      ? 'bg-black/20 border-white/5 text-zinc-500'
                      : 'bg-white/5 border-white/5 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3 font-bold">
                    <span>Lap #{l.id}</span>
                    {isFastest && <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 text-white font-sans">Fastest</span>}
                    {isSlowest && <span className="text-[10px] px-2 py-0.5 rounded bg-black text-zinc-500 border border-white/10 font-sans">Slowest</span>}
                  </div>

                  <div className="flex items-center gap-6 font-bold">
                    <div>
                      <span className="text-zinc-500 font-sans text-[10px] block">Lap Time</span>
                      <span>+{formattedLap.main}.{formattedLap.ms}</span>
                    </div>

                    <div>
                      <span className="text-zinc-500 font-sans text-[10px] block">Overall Time</span>
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
