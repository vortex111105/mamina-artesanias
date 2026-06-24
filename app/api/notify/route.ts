import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { notifyAdmin } from '@/lib/telegram'

export async function POST(req: Request) {
  try {
    const { order_id, payment_id } = await req.json()
    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    const db = getAdminClient()
    const { data: order } = await db
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    await db
      .from('orders')
      .update({ status: 'paid', mp_payment_id: payment_id ?? null })
      .eq('id', order_id)

    const itemLines = order.items
      .map(
        (i: { product: { name: string; price: number }; quantity: number }) =>
          `  • ${i.product.name} x${i.quantity} — $${(i.product.price * i.quantity).toLocaleString('es-AR')}`,
      )
      .join('\n')

    await notifyAdmin(
      `🛒 <b>¡Nueva venta!</b>\n\n${itemLines}\n\n💰 <b>Total: $${order.total.toLocaleString('es-AR')}</b>\n📧 ${order.customer_email ?? 'sin email'}\n🆔 Orden #${order.id}`,
    )

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error('Notify error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}
