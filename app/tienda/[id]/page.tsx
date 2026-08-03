import { notFound } from 'next/navigation'
import { Product } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { ProductDetailView } from '@/components/ProductDetailView'
import { InteractiveBackground } from '@/components/InteractiveBackground'

export const revalidate = 60

async function getProduct(id: string): Promise<Product | null> {
  try {
    const { supabase } = await import('@/lib/supabase')
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('visible', true)
      .single()
    return data
  } catch { return null }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  return (
    <>
      <InteractiveBackground />
      <Navbar showBack />
      <ProductDetailView product={product} />
    </>
  )
}
