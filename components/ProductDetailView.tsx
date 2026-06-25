'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Truck, CreditCard, Tag } from 'lucide-react'
import { Product } from '@/lib/types'
import { AddToCartButton } from '@/components/AddToCartButton'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const deliveryLabels: Record<string, string> = {
  correo: 'Envío por correo',
  retiro: 'Retiro en tienda',
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ProductDetailView({ product }: { product: Product }) {
  const inStock = product.stock > 0
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const IG_USERNAME = process.env.NEXT_PUBLIC_IG_USERNAME || 'mamina_artesanias'
  const productUrl = `${APP_URL}/tienda/${product.id}`
  const igMsg = encodeURIComponent(
    `Hola! Vi este producto en tu tienda y me interesa encargar uno: ${product.name} — ${productUrl}`,
  )

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pt-28 pb-12 flex-1">
      <div className="flex flex-col md:flex-row gap-10 md:gap-14">
        {/* Left: Image with 3D Effect */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full md:w-1/2 shrink-0"
          style={{ perspective: 1500 }}
        >
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative aspect-square rounded-[2rem] overflow-hidden bg-white/40 shadow-warm-lg border border-white/60"
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl text-brown-light/30">
                🧶
              </div>
            )}
            
            {/* Overlay badge in 3D */}
            <div className="absolute top-4 left-4" style={{ transform: "translateZ(50px)" }}>
              <span
                className={`text-xs font-bold px-4 py-2 rounded-full shadow-md backdrop-blur-md ${
                  inStock ? 'bg-sage/90 text-white' : 'bg-sand/90 text-brown'
                }`}
              >
                {inStock ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : 'A pedido'}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Info */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
          className="flex-1 flex flex-col pt-2"
        >
          <div className="mb-6">
            {product.category && (
              <Link
                href={`/tienda?categoria=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-terracotta/10 text-terracotta hover:bg-terracotta hover:text-white transition-colors mb-4"
              >
                <Tag className="w-3.5 h-3.5" />
                {product.category}
              </Link>
            )}
            <h1 className="font-display text-4xl font-bold text-brown leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-4xl font-extrabold text-terracotta">
              ${product.price.toLocaleString('es-AR')}
            </p>
          </div>

          {product.description && (
            <p className="text-brown-light text-base leading-relaxed mb-8 bg-white/40 p-5 rounded-2xl border border-white/50">
              {product.description}
            </p>
          )}

          <div className="space-y-4 mb-8">
            {/* Delivery */}
            {product.delivery.length > 0 && (
              <div className="flex items-center gap-3 text-sm text-brown font-medium bg-sand/20 px-4 py-3 rounded-xl">
                <div className="bg-sage/20 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-sage" />
                </div>
                <span>{product.delivery.map((d) => deliveryLabels[d] ?? d).join(' · ')}</span>
              </div>
            )}

            {/* Payment */}
            {product.accepts_mp && (
              <div className="flex items-center gap-3 text-sm text-brown font-medium bg-sand/20 px-4 py-3 rounded-xl">
                <div className="bg-[#009EE3]/10 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 text-[#009EE3]" />
                </div>
                <span>Acepta MercadoPago</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-auto">
            {inStock ? (
              <AddToCartButton product={product} />
            ) : (
              <a
                href={`https://ig.me/m/${IG_USERNAME}?text=${igMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                <InstagramIcon className="w-6 h-6" />
                Encargar por Instagram
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
