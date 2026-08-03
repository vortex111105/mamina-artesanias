'use client'

import Link from 'next/link'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function Navbar({ showBack }: { showBack?: boolean }) {
  const { count } = useCart()

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="h-16 px-6 bg-white/70 backdrop-blur-md shadow-warm-md border border-white/50 rounded-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <Link
                href="/tienda"
                className="text-brown-light hover:text-terracotta transition-colors p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <Link
              href="/"
              className="font-display font-bold text-brown text-xl hover:opacity-80 transition-opacity"
            >
              MAMINA
            </Link>
          </div>

          <Link
            href="/carrito"
            className="relative p-2.5 rounded-full bg-cream/50 hover:bg-white hover:shadow-sm border border-transparent hover:border-sand/50 transition-all group"
            aria-label={`Carrito con ${count} productos`}
          >
            <ShoppingCart className="w-5 h-5 text-brown group-hover:text-terracotta transition-colors" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
