'use client';

import { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  theme?: string;
}

export default function DynamicBackground({ theme = 'cyber' }: DynamicBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden flex items-center justify-center">
      {/* Base Background Color */}
      <div className="absolute inset-0 bg-zinc-950" />
      
      {/* Massive Cyber Core Watermark */}
      <div 
        className="absolute inset-0 opacity-[0.03] sm:opacity-[0.05] transition-all duration-1000"
        style={{
          backgroundImage: 'url(/cyber-core.png)',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          filter: 'invert(1) drop-shadow(0 0 30px rgba(6,182,212,0.5))',
          transform: 'scale(1.1)'
        }}
      />
    </div>
  );
}
