"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { flushSync } from "react-dom"

import { Moon, Sun } from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

import { useTheme } from "next-themes"

type AnimatedThemeTogglerProps = {
  className?: string
}

export const AnimatedThemeToggler = ({ className }: AnimatedThemeTogglerProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return

    const isDark = resolvedTheme === "dark"
    const nextTheme = isDark ? "light" : "dark"

    // If browser doesn't support view transitions, fallback gracefully
    if (!document.startViewTransition) {
        setTheme(nextTheme)
        return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme)
      })
    }).ready

    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    const maxDistance = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${centerX}px ${centerY}px)`,
          `circle(${maxDistance}px at ${centerX}px ${centerY}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [resolvedTheme, setTheme])

  // Prevent hydration mismatch by returning a placeholder or empty container on the server
  if (!mounted) {
    return (
      <button
        aria-label="Switch theme"
        className={cn(
          "flex items-center justify-center p-2 rounded-full outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer opacity-0",
          className
        )}
        type="button"
      >
        <span className="w-6 h-6" />
      </button>
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label="Switch theme"
      className={cn(
        "flex items-center justify-center p-2 rounded-full outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer",
        className
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === "dark" ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-zinc-900 dark:text-white"
          >
            <Sun />
          </motion.span>
        ) : (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-zinc-900 dark:text-white"
          >
            <Moon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
