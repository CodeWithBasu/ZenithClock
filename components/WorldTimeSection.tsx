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
  const [converterHour, setConverterHour] = useState(12);
  const [showConverter, setShowConverter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [times, setTimes] = useState<Record<string, CityTime>>({});

  useEffect(() => {
    setMounted(true);
    setConverterHour(new Date().getHours());
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950/50 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/5 text-white border border-white/5">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Global World Time</h2>
            <p className="text-xs text-zinc-400">Explore real-time timezones, day/night cycles, and timezone converters worldwide.</p>
          </div>
        </div>

        <button
          onClick={() => setShowConverter(!showConverter)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition-all ${
            showConverter
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          {showConverter ? 'Hide Time Converter' : 'Interactive Time Converter'}
        </button>
      </div>

      {/* Interactive Timezone Converter Slider */}
      {showConverter && (
        <div className="bg-black/20 border border-white/5 p-6 rounded-3xl backdrop-blur-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
            <span className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-white" /> Preview Hour Across Timezones
            </span>
            <span className="text-white font-mono text-base">{converterHour}:00</span>
          </div>

          <input
            type="range"
            min="0"
            max="23"
            value={converterHour}
            onChange={(e) => setConverterHour(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
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
                  className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{cityObj.flag}</span> {cityObj.city}
                    </div>
                    <div className="text-[10px] text-zinc-500">UTC {cityTime?.offset}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-zinc-300">
                      {previewHour.toString().padStart(2, '0')}:00
                    </div>
                    <div className="text-[10px] text-zinc-400">
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
      <div className="bg-zinc-950/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden text-center">
        <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-white" /> Interactive Day / Night Globe Visualizer
        </div>

        {/* Minimal Stylized Map Projection */}
        <div className="w-full h-44 bg-black rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
          {/* Day/Night terminator gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-white/5 to-black/20 opacity-70 pointer-events-none" />

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
                      ? 'bg-white border-white text-black shadow-sm'
                      : cityTime?.isNight
                      ? 'bg-zinc-900 border-white/5 text-zinc-500'
                      : 'bg-white/5 border-white/10 text-zinc-300'
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
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
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
                  ? 'bg-white text-black border border-white'
                  : 'bg-white/5 border border-white/5 text-zinc-500 hover:text-white hover:bg-white/10'
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
                  ? 'bg-zinc-950/80 border-white/10 shadow-sm'
                  : 'bg-black/20 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{cityObj.flag}</span>
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-zinc-300 transition-colors">
                      {cityObj.city}
                    </h3>
                    <p className="text-xs text-zinc-500">{cityObj.country}</p>
                  </div>
                </div>

                <button
                  onClick={() => togglePin(cityObj.city)}
                  className={`p-2 rounded-xl border transition-all ${
                    isPinned
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white'
                  }`}
                >
                  {isPinned ? <Pin className="w-3.5 h-3.5 fill-black" /> : <PinOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {cityTime?.formatted || '--:--:--'}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {cityTime?.isNight ? (
                    <span className="flex items-center gap-1 text-zinc-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                      <Moon className="w-3 h-3" /> Night
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-zinc-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                      <Sun className="w-3 h-3" /> Day
                    </span>
                  )}
                  <span className="text-zinc-500">UTC {cityTime?.offset}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
