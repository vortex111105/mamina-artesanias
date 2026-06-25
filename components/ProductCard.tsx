'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/lib/types'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Eye } from 'lucide-react'

export function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0
  const [imgError, setImgError] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, type: 'spring' as const, stiffness: 100 }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        <Link href={`/tienda/${product.id}`} className="group block h-full">
          <div className="h-full rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(196,113,75,0.12)] border border-terracotta/30 hover:border-terracotta/60 hover:shadow-[0_8px_30px_rgb(196,113,75,0.2)] transition-all duration-300">
            <div className="relative aspect-[4/5] bg-sand/40 overflow-hidden rounded-t-[2rem]">
              {product.image_url && !imgError ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl text-brown-light/40 group-hover:scale-110 transition-transform duration-700 ease-out">
                  🧶
                </div>
              )}
              
              {/* Overlay gradient for warmth */}
              <div className="absolute inset-0 bg-terracotta/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div 
                  className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-terracotta px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <Eye className="w-4 h-4" />
                  Ver detalle
                </div>
              </div>

              <span
                className={`absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 ${
                  inStock ? 'bg-sage text-white' : 'bg-sand text-brown'
                }`}
                style={{ transform: "translateZ(30px)" }}
              >
                {inStock ? `${product.stock} disp.` : 'A pedido'}
              </span>
            </div>
            <div className="p-5 flex flex-col justify-between bg-white" style={{ transform: "translateZ(20px)" }}>
              <div>
                {product.category && (
                  <span className="inline-block text-[11px] uppercase tracking-widest text-terracotta mb-2 font-bold bg-terracotta/10 px-2 py-0.5 rounded-sm">
                    {product.category}
                  </span>
                )}
                <h3 className="font-display font-bold text-brown text-lg leading-tight line-clamp-2">
                  {product.name}
                </h3>
              </div>
              <p className="text-terracotta font-extrabold text-xl mt-3">
                ${product.price.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
