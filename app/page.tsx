'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, CreditCard } from 'lucide-react'
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

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

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
    <main className="min-h-screen bg-brown flex flex-col lg:flex-row overflow-hidden relative items-center justify-center">
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

      {/* Left: Content & Buttons */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start px-8 lg:px-20 py-16 relative z-10 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-terracotta/30 bg-terracotta/10 text-terracotta text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            Taller Artesanal
          </div>

          <h1 className="font-display text-5xl lg:text-7xl font-bold text-cream leading-[1.1] mb-6">
            MAMINA
          </h1>

          <p className="text-sand/80 text-base lg:text-lg font-sans font-light leading-relaxed mb-10 max-w-sm mx-auto lg:mx-0">
            Piezas únicas elaboradas a mano, con tiempo y mucho amor. Ideal para regalar o darle vida a tu hogar.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <Link
              href="/tienda"
              className="flex items-center gap-4 w-full rounded-2xl px-6 py-5 bg-terracotta text-white shadow-[0_0_30px_rgba(196,113,75,0.3)] hover:shadow-[0_0_40px_rgba(196,113,75,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg leading-tight">Explorar Tienda</p>
                <p className="text-sm text-orange-100/80 mt-0.5">Ver catálogo de productos</p>
              </div>
            </Link>

            <a
              href={MP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 w-full rounded-2xl px-6 py-5 bg-white border border-sand text-brown shadow-lg hover:shadow-xl hover:border-[#009EE3]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#009EE3]/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-[#009EE3]" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg leading-tight text-brown">Transferir en Feria</p>
                <p className="text-sm text-brown-light mt-0.5">Pagar rápido vía MercadoPago</p>
              </div>
            </a>
          </div>

          {/* Secondary Links at the bottom */}
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 border-t border-white/10 pt-6">
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sand/60 hover:text-white transition-colors">
              <InstagramIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Seguinos en Instagram</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right: Smaller Decorative Image */}
      <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative w-full max-w-sm aspect-[3/4]"
          style={{ perspective: 1000 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full h-full relative rounded-[3rem] rounded-tr-none overflow-hidden shadow-2xl border-4 border-white/10"
          >
            <Image
              src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2070&auto=format&fit=crop"
              alt="Artesanía en cerámica"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
          {/* Decorative small element behind */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-terracotta/30 -z-10" />
        </motion.div>
      </div>
    </main>
  )
}
