'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ArrowRight, CreditCard } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const MP_LINK = process.env.NEXT_PUBLIC_MP_LINK || '#'
const IG_LINK = process.env.NEXT_PUBLIC_IG_LINK || '#'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function LandingPage() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <main className="min-h-screen bg-brown flex flex-col lg:flex-row overflow-hidden relative">
      {/* Absolute Decorative SVG */}
      <motion.svg 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 0.1, rotate: 360 }} 
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20vh] -left-[10vw] w-[80vh] h-[80vh] text-terracotta pointer-events-none" 
        viewBox="0 0 100 100"
      >
        <path d="M50 0 A50 50 0 0 1 100 50 A50 50 0 0 1 50 100 A50 50 0 0 1 0 50 A50 50 0 0 1 50 0 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4"/>
      </motion.svg>

      {/* Left: Content */}
      <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col justify-center px-8 lg:px-20 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-terracotta/30 bg-terracotta/10 text-terracotta text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            Taller Artesanal
          </div>

          <h1 className="font-display text-6xl lg:text-8xl font-bold text-cream leading-[1.1] mb-6">
            Piezas <br />
            <span className="text-terracotta italic">únicas</span> con <br />
            alma de barro.
          </h1>

          <p className="text-sand/80 text-lg lg:text-xl font-sans font-light leading-relaxed mb-10 max-w-md">
            MAMINA es el lugar donde el tiempo se detiene. Cada pieza es elaborada a mano, horneada con paciencia y diseñada para llevar calidez a tu hogar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/tienda"
              className="group flex items-center justify-center gap-3 rounded-full px-8 py-5 bg-terracotta text-white font-bold text-lg shadow-[0_0_40px_rgba(196,113,75,0.4)] hover:shadow-[0_0_60px_rgba(196,113,75,0.6)] hover:-translate-y-1 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Explorar Tienda
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Secondary Links at the bottom */}
          <div className="mt-16 flex items-center gap-6 border-t border-white/10 pt-8">
            <p className="text-sand/50 text-sm font-medium">Otros canales:</p>
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sand hover:text-white transition-colors">
              <InstagramIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Instagram</span>
            </a>
            <a href={MP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sand hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-semibold">MercadoPago</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right: Immersive Image */}
      <div 
        className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen bg-sand relative p-4 lg:p-8"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* We use a high quality Unsplash image for the landing hero */}
          <Image
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2070&auto=format&fit=crop"
            alt="Artesanía en cerámica"
            fill
            priority
            className="object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-transparent to-transparent pointer-events-none" />
          
          <div 
            className="absolute bottom-10 left-10 right-10 text-cream"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl mb-4">
              🏺
            </div>
            <h2 className="font-display text-3xl font-bold">MAMINA</h2>
            <p className="font-sans text-sm font-medium tracking-widest text-white/70 uppercase">Hecho con amor</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
