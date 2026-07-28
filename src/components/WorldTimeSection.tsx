'use client';

import { useState, useEffect } from 'react';
import { Globe, Search, Pin, PinOff, Sun, Moon, Sliders, MapPin } from 'lucide-react';
import { WORLD_CITIES, getCityTime, CityTime } from '@/lib/timezones';

interface WorldTimeSectionProps {
  pinnedCities: string[];
  setPinnedCities: (cities: string[]) => void;
}

export default function WorldTimeSection({ pinnedCities, setPinnedCities }: WorldTimeSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [converterHour, setConverterHour] = useState(new Date().getHours());
  const [showConverter, setShowConverter] = useState(false);
  const [times, setTimes] = useState<Record<string, CityTime>>({});

  useEffect(() => {
    const updateTimes = () => {
      const updated: Record<string, CityTime> = {};
      WORLD_CITIES.forEach((cityObj) => {
        updated[cityObj.city] = getCityTime(cityObj.timezone);
      });
      setTimes(updated);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const togglePin = (cityName: string) => {
    if (pinnedCities.includes(cityName)) {
      setPinnedCities(pinnedCities.filter((c) => c !== cityName));
    } else {
      setPinnedCities([...pinnedCities, cityName]);
    }
  };

  const regions = ['All', 'Asia-Pacific', 'Americas', 'Europe', 'Middle East', 'Africa'];

  const filteredCities = WORLD_CITIES.filter((c) => {
    const matchesSearch =
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Global World Time</h2>
            <p className="text-xs text-slate-400">Explore real-time timezones, day/night cycles, and timezone converters worldwide.</p>
          </div>
        </div>

        <button
          onClick={() => setShowConverter(!showConverter)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition-all ${
            showConverter
              ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/25'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Sliders className="w-4 h-4" />
          {showConverter ? 'Hide Time Converter' : 'Interactive Time Converter'}
        </button>
      </div>

      {/* Interactive Timezone Converter Slider */}
      {showConverter && (
        <div className="bg-slate-900/80 border border-indigo-500/30 p-6 rounded-3xl backdrop-blur-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Preview Hour Across Timezones
            </span>
            <span className="text-indigo-400 font-mono text-base">{converterHour}:00</span>
          </div>

          <input
            type="range"
            min="0"
            max="23"
            value={converterHour}
            onChange={(e) => setConverterHour(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {WORLD_CITIES.slice(0, 8).map((cityObj) => {
              const cityTime = times[cityObj.city];
              const offsetNum = parseInt(cityTime?.offset || '0', 10);
              const previewHour = (converterHour + offsetNum + 24) % 24;
              const isNightPreview = previewHour < 6 || previewHour >= 18;

              return (
                <div
                  key={cityObj.city}
                  className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{cityObj.flag}</span> {cityObj.city}
                    </div>
                    <div className="text-[10px] text-slate-400">UTC {cityTime?.offset}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-indigo-300">
                      {previewHour.toString().padStart(2, '0')}:00
                    </div>
                    <div className="text-[10px]">
                      {isNightPreview ? '🌙 Night' : '☀️ Day'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* World Map Visualizer Graphic */}
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden text-center">
        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" /> Interactive Day / Night Globe Visualizer
        </div>

        {/* Minimal Stylized Map Projection */}
        <div className="w-full h-44 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
          {/* Day/Night terminator gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-indigo-500/10 opacity-70 pointer-events-none" />

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-4 relative z-10 w-full">
            {WORLD_CITIES.map((cityObj) => {
              const cityTime = times[cityObj.city];
              const isPinned = pinnedCities.includes(cityObj.city);
              return (
                <div
                  key={cityObj.city}
                  title={`${cityObj.city}, ${cityObj.country} (${cityTime?.formatted})`}
                  onClick={() => togglePin(cityObj.city)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${
                    isPinned
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                      : cityTime?.isNight
                      ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300'
                      : 'bg-amber-950/30 border-amber-500/20 text-amber-300'
                  }`}
                >
                  <div className="text-base">{cityObj.flag}</div>
                  <div className="text-[10px] font-bold truncate">{cityObj.city}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Region Chips */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRegion === reg
                  ? 'bg-white/20 text-white border border-white/20'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((cityObj) => {
          const cityTime = times[cityObj.city];
          const isPinned = pinnedCities.includes(cityObj.city);

          return (
            <div
              key={cityObj.city}
              className={`p-5 rounded-3xl border backdrop-blur-xl transition-all relative overflow-hidden group ${
                isPinned
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{cityObj.flag}</span>
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      {cityObj.city}
                    </h3>
                    <p className="text-xs text-slate-400">{cityObj.country}</p>
                  </div>
                </div>

                <button
                  onClick={() => togglePin(cityObj.city)}
                  className={`p-2 rounded-xl border transition-all ${
                    isPinned
                      ? 'bg-cyan-500 text-white border-cyan-400'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {isPinned ? <Pin className="w-3.5 h-3.5 fill-white" /> : <PinOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
                <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {cityTime?.formatted || '--:--:--'}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {cityTime?.isNight ? (
                    <span className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                      <Moon className="w-3 h-3" /> Night
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      <Sun className="w-3 h-3" /> Day
                    </span>
                  )}
                  <span className="text-slate-400">UTC {cityTime?.offset}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
