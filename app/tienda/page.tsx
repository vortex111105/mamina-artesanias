import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { ProductCard } from '@/components/ProductCard'
import { Navbar } from '@/components/Navbar'

export const revalidate = 60

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('visible', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading products:', error)
    return []
  }
  return data ?? []
}

export default async function TiendaPage() {
  const products = await getProducts()

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-brown">Nuestra Tienda</h1>
          <p className="text-brown-light mt-1 text-sm">
            Cada pieza es única y hecha a mano con amor 🤍
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-brown-light">
            <p className="text-4xl mb-4">🧶</p>
            <p className="font-display text-xl text-brown">Pronto habrá novedades</p>
            <p className="text-sm mt-2">Seguinos en Instagram para no perderte nada</p>
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
