'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'

export function MagicFloatingElements() {
  const [mounted, setMounted] = useState(false)

  // Global mouse tracking for 3D effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseXSpring = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const mouseYSpring = useSpring(mouseY, { stiffness: 100, damping: 30 })

  // Tilt ranges
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      const xPct = e.clientX / window.innerWidth - 0.5
      const yPct = e.clientY / window.innerHeight - 0.5
      mouseX.set(xPct)
      mouseY.set(yPct)
    }

    const handleMouseLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY])

  if (!mounted) return null

  // Shared 3D Bubble Style
  const bubbleClass = "w-full h-full relative rounded-full overflow-hidden bg-white/20 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center pointer-events-auto hover:bg-white/40 hover:scale-110 transition-all duration-300 cursor-pointer"

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ perspective: 1200 }}>
      
      {/* Woodstock flying across the screen */}
      <motion.div
        initial={{ x: '-10vw', y: '20vh', opacity: 0 }}
        animate={{
          x: ['-10vw', '30vw', '70vw', '110vw'],
          y: ['20vh', '15vh', '30vh', '10vh'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatDelay: 15,
          ease: "easeInOut"
        }}
        className="absolute w-20 h-20 md:w-28 md:h-28"
      >
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full h-full">
          <div className={bubbleClass} style={{ transform: "translateZ(50px)" }}>
            <Image src="/woodstock.png" alt="Woodstock" fill className="object-contain p-4 drop-shadow-md" sizes="112px" />
          </div>
        </motion.div>
      </motion.div>

      {/* The Little Prince floating gently */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] top-[25%] w-32 h-32 md:w-48 md:h-48 opacity-80"
      >
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full h-full">
          <div className={`${bubbleClass} bg-white/10`} style={{ transform: "translateZ(80px)" }}>
            <Image src="/principito.png" alt="El Principito" fill className="object-contain p-6 drop-shadow-lg" sizes="192px" />
          </div>
        </motion.div>
      </motion.div>

      {/* Snoopy appearing occasionally in the corner */}
      <AnimatePresence>
        <motion.div
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[5%] bottom-[10%] w-32 h-32 md:w-40 md:h-40"
        >
          <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full h-full">
            <div className={bubbleClass} style={{ transform: "translateZ(40px)" }}>
              <Image src="/snoopy.png" alt="Snoopy" fill className="object-contain p-5 drop-shadow-md" sizes="160px" />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
