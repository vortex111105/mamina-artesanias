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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dark Hero Section for Store */}
      <div className="w-full bg-brown pt-36 pb-12 px-4 rounded-b-[3rem] shadow-2xl relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold text-cream mb-4">Catálogo</h1>
            <p className="text-sand/80 text-base md:text-lg max-w-lg mx-auto font-light">
              Piezas de cerámica únicas y elaboradas a mano con tiempo y amor 🤍
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch} 
            className="mb-10 max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-terracotta to-sage rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-terracotta" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="¿Qué estás buscando hoy?"
                  className="w-full pl-16 pr-6 py-5 rounded-full border-none bg-white/95 backdrop-blur-md text-lg font-medium text-brown placeholder-brown-light/60 focus:outline-none focus:ring-4 focus:ring-terracotta/30 shadow-xl transition-all"
                />
              </div>
            </div>
          </motion.form>

          {/* Category filters */}
          {categories.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 flex-wrap justify-center"
            >
              <Link
                href={initialQ ? `/tienda?q=${encodeURIComponent(initialQ)}` : '/tienda'}
                className="relative px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm"
              >
                {!initialCategoria && (
                  <motion.div layoutId="activeCategory" className="absolute inset-0 bg-terracotta rounded-full shadow-lg" />
                )}
                <span className={`relative z-10 ${!initialCategoria ? 'text-white' : 'text-cream hover:text-white bg-white/10 backdrop-blur-sm rounded-full'}`}>
                  Todos
                </span>
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/tienda?categoria=${encodeURIComponent(cat)}${initialQ ? `&q=${encodeURIComponent(initialQ)}` : ''}`}
                  className="relative px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm"
                >
                  {initialCategoria === cat && (
                    <motion.div layoutId="activeCategory" className="absolute inset-0 bg-terracotta rounded-full shadow-lg" />
                  )}
                  <span className={`relative z-10 ${initialCategoria === cat ? 'text-white' : 'text-cream hover:text-white bg-white/10 backdrop-blur-sm rounded-full'}`}>
                    {cat}
                  </span>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-16 flex-1 w-full relative z-0">
        {initialQ && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-brown-light mb-8 text-center bg-white/50 backdrop-blur-sm inline-block mx-auto rounded-full px-6 py-2 border border-terracotta/20">
            {products.length} resultado{products.length !== 1 ? 's' : ''} para &ldquo;<span className="font-bold text-terracotta">{initialQ}</span>&rdquo;
            <Link href={initialCategoria ? `/tienda?categoria=${encodeURIComponent(initialCategoria)}` : '/tienda'} className="text-brown font-bold ml-4 hover:underline">
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
              className="text-center py-24 text-brown-light bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-warm-lg max-w-2xl mx-auto"
            >
              <p className="text-6xl mb-6 opacity-60">🏺</p>
              <p className="font-display text-2xl font-bold text-brown mb-3">
                {initialQ ? `Sin resultados para "${initialQ}"` : initialCategoria ? `No hay productos en "${initialCategoria}"` : 'Pronto habrá novedades'}
              </p>
              <p className="text-base text-brown-light/80">
                {(initialQ || initialCategoria) ? (
                  <Link href="/tienda" className="text-terracotta font-bold hover:underline">
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
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants} className="h-full">
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
