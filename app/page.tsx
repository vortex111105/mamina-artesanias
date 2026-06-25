'use client'

import Link from 'next/link'
import { CreditCard, ShoppingBag, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

const MP_LINK = process.env.NEXT_PUBLIC_MP_LINK || '#'
const IG_LINK = process.env.NEXT_PUBLIC_IG_LINK || '#'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
}

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-cream relative overflow-hidden">

      {/* Decorative blobs */}
      <motion.div 
        animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-terracotta/10 blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ y: [0, 15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-sage/10 blur-3xl pointer-events-none" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm flex flex-col items-center gap-10 relative z-10"
      >

        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <motion.div variants={itemVariants} className="w-24 h-24 rounded-full bg-terracotta/10 border-2 border-terracotta/20 flex items-center justify-center mx-auto mb-2 text-5xl shadow-warm-sm">
            🏺
          </motion.div>
          <motion.h1 variants={itemVariants} className="font-display text-5xl font-bold text-brown tracking-wide">
            MAMINA
          </motion.h1>
          <motion.p variants={itemVariants} className="text-terracotta text-xs tracking-[0.3em] uppercase font-sans font-semibold">
            Artesanías
          </motion.p>
          <motion.div variants={itemVariants} className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-sand" />
            <Sparkles className="w-4 h-4 text-terracotta/60" />
            <div className="flex-1 h-px bg-sand" />
          </motion.div>
          <motion.p variants={itemVariants} className="text-brown-light text-sm font-sans leading-relaxed">
            Piezas únicas elaboradas<br />con tiempo y con amor
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="w-full flex flex-col gap-3">
          <Link
            href="/tienda"
            className="flex items-center gap-4 w-full rounded-2xl px-6 py-5 bg-terracotta text-white shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 hover:bg-terracotta-dark active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-base leading-tight">Ver Tienda</p>
              <p className="text-xs text-orange-100 mt-0.5">Catálogo completo de productos</p>
            </div>
          </Link>

          <a
            href={IG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full rounded-2xl px-6 py-5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-base leading-tight">Instagram</p>
              <p className="text-xs text-pink-100 mt-0.5">Novedades y detrás de escena</p>
            </div>
          </a>

          <a
            href={MP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full rounded-2xl px-6 py-5 bg-white border border-sand text-brown shadow-warm-sm hover:shadow-warm-md hover:border-terracotta hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#009EE3]/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-[#009EE3]" />
            </div>
            <div>
              <p className="font-semibold text-base leading-tight text-brown">Transferir directo</p>
              <p className="text-xs text-brown-light mt-0.5">Pago via MercadoPago</p>
            </div>
          </a>
        </motion.div>

        <motion.p variants={itemVariants} className="text-brown-light/50 text-xs text-center font-sans">
          © MAMINA Artesanías · Hecho con amor 🤍
        </motion.p>
      </motion.div>
    </main>
  )
}
