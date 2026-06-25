import Link from 'next/link'
import { Search } from 'lucide-react'
import { Product } from '@/lib/types'
import { ProductCard } from '@/components/ProductCard'
import { Navbar } from '@/components/Navbar'

export const revalidate = 60

async function getProducts(category?: string, q?: string): Promise<Product[]> {
  try {
    const { supabase } = await import('@/lib/supabase')
    let query = supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (q) query = query.ilike('name', `%${q}%`)

    const { data, error } = await query
    if (error) { console.error('Error loading products:', error); return [] }
    return data ?? []
  } catch (e) {
    console.error('Supabase not configured:', e)
    return []
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const { supabase } = await import('@/lib/supabase')
    const { data } = await supabase
      .from('products')
      .select('category')
      .eq('visible', true)
      .not('category', 'is', null)
    if (!data) return []
    return [...new Set(data.map((p) => p.category as string))].filter(Boolean).sort()
  } catch {
    return []
  }
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>
}) {
  const { categoria, q } = await searchParams
  const [products, categories] = await Promise.all([
    getProducts(categoria, q),
    getCategories(),
  ])

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 flex-1">
        <div className="mb-5">
          <h1 className="font-display text-3xl font-bold text-brown">Nuestra Tienda</h1>
          <p className="text-brown-light mt-1 text-sm">
            Cada pieza es única y hecha a mano con amor 🤍
          </p>
        </div>

        {/* Search bar */}
        <form method="GET" action="/tienda" className="mb-4">
          {categoria && <input type="hidden" name="categoria" value={categoria} />}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/50" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Buscar productos..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-brown placeholder-brown-light/50 focus:outline-none focus:border-terracotta"
            />
          </div>
        </form>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            <Link
              href={q ? `/tienda?q=${encodeURIComponent(q)}` : '/tienda'}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                !categoria
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'border-sand text-brown-light hover:border-terracotta hover:text-terracotta'
              }`}
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/tienda?categoria=${encodeURIComponent(cat)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  categoria === cat
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'border-sand text-brown-light hover:border-terracotta hover:text-terracotta'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {q && (
          <p className="text-sm text-brown-light mb-4">
            {products.length} resultado{products.length !== 1 ? 's' : ''} para &ldquo;{q}&rdquo;{' '}
            <Link href={categoria ? `/tienda?categoria=${encodeURIComponent(categoria)}` : '/tienda'} className="text-terracotta underline ml-1">
              Limpiar
            </Link>
          </p>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20 text-brown-light">
            <p className="text-4xl mb-4">🏺</p>
            <p className="font-display text-xl text-brown">
              {q ? `Sin resultados para "${q}"` : categoria ? `No hay productos en "${categoria}"` : 'Pronto habrá novedades'}
            </p>
            <p className="text-sm mt-2">
              {(q || categoria) ? (
                <Link href="/tienda" className="text-terracotta underline">
                  Ver todos los productos
                </Link>
              ) : (
                'Seguinos en Instagram para no perderte nada'
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
