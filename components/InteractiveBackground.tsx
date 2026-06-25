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
  
  const dec2X = useTransform(x, [0, 2000], [40, -40])
  const dec2Y = useTransform(y, [0, 1000], [40, -40])
  
  const dec3X = useTransform(x, [0, 2000], [-50, 50])
  const dec3Y = useTransform(y, [0, 1000], [-20, 20])

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

      {/* Snoopy */}
      <motion.div style={{ x: dec1X, y: dec1Y }} className="absolute top-[20%] right-[15%] text-brown-light/40 opacity-50">
        <svg width="80" height="60" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 20 40 Q 20 20, 40 20 Q 55 10, 70 20 C 85 30, 80 40, 70 40 L 20 40 Z" />
          <path d="M 55 25 Q 50 35, 55 45 Q 65 45, 65 30 Z" fill="currentColor"/>
          <circle cx="75" cy="25" r="4" fill="currentColor" />
          <path d="M 60 20 L 63 20" strokeWidth="4"/>
          <path d="M 10 40 L 90 40 M 20 40 L 20 50 M 80 40 L 80 50" />
        </svg>
      </motion.div>

      {/* Woodstock (Pajarito Amarillo Animado) */}
      <motion.div style={{ x: dec2X, y: dec2Y }} className="absolute bottom-[20%] left-[15%] opacity-70">
        <motion.div 
          animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, -10, 10, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#FCD34D]"
        >
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50 40 C 30 40, 30 20, 50 20 C 70 20, 70 40, 50 40" />
            <path d="M 45 20 L 40 10 M 50 20 L 50 5 M 55 20 L 60 10" />
            <circle cx="45" cy="30" r="3" fill="currentColor"/>
            <path d="M 35 32 L 25 35 L 35 38" />
            <path d="M 40 40 C 30 60, 40 80, 55 80 C 70 80, 75 60, 60 40" />
            <motion.path 
              d="M 50 50 C 40 60, 30 50, 15 45" 
              animate={{ d: ["M 50 50 C 40 60, 30 50, 15 45", "M 50 50 C 40 60, 30 60, 15 65"] }} 
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }} 
            />
            <motion.path 
              d="M 55 50 C 65 60, 75 50, 90 45" 
              animate={{ d: ["M 55 50 C 65 60, 75 50, 90 45", "M 55 50 C 65 60, 75 60, 90 65"] }} 
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }} 
            />
            <path d="M 45 80 L 45 90 M 55 80 L 55 90" />
          </svg>
        </motion.div>
      </motion.div>

      {/* El Principito */}
      <motion.div style={{ x: dec3X, y: dec3Y }} className="absolute top-[60%] right-[20%] text-terracotta/40 opacity-60">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 10 80 A 40 30 0 0 0 90 80" strokeWidth="3"/>
          <path d="M 80 20 L 82 25 L 87 25 L 83 28 L 84 33 L 80 30 L 76 33 L 77 28 L 73 25 L 78 25 Z" fill="currentColor" opacity="0.3"/>
          <path d="M 30 80 L 30 70 M 27 67 A 3 3 0 1 1 33 67 A 3 3 0 1 1 27 67" strokeWidth="1.5"/>
          <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.5"/>
          <path d="M 50 55 L 50 72 M 50 60 L 42 63 M 50 60 L 58 63 M 50 72 L 45 80 M 50 72 L 55 80" />
          <motion.path 
            d="M 52 56 C 65 52, 75 60, 85 45" 
            strokeWidth="2"
            animate={{ d: ["M 52 56 C 65 52, 75 60, 85 45", "M 52 56 C 60 55, 75 50, 85 55"] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  )
}
