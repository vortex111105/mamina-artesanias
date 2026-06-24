import { NextResponse } from 'next/server'
import { createPreference } from '@/lib/mercadopago'
import { getAdminClient } from '@/lib/supabase'
import { CartItem } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { items, email }: { items: CartItem[]; email?: string } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const db = getAdminClient()

    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        status: 'pending',
        items,
        total,
        customer_email: email || null,
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const preference = await createPreference(items, order.id, email)

    await db
      .from('orders')
      .update({ mp_preference_id: preference.id })
      .eq('id', order.id)

    return NextResponse.json({ init_point: preference.init_point })
  } catch (e: unknown) {
    console.error('Checkout error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}
