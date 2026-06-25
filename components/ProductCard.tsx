'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/types'

export function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0

  return (
    <Link href={`/tienda/${product.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-sand hover:shadow-md transition-shadow">
        <div className="relative aspect-square bg-sand/40">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-brown-light/40">
              🧶
            </div>
          )}
          <span
            className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full ${
              inStock ? 'bg-sage text-white' : 'bg-sand text-brown-light'
            }`}
          >
            {inStock ? `${product.stock} disp.` : 'A pedido'}
          </span>
        </div>
        <div className="p-3">
          {product.category && (
            <span className="inline-block text-xs text-brown-light/70 mb-1">{product.category}</span>
          )}
          <h3 className="font-display font-semibold text-brown text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-terracotta font-bold text-base mt-1">
            ${product.price.toLocaleString('es-AR')}
          </p>
        </div>
      </div>
    </Link>
  )
}
