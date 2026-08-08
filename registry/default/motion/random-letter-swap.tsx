"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface RandomLetterSwapProps {
  label: string;
  className?: string;
  reverse?: boolean;
  staggerDuration?: number;
  transition?: any;
}

export function RandomLetterSwap({
  label,
  className = "",
  reverse = false,
  staggerDuration = 0.02,
  transition = { duration: 0.65, type: "spring" }
}: RandomLetterSwapProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={`inline-flex overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {label.split("").map((char, i) => {
        const displayChar = char === " " ? "\u00A0" : char;
        
        return (
          <span key={i} className="relative inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: 0 }}
              animate={{ y: isHovered ? (reverse ? "100%" : "-100%") : 0 }}
              transition={{
                ...transition,
                delay: i * staggerDuration,
              }}
            >
              {displayChar}
            </motion.span>
            <motion.span
              className="absolute left-0 top-0 inline-block"
              initial={{ y: reverse ? "-100%" : "100%" }}
              animate={{ y: isHovered ? 0 : (reverse ? "-100%" : "100%") }}
              transition={{
                ...transition,
                delay: i * staggerDuration,
              }}
            >
              {displayChar}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}
