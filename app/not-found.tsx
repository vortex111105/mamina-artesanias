import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-8xl mb-6 select-none">🏺</div>
        <h1 className="font-display text-4xl font-bold text-brown mb-3">
          Esta página se quebró
        </h1>
        <p className="text-brown-light text-base max-w-sm mb-8">
          Como cada pieza artesanal, esta página es única — y parece que no existe.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/tienda"
            className="px-6 py-3 bg-terracotta text-white rounded-2xl font-semibold hover:bg-terracotta-dark transition-colors"
          >
            Ir a la Tienda
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-sand text-brown rounded-2xl font-semibold hover:border-terracotta hover:text-terracotta transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    </>
  )
}
