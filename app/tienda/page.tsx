import { Product } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { StoreView } from '@/components/StoreView'

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
      <StoreView 
        products={products} 
        categories={categories} 
        initialCategoria={categoria} 
        initialQ={q} 
      />
    </>
  )
}
