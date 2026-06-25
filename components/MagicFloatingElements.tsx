'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'

const IMAGES = [
  { src: '/personajes/images.jpeg', size: 'w-24 h-24 md:w-32 md:h-32', top: '10%', left: '15%', z: 'z-[10]', delay: 0, speed: 1.2, parallax: -80, rotate: 10 },
  { src: '/personajes/images (1).jpeg', size: 'w-32 h-32 md:w-48 md:h-48', top: '60%', left: '5%', z: 'z-[60]', delay: 1, speed: 0.8, parallax: 150, rotate: -15 }, // Front layer!
  { src: '/personajes/images (2).jpeg', size: 'w-20 h-20 md:w-28 md:h-28', top: '80%', left: '40%', z: 'z-[20]', delay: 2, speed: 1.5, parallax: -50, rotate: 5 },
  { src: '/personajes/images (3).jpeg', size: 'w-40 h-40 md:w-56 md:h-56', top: '20%', right: '-5%', z: 'z-[60]', delay: 3, speed: 0.6, parallax: 200, rotate: 20 }, // Front layer!
  { src: '/personajes/images (4).jpeg', size: 'w-16 h-16 md:w-24 md:h-24', top: '40%', right: '25%', z: 'z-[5]', delay: 0.5, speed: 2, parallax: -30, rotate: -10 }, // Back layer
  { src: '/personajes/images (5).jpeg', size: 'w-28 h-28 md:w-40 md:h-40', bottom: '10%', right: '15%', z: 'z-[30]', delay: 1.5, speed: 1, parallax: 90, rotate: -5 },
  { src: '/personajes/images.png', size: 'w-24 h-24 md:w-36 md:h-36', bottom: '30%', left: '30%', z: 'z-[40]', delay: 2.5, speed: 1.1, parallax: 120, rotate: 25 },
]

export function MagicFloatingElements() {
  const [mounted, setMounted] = useState(false)

  // Global mouse tracking for Parallax 4D effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseXSpring = useSpring(mouseX, { stiffness: 70, damping: 20 })
  const mouseYSpring = useSpring(mouseY, { stiffness: 70, damping: 20 })

  // Base Tilt
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"])

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

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" style={{ perspective: 1500 }}>
      {IMAGES.map((img, idx) => {
        // Individual Parallax shift based on configuration
        const xParallax = useTransform(mouseXSpring, [-0.5, 0.5], [-img.parallax, img.parallax])
        const yParallax = useTransform(mouseYSpring, [-0.5, 0.5], [-img.parallax, img.parallax])

        return (
          <motion.div
            key={idx}
            initial={{ y: 0, x: 0 }}
            animate={{ 
              y: [0, -30 * img.speed, 0],
              x: [0, 10 * img.speed, 0]
            }}
            transition={{
              duration: 8 / img.speed,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: img.delay
            }}
            className={`absolute ${img.size} ${img.z}`}
            style={{ 
              top: img.top, 
              left: img.left, 
              right: img.right, 
              bottom: img.bottom,
              x: xParallax,
              y: yParallax
            }}
          >
            <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
              className="w-full h-full pointer-events-auto cursor-pointer group"
            >
              <div 
                className={`w-full h-full relative rounded-full overflow-hidden bg-white/30 backdrop-blur-xl border-2 border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:scale-125 group-hover:shadow-[0_0px_80px_rgba(255,255,255,0.4)] group-hover:z-[100]`} 
                style={{ 
                  transform: `translateZ(${Math.abs(img.parallax)}px) rotate(${img.rotate}deg)` 
                }}
              >
                {/* 4D Image layer */}
                <Image 
                  src={img.src} 
                  alt={`Personaje ${idx}`} 
                  fill 
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 mix-blend-luminosity hover:mix-blend-normal"
                  sizes="(max-width: 768px) 150px, 300px"
                />
                
                {/* Glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/60 pointer-events-none rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
