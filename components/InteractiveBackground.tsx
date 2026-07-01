'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function InteractiveBackground() {
  const [mounted, setMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Spring settings for smooth tracking
  const springConfig = { damping: 50, stiffness: 50 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const blob1X = useTransform(x, [0, 2000], [80, -80])
  const blob1Y = useTransform(y, [0, 1000], [80, -80])

  const blob2X = useTransform(x, [0, 2000], [-100, 100])
  const blob2Y = useTransform(y, [0, 1000], [-100, 100])

  const blob3X = useTransform(x, [0, 2000], [40, -40])
  const blob3Y = useTransform(y, [0, 1000], [-40, 40])

  // Decorational SVGs parallax
  const dec1X = useTransform(x, [0, 2000], [-30, 30])
  const dec1Y = useTransform(y, [0, 1000], [-30, 30])

  const dec2X = useTransform(x, [0, 2000], [20, -20])
  const dec2Y = useTransform(y, [0, 1000], [20, -20])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Terracotta Blob (Top Right) */}
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-terracotta/25 blur-[90px]"
      />

      {/* Sage Blob (Bottom Left) */}
      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, -30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-sage/25 blur-[100px]"
      />

      {/* Warm Sand Blob (Center) */}
      <motion.div
        style={{ x: blob3X, y: blob3Y }}
        animate={{
          scale: [1, 1.35, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[25%] left-[30%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full bg-[#E5B592]/30 blur-[80px]"
      />

      {/* Decorative Scribbles */}
      <motion.div style={{ x: dec1X, y: dec1Y }} className="absolute top-[20%] right-[15%] text-terracotta/30 opacity-60">
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
          <path d="M10 50 Q 25 10 50 50 T 90 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="15" r="4" fill="currentColor" />
          <circle cx="85" cy="30" r="3" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div style={{ x: dec2X, y: dec2Y }} className="absolute bottom-[25%] left-[20%] text-sage/40 opacity-70">
        <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
          <path d="M50 10 L 60 40 L 90 50 L 60 60 L 50 90 L 40 60 L 10 50 L 40 40 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <motion.div style={{ x: dec1X, y: dec1Y }} className="absolute top-[60%] right-[25%] text-brown-light/20 opacity-50">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
          <path d="M20 20 Q 50 80 80 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M20 40 Q 50 100 80 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  )
}
