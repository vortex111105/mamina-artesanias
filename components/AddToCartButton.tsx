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
    <div className="space-y-3">
      {product.delivery.length > 1 && (
        <div>
          <p className="text-sm font-medium text-brown mb-2">Método de entrega</p>
          <div className="flex gap-2 flex-wrap">
            {product.delivery.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDelivery(d)}
                className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                  selectedDelivery === d
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'border-sand text-brown hover:border-terracotta'
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
        className={`w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-white transition-all ${
          added ? 'bg-sage' : 'bg-terracotta hover:bg-terracotta-dark active:scale-[0.98]'
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" /> ¡Agregado al carrito!
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" /> Agregar al carrito
          </>
        )}
      </button>
    </div>
  )
}
