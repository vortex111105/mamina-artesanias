'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function MagicFloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 🐥 Woodstock flying across the screen */}
      <motion.div
        initial={{ x: '-10vw', y: '20vh', opacity: 0 }}
        animate={{
          x: ['-10vw', '30vw', '70vw', '110vw'],
          y: ['20vh', '15vh', '30vh', '10vh'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatDelay: 15,
          ease: "easeInOut"
        }}
        className="absolute text-3xl"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
      >
        🐥
      </motion.div>

      {/* 🪐 The Little Prince Asteroid floating gently */}
      <motion.div
        initial={{ y: 0, rotate: 0 }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute right-[10%] top-[30%] text-4xl opacity-40"
      >
        🪐
      </motion.div>

      {/* ✨ Magical Twinkling Stars (Little Prince / Disney vibe) */}
      <motion.div
        animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute left-[15%] top-[20%] text-xl text-yellow-400 opacity-60"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.7, 1.1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute right-[25%] bottom-[20%] text-2xl text-yellow-500 opacity-50"
      >
        ✨
      </motion.div>

      {/* 🐾 Snoopy Paws appearing occasionally */}
      <AnimatePresence>
        <motion.div
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatDelay: 10,
            ease: "easeInOut"
          }}
          className="absolute left-[5%] bottom-[10%] text-2xl text-brown"
        >
          🐾
        </motion.div>
        <motion.div
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatDelay: 12,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute left-[10%] bottom-[15%] text-2xl text-brown"
        >
          🐾
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
