import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MessageCircle, Truck, CreditCard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { AddToCartButton } from '@/components/AddToCartButton'

export const revalidate = 60

async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('visible', true)
    .single()
  return data
}

const deliveryLabels: Record<string, string> = {
  correo: 'Envío por correo',
  retiro: 'Retiro en tienda',
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const inStock = product.stock > 0
  const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'mamina_artesanias_bot'
  const encargaMsg = encodeURIComponent(
    `Hola! Me interesa encargar: ${product.name} (ID: ${product.id}). ¿Cómo lo pedimos?`,
  )

  return (
    <>
      <Navbar showBack />
      <main className="max-w-2xl mx-auto px-4 py-6 flex-1">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Image */}
          <div className="relative w-full sm:w-64 aspect-square rounded-2xl overflow-hidden bg-sand/40 shrink-0">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 256px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-brown-light/40">
                🧶
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <span
                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${
                  inStock ? 'bg-sage text-white' : 'bg-sand text-brown-light'
                }`}
              >
                {inStock ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : 'A pedido'}
              </span>
              <h1 className="font-display text-2xl font-bold text-brown">{product.name}</h1>
              <p className="text-3xl font-bold text-terracotta mt-1">
                ${product.price.toLocaleString('es-AR')}
              </p>
            </div>

            {product.description && (
              <p className="text-brown-light text-sm leading-relaxed">{product.description}</p>
            )}

            {/* Delivery */}
            {product.delivery.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-brown-light">
                <Truck className="w-4 h-4 mt-0.5 shrink-0 text-sage" />
                <span>{product.delivery.map((d) => deliveryLabels[d] ?? d).join(' · ')}</span>
              </div>
            )}

            {/* Payment */}
            {product.accepts_mp && (
              <div className="flex items-center gap-2 text-sm text-brown-light">
                <CreditCard className="w-4 h-4 shrink-0 text-[#009EE3]" />
                <span>Acepta MercadoPago</span>
              </div>
            )}

            {/* CTA */}
            {inStock ? (
              <AddToCartButton product={product} />
            ) : (
              <a
                href={`https://t.me/${BOT_USERNAME}?text=${encargaMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 bg-sage text-white font-semibold active:scale-[0.98] transition-transform"
              >
                <MessageCircle className="w-5 h-5" />
                Encargar este producto
              </a>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
