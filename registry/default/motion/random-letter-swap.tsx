"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface RandomLetterSwapProps {
  label: string;
  className?: string;
  reverse?: boolean;
  staggerDuration?: number;
  transition?: any;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$*";

export function RandomLetterSwap({
  label,
  className = "",
  reverse = false,
  staggerDuration = 0.02,
  transition = { duration: 0.65, type: "spring" }
}: RandomLetterSwapProps) {
  const [displayText, setDisplayText] = useState(label);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isHovering) {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText((current) =>
          label
            .split("")
            .map((letter, index) => {
              if (letter === " ") return " ";
              
              const progress = reverse ? (label.length - 1 - index) : index;
              if (progress < iteration) {
                return label[index];
              }
              return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            })
            .join("")
        );
        
        if (iteration >= label.length) {
          clearInterval(interval);
        }
        
        iteration += 0.03 / staggerDuration; 
      }, 30);
    } else {
      setDisplayText(label);
    }

    return () => clearInterval(interval);
  }, [isHovering, label, staggerDuration, reverse]);

  return (
    <motion.span
      className={className}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      transition={transition}
      style={{ display: 'inline-block' }}
    >
      {displayText}
    </motion.span>
  );
}
