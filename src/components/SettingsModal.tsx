'use client';

import { useState } from 'react';
import { X, Database, Volume2, Sparkles, Check, Copy } from 'lucide-react';
import { audioSynth } from '@/lib/audioSynth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
  setTheme?: (theme: string) => void;
}

export default function SettingsModal({ isOpen, onClose, theme, setTheme }: SettingsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mongoEnvSample = `MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chronopulse?retryWrites=true&w=majority`;

  const copyEnv = () => {
    navigator.clipboard.writeText(mongoEnvSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testAudio = (tone: string) => {
    audioSynth.playTone(tone, 0.8);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6 animate-scaleIn relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" /> Settings & Cloud Sync
        </h3>

        {/* MongoDB Guide */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> MongoDB Atlas Cloud Sync
            </span>
            <span className="text-[10px] text-slate-400">Fallback: Active LocalStorage</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            To synchronize your alarms, pinned cities, and custom timers across all your devices with MongoDB Atlas, set your <code className="text-cyan-300 font-mono bg-black/40 px-1.5 py-0.5 rounded">MONGODB_URI</code> in <code className="text-cyan-300 font-mono bg-black/40 px-1.5 py-0.5 rounded">.env.local</code>.
          </p>

          <div className="bg-slate-950 border border-white/10 rounded-xl p-3 flex items-center justify-between font-mono text-[11px] text-slate-300 overflow-x-auto">
            <span className="truncate mr-2">{mongoEnvSample}</span>
            <button
              onClick={copyEnv}
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all flex items-center gap-1 text-[10px] font-sans font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Audio Test Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" /> Audio Synthesizer Test
          </h4>

          <div className="grid grid-cols-3 gap-3">
            {['radar', 'chime', 'synthwave'].map((t) => (
              <button
                key={t}
                onClick={() => testAudio(t)}
                className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 text-white text-xs font-bold capitalize transition-all"
              >
                Test {t}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
