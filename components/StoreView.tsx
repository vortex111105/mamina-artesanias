'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Product } from '@/lib/types'
import { ProductCard } from '@/components/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'

export function StoreView({
  products,
  categories,
  initialCategoria,
  initialQ,
}: {
  products: Product[]
  categories: string[]
  initialCategoria?: string
  initialQ?: string
}) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ || '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (initialCategoria) params.set('categoria', initialCategoria)
    if (q.trim()) params.set('q', q.trim())
    router.push(`/tienda?${params.toString()}`)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 pt-28 pb-12 flex-1">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="font-display text-4xl font-bold text-brown">Catálogo</h1>
        <p className="text-brown-light mt-2 text-sm max-w-sm mx-auto">
          Piezas de cerámica únicas y elaboradas a mano con tiempo y amor 🤍
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSearch} 
        className="mb-6"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-terracotta/30 to-sage/30 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/50" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-none bg-white/80 backdrop-blur-sm text-sm text-brown placeholder-brown-light/50 focus:outline-none focus:ring-2 focus:ring-terracotta/50 shadow-sm transition-all"
            />
          </div>
        </div>
      </motion.form>

      {/* Category filters */}
      {categories.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-8 justify-center"
        >
          <Link
            href={initialQ ? `/tienda?q=${encodeURIComponent(initialQ)}` : '/tienda'}
            className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
          >
            {!initialCategoria && (
              <motion.div layoutId="activeCategory" className="absolute inset-0 bg-terracotta rounded-full shadow-sm" />
            )}
            <span className={`relative z-10 ${!initialCategoria ? 'text-white' : 'text-brown-light hover:text-brown'}`}>
              Todos
            </span>
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/tienda?categoria=${encodeURIComponent(cat)}${initialQ ? `&q=${encodeURIComponent(initialQ)}` : ''}`}
              className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
            >
              {initialCategoria === cat && (
                <motion.div layoutId="activeCategory" className="absolute inset-0 bg-terracotta rounded-full shadow-sm" />
              )}
              <span className={`relative z-10 ${initialCategoria === cat ? 'text-white' : 'text-brown-light hover:text-brown'}`}>
                {cat}
              </span>
            </Link>
          ))}
        </motion.div>
      )}

      {initialQ && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-brown-light mb-6 text-center">
          {products.length} resultado{products.length !== 1 ? 's' : ''} para &ldquo;<span className="font-semibold text-brown">{initialQ}</span>&rdquo;
          <Link href={initialCategoria ? `/tienda?categoria=${encodeURIComponent(initialCategoria)}` : '/tienda'} className="text-terracotta font-medium ml-2 hover:underline">
            Limpiar búsqueda
          </Link>
        </motion.p>
      )}

      <AnimatePresence mode="wait">
        {products.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-20 text-brown-light bg-white/40 rounded-3xl border border-white"
          >
            <p className="text-5xl mb-4 opacity-50">🏺</p>
            <p className="font-display text-xl text-brown mb-2">
              {initialQ ? `Sin resultados para "${initialQ}"` : initialCategoria ? `No hay productos en "${initialCategoria}"` : 'Pronto habrá novedades'}
            </p>
            <p className="text-sm">
              {(initialQ || initialCategoria) ? (
                <Link href="/tienda" className="text-terracotta font-medium hover:underline">
                  Ver todos los productos
                </Link>
              ) : (
                'Seguinos en Instagram para no perderte nada'
              )}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
