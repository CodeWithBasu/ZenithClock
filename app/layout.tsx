import type { Metadata } from 'next';
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chronopulse - Smart Zenith Clock",
  description: "A smart brilliant clock with immersive amazing features including alarms, world time, timer, and stopwatch.",
  keywords: ["clock", "smart clock", "world time", "timer", "stopwatch", "pomodoro", "focus mode"],
  authors: [{ name: "CodeWithBasu" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
