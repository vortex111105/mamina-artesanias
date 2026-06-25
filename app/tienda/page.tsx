import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { ProductCard } from '@/components/ProductCard'
import { Navbar } from '@/components/Navbar'

export const revalidate = 60

async function getProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('visible', true)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error loading products:', error)
    return []
  }
  return data ?? []
}

async function getCategories(): Promise<string[]> {
  const { data } = await supabase
    .from('products')
    .select('category')
    .eq('visible', true)
    .not('category', 'is', null)

  if (!data) return []
  const unique = [...new Set(data.map((p) => p.category as string))].filter(Boolean)
  return unique.sort()
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams
  const [products, categories] = await Promise.all([
    getProducts(categoria),
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

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            <Link
              href="/tienda"
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
                href={`/tienda?categoria=${encodeURIComponent(cat)}`}
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

        {products.length === 0 ? (
          <div className="text-center py-20 text-brown-light">
            <p className="text-4xl mb-4">🧶</p>
            <p className="font-display text-xl text-brown">
              {categoria ? `No hay productos en "${categoria}"` : 'Pronto habrá novedades'}
            </p>
            <p className="text-sm mt-2">
              {categoria ? (
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
