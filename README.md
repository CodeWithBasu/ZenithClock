# 🕒⚡ ChronoPulse — Next-Gen Immersive Smart Clock Suite

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Synthesizer-ff69b4?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

> **ChronoPulse** (ZenithClock) is a hyper-aesthetic, high-performance web-based Smart Clock suite built with Next.js, React, Tailwind CSS, JavaScript, and MongoDB Atlas. It seamlessly fuses timekeeping, productivity tools, interactive world time maps, procedural soundscapes, and alarm wake-up challenges into a modern glassmorphism interface.

---

## ✨ Features Breakdown

### 1. 🕒 Smart Clock & Bedtime Calculator
- **Dual Display Modes:** Digital LED display & SVG Analog clock with real-time hour, minute, and second hands.
- **Sleep Cycle Calculator:** Calculates optimal 90-minute REM sleep wake-up times if sleeping right now.
- **Day Progress Tracker:** Visual progress bar tracking percentage of the 24-hour day elapsed.
- **5 Aesthetic Themes:** *Cyber Neon, Aurora Emerald, Obsidian Purple, Sunburst Gold, Midnight Slate*.

### 2. ⏰ Alarms with Wake-Up Challenges
- **Recurring Alarms:** Set alarms for specific days of the week with custom labels.
- **Web Audio Synthesizer Tones:** Built-in synthesizer for *Radar Pulse, Gentle Chime, and Retro Synthwave* (no external MP3 dependency!).
- **Math Wake-Up Challenge:** Heavy sleeper mode requiring math problem resolution to turn off the alarm.
- **Cloud & Local Storage:** Automatic persistence via MongoDB Atlas API with LocalStorage fallback.

### 3. 🌐 Interactive World Time & Converter
- **Searchable Directory:** Browse 30+ major international cities with live digital clock cards and UTC offsets.
- **Interactive Day/Night Map:** Visual globe projection rendering day and night regions.
- **Timezone Converter Slider:** Drag a preview slider to calculate target local hours across all pinned cities simultaneously.

### 4. ⏳ Multi-Timer & Quick Presets
- **Simultaneous Countdown Timers:** Run multiple timers concurrently with animated circular SVG progress rings.
- **Quick Presets:** Pomodoro (25m), Tea & Coffee (5m), Power Nap (15m), Workout (45m).
- **Celebration Audio & Visuals:** Synthesized completion chimes and confetti animations.

### 5. ⏱️ Millisecond Precision Stopwatch
- **High-Precision Timer:** Millisecond accurate stopwatch counter (`HH:MM:SS.ms`).
- **Lap Analytics:** Automatically highlights **Fastest Lap** (Emerald Green) and **Slowest Lap** (Rose Red).
- **CSV Data Export:** One-click export of lap history tables into `.csv` spreadsheets.

### 6. 🎧 Focus Pomodoro Studio
- **Productivity Work/Break Cycles:** Structured Work (25m), Short Break (5m), and Long Break (15m) phases.
- **Streak & Completed Counter:** Real-time streak tracking with inspirational productivity quotes.
- **Procedural Ambient Soundscapes:** Built-in Web Audio API noise generator (*Rainstorm, Ocean Waves, Deep Space*).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library:** [React 18](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Glassmorphism Glass Utilities
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) via [Mongoose](https://mongoosejs.com/)
- **Audio Synthesizer:** HTML5 [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** HTML5 Canvas Particle Engine & `canvas-confetti`

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/CodeWithBasu/ZenithClock.git
cd ZenithClock
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure MongoDB Atlas (Optional)
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chronopulse?retryWrites=true&w=majority
```
*(Note: If `MONGODB_URI` is omitted, ChronoPulse will automatically operate using client-side LocalStorage persistence).*

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience **ChronoPulse**!

---

## 📜 License
Distributed under the MIT License. Built with 💖 for developers & time-management enthusiasts.
