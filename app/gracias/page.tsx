'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Clock } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { Suspense } from 'react'

function GraciasContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const pending = searchParams.get('pending') === 'true'
  const { clearCart } = useCart()
  const cleared = useRef(false)

  useEffect(() => {
    if (!cleared.current) {
      clearCart()
      cleared.current = true
    }
  }, [clearCart])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-cream">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">
        {pending ? (
          <Clock className="w-20 h-20 text-sage" />
        ) : (
          <CheckCircle className="w-20 h-20 text-sage" />
        )}

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-brown">
            {pending ? '¡Pago en proceso!' : '¡Gracias por tu compra!'}
          </h1>
          <p className="text-brown-light text-sm">
            {pending
              ? 'Tu pago está siendo procesado. Te avisamos cuando se confirme.'
              : 'Recibimos tu pedido. Te contactaremos pronto para coordinar la entrega.'}
          </p>
          {orderId && (
            <p className="text-xs text-brown-light/60 mt-2">
              Orden #{orderId}
            </p>
          )}
        </div>

        <div className="w-full space-y-3 mt-2">
          <Link
            href="/tienda"
            className="block w-full py-4 bg-terracotta text-white font-semibold rounded-2xl text-center"
          >
            Seguir explorando
          </Link>
          <Link
            href="/"
            className="block w-full py-3 text-brown-light text-sm text-center"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function GraciasPage() {
  return (
    <Suspense>
      <GraciasContent />
    </Suspense>
  )
}
