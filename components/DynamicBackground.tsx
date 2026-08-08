'use client';

import { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  theme?: string;
}

export default function DynamicBackground({ theme = 'cyber' }: DynamicBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Background from Palette */}
      <div className="absolute inset-0 bg-zinc-50 dark:bg-[#010030] transition-colors duration-700" />
      
      {/* Static Glowing Orbs using Palette Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-[#F042FF] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-10 dark:opacity-30 transition-all duration-700" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[#7226FF] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-15 dark:opacity-40 transition-all duration-700" />
      <div className="absolute top-[30%] right-[10%] w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-[#87F5F5] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-20 dark:opacity-20 transition-all duration-700" />
    </div>
  );
}
