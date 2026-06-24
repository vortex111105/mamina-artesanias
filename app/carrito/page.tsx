'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { Navbar } from '@/components/Navbar'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar')
      window.location.href = data.init_point
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar showBack />
        <main className="max-w-2xl mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-16 h-16 text-sand mb-4" />
          <h2 className="font-display text-2xl font-bold text-brown">Tu carrito está vacío</h2>
          <p className="text-brown-light mt-2 text-sm">Explorá nuestra tienda y encontrá algo especial</p>
          <Link
            href="/tienda"
            className="mt-6 px-6 py-3 bg-terracotta text-white rounded-2xl font-semibold"
          >
            Ver Tienda
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6 flex-1">
        <h1 className="font-display text-2xl font-bold text-brown mb-6">Tu carrito</h1>

        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3 bg-white rounded-2xl p-3 border border-sand">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-sand/40 shrink-0">
                {item.product.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🧶</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-brown text-sm leading-tight line-clamp-2">
                  {item.product.name}
                </h3>
                <p className="text-xs text-brown-light mt-0.5">{item.delivery_method}</p>
                <p className="text-terracotta font-bold text-sm mt-1">
                  ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-sand flex items-center justify-center text-brown hover:bg-sand/50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium text-brown w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock && item.product.stock > 0}
                    className="w-7 h-7 rounded-full border border-sand flex items-center justify-center text-brown hover:bg-sand/50 disabled:opacity-40"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="ml-auto text-brown-light/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-sand p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-brown-light font-sans text-sm">Total</span>
            <span className="font-display text-2xl font-bold text-brown">
              ${total.toLocaleString('es-AR')}
            </span>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brown mb-1.5">
              Tu email (para el comprobante)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hola@ejemplo.com"
              className="w-full rounded-xl border border-sand px-4 py-2.5 text-sm text-brown placeholder-brown-light/50 focus:outline-none focus:border-terracotta"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-dark active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
          </button>
        </div>
      </main>
    </>
  )
}
