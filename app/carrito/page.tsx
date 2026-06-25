'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, MapPin, Loader2, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { Navbar } from '@/components/Navbar'
import { OrderAddress } from '@/lib/types'

const PROVINCES = [
  'Buenos Aires',
  'CABA',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]

const inputClass =
  'w-full rounded-xl border border-sand px-4 py-2.5 text-sm text-brown placeholder-brown-light/50 focus:outline-none focus:border-terracotta bg-white'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState<OrderAddress>({
    name: '',
    last_name: '',
    address: '',
    city: '',
    postal_code: '',
    province: '',
    phone: '',
  })
  const [shipping, setShipping] = useState<{ zone: string; label: string; cost: number; description: string } | null>(null)
  const [quotingShipping, setQuotingShipping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateAddress(field: keyof OrderAddress, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }))
    if (field === 'postal_code') setShipping(null)
  }

  async function quoteShipping() {
    if (!address.postal_code || address.postal_code.length < 4) return
    setQuotingShipping(true)
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postal_code: address.postal_code }),
      })
      const data = await res.json()
      if (res.ok) setShipping(data)
    } finally {
      setQuotingShipping(false)
    }
  }

  const addressComplete =
    address.name &&
    address.last_name &&
    address.address &&
    address.city &&
    address.postal_code &&
    address.province &&
    address.phone

  const grandTotal = total + (shipping?.cost ?? 0)

  async function handleCheckout() {
    if (items.length === 0) return
    if (!addressComplete) {
      setError('Completá todos los datos de envío antes de continuar.')
      return
    }
    if (!shipping) {
      setError('Cotizá el envío antes de pagar.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email, address, shipping_cost: shipping.cost }),
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

        {/* Items */}
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

        {/* Shipping address */}
        <div className="bg-white rounded-2xl border border-sand p-4 space-y-4 mb-4">
          <h2 className="font-display text-lg font-bold text-brown flex items-center gap-2">
            <MapPin className="w-5 h-5 text-terracotta" />
            Datos de envío
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brown mb-1">Nombre *</label>
              <input
                type="text"
                value={address.name}
                onChange={(e) => updateAddress('name', e.target.value)}
                placeholder="María"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown mb-1">Apellido *</label>
              <input
                type="text"
                value={address.last_name}
                onChange={(e) => updateAddress('last_name', e.target.value)}
                placeholder="García"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brown mb-1">Dirección *</label>
            <input
              type="text"
              value={address.address}
              onChange={(e) => updateAddress('address', e.target.value)}
              placeholder="Av. Corrientes 1234, Piso 3 Depto B"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brown mb-1">Ciudad *</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                placeholder="Buenos Aires"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown mb-1">Código Postal *</label>
              <input
                type="text"
                value={address.postal_code}
                onChange={(e) => updateAddress('postal_code', e.target.value)}
                placeholder="1425"
                maxLength={8}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brown mb-1">Provincia *</label>
            <select
              value={address.province}
              onChange={(e) => updateAddress('province', e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccioná una provincia</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-brown mb-1">Teléfono *</label>
            <input
              type="tel"
              value={address.phone}
              onChange={(e) => updateAddress('phone', e.target.value)}
              placeholder="+54 11 1234-5678"
              className={inputClass}
            />
          </div>

          {/* Shipping quote */}
          <div className="border-t border-sand pt-4">
            <button
              onClick={quoteShipping}
              disabled={quotingShipping || !address.postal_code || address.postal_code.length < 4}
              className="w-full py-2.5 border border-terracotta text-terracotta rounded-xl text-sm font-medium hover:bg-terracotta/5 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {quotingShipping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cotizando...
                </>
              ) : (
                'Cotizar envío por código postal'
              )}
            </button>

            {shipping && (
              <div className="mt-3 p-3 bg-sage/10 rounded-xl border border-sage/30 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-brown">
                    {shipping.label} — ${shipping.cost.toLocaleString('es-AR')}
                  </p>
                  <p className="text-xs text-brown-light mt-0.5">{shipping.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary + payment */}
        <div className="bg-white rounded-2xl border border-sand p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-brown mb-1">
              Tu email (para el comprobante)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hola@ejemplo.com"
              className={inputClass}
            />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-brown-light">
              <span>Subtotal productos</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-brown-light">
              <span>Envío</span>
              <span>{shipping ? `$${shipping.cost.toLocaleString('es-AR')}` : '—'}</span>
            </div>
            <div className="flex justify-between font-bold text-brown text-base border-t border-sand pt-2 mt-2">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl text-terracotta">
                ${grandTotal.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={loading || !addressComplete || !shipping}
            className="w-full py-4 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-dark active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
          </button>

          {(!addressComplete || !shipping) && (
            <p className="text-xs text-brown-light/70 text-center">
              {!addressComplete
                ? 'Completá la dirección de envío para continuar'
                : 'Cotizá el envío para continuar'}
            </p>
          )}
        </div>
      </main>
    </>
  )
}
