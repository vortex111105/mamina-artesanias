import Link from 'next/link'
import { CreditCard, ShoppingBag } from 'lucide-react'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

const MP_LINK = process.env.NEXT_PUBLIC_MP_LINK || '#'
const IG_LINK = process.env.NEXT_PUBLIC_IG_LINK || 'https://instagram.com/mamina.artesanias'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-cream">
      <div className="w-full max-w-sm flex flex-col items-center gap-10">

        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">🧶</div>
          <h1 className="font-display text-4xl font-bold text-brown tracking-wide">
            MAMINA
          </h1>
          <p className="text-brown-light text-sm tracking-widest uppercase font-sans">
            Artesanías
          </p>
          <div className="w-16 h-0.5 bg-terracotta mx-auto mt-3" />
          <p className="text-brown-light text-sm mt-3 font-sans">
            Hechas con tiempo y con amor
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-4">
          <a
            href={MP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full rounded-2xl px-6 py-5 bg-[#009EE3] text-white shadow-md active:scale-[0.98] transition-transform"
          >
            <CreditCard className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-base leading-tight">Pagar con MercadoPago</p>
              <p className="text-xs text-blue-100 mt-0.5">Transferencia directa en tienda</p>
            </div>
          </a>

          <Link
            href="/tienda"
            className="flex items-center gap-4 w-full rounded-2xl px-6 py-5 bg-terracotta text-white shadow-md active:scale-[0.98] transition-transform"
          >
            <ShoppingBag className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-base leading-tight">Ver Tienda</p>
              <p className="text-xs text-orange-100 mt-0.5">Catálogo completo de productos</p>
            </div>
          </Link>

          <a
            href={IG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full rounded-2xl px-6 py-5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-md active:scale-[0.98] transition-transform"
          >
            <InstagramIcon className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-base leading-tight">Instagram</p>
              <p className="text-xs text-pink-100 mt-0.5">Novedades y detrás de escena</p>
            </div>
          </a>
        </div>

        <p className="text-brown-light/60 text-xs text-center font-sans">
          © MAMINA Artesanías · Hecho con amor 🤍
        </p>
      </div>
    </main>
  )
}
