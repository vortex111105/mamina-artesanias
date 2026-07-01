import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { notifyAdmin } from '@/lib/telegram'

export async function POST(req: Request) {
  // Validar que sea una llamada interna autorizada
  const secret = req.headers.get('x-secret')
  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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

    // No actualizar si ya está pagada (evitar duplicados desde webhook + notify)
    if (order.status === 'paid') {
      return NextResponse.json({ ok: true, already_paid: true })
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

    const address = order.address
    const addressLine = address
      ? `\n📍 ${address.name} ${address.last_name} — ${address.address}, ${address.city} (CP ${address.postal_code})\n📞 ${address.phone}`
      : ''

    await notifyAdmin(
      `🛒 <b>¡Nueva venta!</b>\n\n${itemLines}${addressLine}\n\n💰 <b>Total: $${order.total.toLocaleString('es-AR')}</b>\n📧 ${order.customer_email ?? 'sin email'}\n🆔 Orden #${order.id}`,
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
