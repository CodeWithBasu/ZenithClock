'use client';

import { motion } from 'framer-motion';

interface DynamicBackgroundProps {
  theme?: string;
}

export default function DynamicBackground({ theme = 'cyber' }: DynamicBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Background from Palette */}
      <div className="absolute inset-0 bg-zinc-50 dark:bg-[#010030] transition-colors duration-700" />
      
      {/* Animated Glowing Orbs using Palette Gradients */}
      <motion.div
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, 30, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-[#F042FF] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20 dark:opacity-30 transition-colors duration-700" 
      />
      
      <motion.div
        animate={{
          x: [0, -60, 20, -30, 0],
          y: [0, -40, 50, -20, 0],
          scale: [1, 0.9, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[#7226FF] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-25 dark:opacity-40 transition-colors duration-700" 
      />
      
      <motion.div
        animate={{
          x: [0, 30, -40, 20, 0],
          y: [0, 50, -20, 40, 0],
          scale: [1, 1.05, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[30%] right-[10%] w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-[#87F5F5] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-20 transition-colors duration-700" 
      />
    </div>
  );
}
