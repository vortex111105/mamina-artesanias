import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Truck, CreditCard, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { AddToCartButton } from '@/components/AddToCartButton'

export const revalidate = 60

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

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
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const IG_USERNAME = process.env.NEXT_PUBLIC_IG_USERNAME || 'mamina_artesanias'
  const productUrl = `${APP_URL}/tienda/${product.id}`
  const igMsg = encodeURIComponent(
    `Hola! Vi este producto en tu tienda y me interesa encargar uno: ${product.name} — ${productUrl}`,
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
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    inStock ? 'bg-sage text-white' : 'bg-sand text-brown-light'
                  }`}
                >
                  {inStock ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : 'A pedido'}
                </span>
                {product.category && (
                  <Link
                    href={`/tienda?categoria=${encodeURIComponent(product.category)}`}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-cream border border-sand text-brown-light hover:border-terracotta hover:text-terracotta transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {product.category}
                  </Link>
                )}
              </div>
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
                href={`https://ig.me/m/${IG_USERNAME}?text=${igMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-semibold active:scale-[0.98] transition-transform"
              >
                <InstagramIcon className="w-5 h-5" />
                Encargar por Instagram
              </a>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
