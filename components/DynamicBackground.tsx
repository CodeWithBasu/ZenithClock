'use client';

import { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  theme?: string;
}

export default function DynamicBackground({ theme = 'cyber' }: DynamicBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Dark Navy Background from Palette */}
      <div className="absolute inset-0 bg-[#010030]" />
      
      {/* Animated Glowing Orbs using Palette Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-[#F042FF] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[#7226FF] rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />
      <div className="absolute top-[30%] right-[10%] w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-[#87F5F5] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
    </div>
  );
}
