// Comprehensive list of major world cities with IANA timezones, coordinates, and region codes
export const WORLD_CITIES = [
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', lat: 35.6762, lng: 139.6503, region: 'Asia-Pacific' },
  { city: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸', lat: 40.7128, lng: -74.0060, region: 'Americas' },
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', lat: 51.5074, lng: -0.1278, region: 'Europe' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', lat: 48.8566, lng: 2.3522, region: 'Europe' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺', lat: -33.8688, lng: 151.2093, region: 'Asia-Pacific' },
  { city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪', lat: 25.2048, lng: 55.2708, region: 'Middle East' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', lat: 1.3521, lng: 103.8198, region: 'Asia-Pacific' },
  { city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰', lat: 22.3193, lng: 114.1694, region: 'Asia-Pacific' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', lat: 19.0760, lng: 72.8777, region: 'Asia-Pacific' },
  { city: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', lat: 28.6139, lng: 77.2090, region: 'Asia-Pacific' },
  { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸', lat: 34.0522, lng: -118.2437, region: 'Americas' },
  { city: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸', lat: 37.7749, lng: -122.4194, region: 'Americas' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦', lat: 43.6532, lng: -79.3832, region: 'Americas' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', lat: 52.5200, lng: 13.4050, region: 'Europe' },
  { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹', lat: 41.9028, lng: 12.4964, region: 'Europe' },
  { city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', flag: '🇪🇸', lat: 40.4168, lng: -3.7038, region: 'Europe' },
  { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱', lat: 52.3676, lng: 4.9041, region: 'Europe' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', lat: 37.5665, lng: 126.9780, region: 'Asia-Pacific' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭', lat: 13.7563, lng: 100.5018, region: 'Asia-Pacific' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', lat: 30.0444, lng: 31.2357, region: 'Africa' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦', lat: -26.2041, lng: 28.0473, region: 'Africa' },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', lat: -23.5505, lng: -46.6333, region: 'Americas' },
  { city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', lat: -34.6037, lng: -58.3816, region: 'Americas' },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽', lat: 19.4326, lng: -99.1332, region: 'Americas' },
  { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷', lat: 41.0082, lng: 28.9784, region: 'Europe' },
  { city: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', flag: '🇸🇦', lat: 24.7136, lng: 46.6753, region: 'Middle East' },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', lat: -36.8485, lng: 174.7633, region: 'Asia-Pacific' },
  { city: 'Honolulu', country: 'United States', timezone: 'Pacific/Honolulu', flag: '🇺🇸', lat: 21.3069, lng: -157.8583, region: 'Americas' },
  { city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭', lat: 47.3769, lng: 8.5417, region: 'Europe' },
  { city: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', flag: '🇸🇪', lat: 59.3293, lng: 18.0686, region: 'Europe' }
];

export function getCityTime(timezone) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const hours = parts.find(p => p.type === 'hour')?.value || '00';
    const minutes = parts.find(p => p.type === 'minute')?.value || '00';
    const seconds = parts.find(p => p.type === 'second')?.value || '00';
    
    // Get UTC offset
    const dateStr = now.toLocaleString('en-US', { timeZone: timezone });
    const localDate = new Date(dateStr);
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offsetHours = Math.round((localDate - utcDate) / (1000 * 60 * 60));
    
    return {
      formatted: `${hours}:${minutes}:${seconds}`,
      hours: parseInt(hours, 10),
      minutes: parseInt(minutes, 10),
      seconds: parseInt(seconds, 10),
      offset: offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`,
      isNight: parseInt(hours, 10) < 6 || parseInt(hours, 10) >= 18
    };
  } catch (e) {
    return { formatted: '--:--:--', hours: 0, minutes: 0, seconds: 0, offset: '+0', isNight: false };
  }
}
