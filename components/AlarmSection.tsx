'use client';

import { useState, useEffect } from 'react';
import { AlarmClock, Plus, Trash2, Bell, BellOff, Volume2, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { audioSynth } from '@/lib/audioSynth';

export interface AlarmType {
  id: string;
  time: string;
  label: string;
  days: string[];
  enabled: boolean;
  tone: string;
  challenge: string;
}

interface MathProblem {
  n1: number;
  n2: number;
  answer: number;
}

interface AlarmSectionProps {
  alarms: AlarmType[];
  setAlarms: (alarms: AlarmType[]) => void;
}

export default function AlarmSection({ alarms, setAlarms }: AlarmSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeInput, setTimeInput] = useState('07:00');
  const [labelInput, setLabelInput] = useState('Morning Wakeup');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [toneInput, setToneInput] = useState('radar');
  const [challengeInput, setChallengeInput] = useState('none');

  // Active Alarm Trigger state
  const [ringingAlarm, setRingingAlarm] = useState<AlarmType | null>(null);
  const [mathProblem, setMathProblem] = useState<MathProblem | null>(null);
  const [mathAnswerInput, setMathAnswerInput] = useState('');
  const [mathError, setMathError] = useState(false);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHHMM = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = daysOfWeek[now.getDay()];

      alarms.forEach((alarm) => {
        if (
          alarm.enabled &&
          alarm.time === currentHHMM &&
          now.getSeconds() === 0 &&
          alarm.days.includes(currentDay)
        ) {
          triggerAlarm(alarm);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  const triggerAlarm = (alarm: AlarmType) => {
    setRingingAlarm(alarm);
    audioSynth.playTone(alarm.tone, 0.9);

    if (alarm.challenge === 'math') {
      generateMathProblem();
    }
  };

  const generateMathProblem = () => {
    const n1 = Math.floor(Math.random() * 40) + 10;
    const n2 = Math.floor(Math.random() * 30) + 5;
    setMathProblem({ n1, n2, answer: n1 + n2 });
    setMathAnswerInput('');
    setMathError(false);
  };

  const handleAddAlarm = () => {
    const newAlarm: AlarmType = {
      id: Date.now().toString(),
      time: timeInput,
      label: labelInput || 'Alarm',
      days: selectedDays,
      enabled: true,
      tone: toneInput,
      challenge: challengeInput,
    };

    setAlarms([...alarms, newAlarm]);
    setShowAddModal(false);

    // Save to API if available
    fetch('/api/alarms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlarm),
    }).catch(() => {});
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
    setAlarms(updated);

    const target = updated.find((a) => a.id === id);
    if (target) {
      fetch('/api/alarms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: target.enabled }),
      }).catch(() => {});
    }
  };

  const deleteAlarm = (id: string) => {
    const updated = alarms.filter((a) => a.id !== id);
    setAlarms(updated);

    fetch(`/api/alarms?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleDismissAlarm = () => {
    if (ringingAlarm?.challenge === 'math' && mathProblem) {
      if (parseInt(mathAnswerInput, 10) !== mathProblem.answer) {
        setMathError(true);
        audioSynth.playTone('radar', 0.5);
        return;
      }
    }
    setRingingAlarm(null);
    setMathProblem(null);
  };

  return (
    <div className="h-auto md:h-full flex flex-col space-y-4 md:space-y-2 animate-fadeIn overflow-hidden pb-2">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-transparent border border-white/5 p-4 rounded-3xl backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/5 text-white border border-white/5">
            <AlarmClock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Smart Alarms</h2>
            <p className="text-xs text-zinc-400">Set recurring alarms with customizable sound tones and wake-up challenges.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Alarm
        </button>
      </div>

      {/* Alarms List */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 content-start pr-2 custom-scrollbar">
        {alarms.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <BellOff className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No alarms configured yet.</p>
            <p className="text-xs text-slate-500">Click "Add Alarm" above to create your first alarm!</p>
          </div>
        ) : (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`p-6 rounded-3xl border transition-all backdrop-blur-xl flex items-center justify-between gap-4 ${
                alarm.enabled
                  ? 'bg-zinc-950/80 border-white/10 shadow-sm'
                  : 'bg-black/20 border-white/5 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {alarm.time}
                  </span>
                  <span className="text-xs uppercase font-bold text-white px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                    {alarm.tone}
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-400">{alarm.label}</div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                  {daysOfWeek.map((d) => (
                    <span
                      key={d}
                      className={alarm.days.includes(d) ? 'text-white font-bold' : 'text-zinc-600'}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Toggle Switch */}
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    alarm.enabled ? 'bg-white' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      alarm.enabled ? 'translate-x-6 bg-black' : 'translate-x-0 bg-zinc-500'
                    }`}
                  />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Alarm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 animate-scaleIn">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-white" /> Create New Alarm
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Time</label>
                <input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-xl focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Label</label>
                <input
                  type="text"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-white focus:outline-none"
                  placeholder="e.g. Workout, Study, Meeting"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">Repeat Days</label>
                <div className="flex gap-1">
                  {daysOfWeek.map((d) => {
                    const isSel = selectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() =>
                          setSelectedDays(
                            isSel ? selectedDays.filter((x) => x !== d) : [...selectedDays, d]
                          )
                        }
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSel ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Alarm Tone</label>
                  <select
                    value={toneInput}
                    onChange={(e) => setToneInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="radar">Radar Pulse</option>
                    <option value="chime">Gentle Chime</option>
                    <option value="synthwave">Retro Synthwave</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Wake Challenge</label>
                  <select
                    value={challengeInput}
                    onChange={(e) => setChallengeInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="none">None (Standard)</option>
                    <option value="math">Math Puzzle</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAlarm}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-sm"
              >
                Save Alarm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ringing Alarm & Math Challenge Modal */}
      {ringingAlarm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-transparent backdrop-blur-3xl border-2 border-rose-500/50 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-bounceSlow">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Bell className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-1">{ringingAlarm.time}</h2>
            <p className="text-sm font-semibold text-rose-300 mb-6">{ringingAlarm.label}</p>

            {ringingAlarm.challenge === 'math' && mathProblem ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-bold uppercase mb-2">
                  <ShieldAlert className="w-4 h-4" /> Solve Math Challenge to Turn Off!
                </div>
                <div className="text-2xl font-mono font-bold text-white mb-3">
                  {mathProblem.n1} + {mathProblem.n2} = ?
                </div>
                <input
                  type="number"
                  value={mathAnswerInput}
                  onChange={(e) => setMathAnswerInput(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-center text-xl font-bold text-white focus:outline-none focus:border-rose-400"
                  placeholder="Enter Answer"
                />
                {mathError && (
                  <p className="text-xs font-bold text-rose-400 mt-2">Incorrect answer! Try again.</p>
                )}
              </div>
            ) : null}

            <button
              onClick={handleDismissAlarm}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-extrabold text-base shadow-xl shadow-rose-500/30 transition-all scale-[1.02]"
            >
              Dismiss Alarm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
