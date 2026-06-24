'use client'

import Link from 'next/link'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function Navbar({ showBack }: { showBack?: boolean }) {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm border-b border-sand">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link href="/tienda" className="text-brown-light hover:text-brown transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <Link href="/" className="font-display font-bold text-brown text-lg">
            MAMINA
          </Link>
        </div>
        <Link
          href="/carrito"
          className="relative p-2 rounded-full hover:bg-sand/50 transition-colors"
          aria-label={`Carrito con ${count} productos`}
        >
          <ShoppingCart className="w-5 h-5 text-brown" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
