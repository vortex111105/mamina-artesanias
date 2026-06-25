import { NextResponse } from 'next/server'
import { createPreference } from '@/lib/mercadopago'
import { getAdminClient } from '@/lib/supabase'
import { sendAdminNewOrder, sendBuyerConfirmation } from '@/lib/email'
import { CartItem, OrderAddress } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const {
      items,
      email,
      address,
      shipping_cost,
    }: {
      items: CartItem[]
      email?: string
      address?: OrderAddress
      shipping_cost?: number
    } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    const itemsTotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const ship = shipping_cost ?? 0
    const total = itemsTotal + ship

    const db = getAdminClient()

    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        status: 'pending',
        items,
        total,
        customer_email: email || null,
        address: address || null,
        shipping_cost: ship,
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

    // Enviar emails en background (no bloqueamos la respuesta)
    if (address) {
      Promise.all([
        sendAdminNewOrder(order.id, items, total, ship, address, email ?? null).catch(
          (e) => console.error('Admin email error:', e),
        ),
        email
          ? sendBuyerConfirmation(order.id, items, total, ship, address, email).catch(
              (e) => console.error('Buyer email error:', e),
            )
          : Promise.resolve(),
      ])
    }

    return NextResponse.json({ init_point: preference.init_point })
  } catch (e: unknown) {
    console.error('Checkout error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}
