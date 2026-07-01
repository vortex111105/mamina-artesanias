import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { ProductDetailView } from '@/components/ProductDetailView'

export const revalidate = 60

async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('visible', true)
    .single()
  return data
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
      <Navbar showBack />
      <ProductDetailView product={product} />
    </>
  )
}
