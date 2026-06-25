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

  // Use transforms to move the blobs slightly in the opposite direction of the mouse
  // We divide window width/height to get a normalized value, but here we just map large pixel values
  const blob1X = useTransform(x, [0, 2000], [50, -50])
  const blob1Y = useTransform(y, [0, 1000], [50, -50])

  const blob2X = useTransform(x, [0, 2000], [-70, 70])
  const blob2Y = useTransform(y, [0, 1000], [-70, 70])

  const blob3X = useTransform(x, [0, 2000], [30, -30])
  const blob3Y = useTransform(y, [0, 1000], [-30, 30])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Terracotta Blob (Top Right) */}
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 45, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-terracotta/10 blur-[80px]"
      />

      {/* Sage Blob (Bottom Left) */}
      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -30, 0]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-sage/10 blur-[100px]"
      />

      {/* Sand/Brown Blob (Center) */}
      <motion.div
        style={{ x: blob3X, y: blob3Y }}
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-brown-light/5 blur-[90px]"
      />
    </div>
  )
}
