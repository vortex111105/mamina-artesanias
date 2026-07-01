'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/lib/types'

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [selectedDelivery, setSelectedDelivery] = useState(product.delivery[0] ?? 'retiro')
  const [added, setAdded] = useState(false)

  const deliveryLabels: Record<string, string> = {
    correo: '📦 Envío por correo',
    retiro: '🏪 Retiro en tienda',
  }

  function handleAdd() {
    addItem(product, selectedDelivery)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {product.delivery.length > 1 && (
        <div className="bg-white/40 p-4 rounded-2xl border border-white/50">
          <p className="text-sm font-semibold text-brown mb-3">¿Cómo lo preferís?</p>
          <div className="flex gap-2 flex-wrap">
            {product.delivery.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDelivery(d)}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                  selectedDelivery === d
                    ? 'bg-terracotta text-white border-terracotta shadow-md'
                    : 'bg-white border-sand text-brown hover:border-terracotta/50 hover:bg-terracotta/5'
                }`}
              >
                {deliveryLabels[d] ?? d}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-5 font-bold text-lg text-white shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 transition-all ${
          added ? 'bg-sage scale-[0.98]' : 'bg-terracotta hover:bg-terracotta-dark active:scale-[0.98]'
        }`}
      >
        {added ? (
          <>
            <Check className="w-6 h-6" /> ¡Agregado al carrito!
          </>
        ) : (
          <>
            <ShoppingCart className="w-6 h-6" /> Agregar al carrito
          </>
        )}
      </button>
    </div>
  )
}
