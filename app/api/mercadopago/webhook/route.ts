import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { getPayment } from '@/lib/mercadopago'
import { notifyAdmin } from '@/lib/telegram'

export async function POST(req: Request) {
  try {
    // Verificar firma del webhook de MercadoPago
    const xSignature = req.headers.get('x-signature')
    const xRequestId = req.headers.get('x-request-id')
    const secret = process.env.MP_WEBHOOK_SECRET

    if (secret && xSignature) {
      // Validación de firma MP: ts.v1=hash
      // https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
      const url = new URL(req.url)
      const dataId = url.searchParams.get('data.id') ?? ''
      const ts = xSignature.split(',').find((s) => s.startsWith('ts='))?.split('=')[1] ?? ''
      const v1 = xSignature.split(',').find((s) => s.startsWith('v1='))?.split('=')[1] ?? ''

      const manifest = `id:${dataId};request-id:${xRequestId ?? ''};ts:${ts};`
      const { createHmac } = await import('crypto')
      const expected = createHmac('sha256', secret).update(manifest).digest('hex')

      if (expected !== v1) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const body = await req.json()
    const { type, data } = body

    if (type !== 'payment' || !data?.id) {
      return NextResponse.json({ ok: true })
    }

    const payment = await getPayment(String(data.id))
    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true })
    }

    const orderId = payment.external_reference
    if (!orderId) return NextResponse.json({ ok: true })

    const db = getAdminClient()
    const { data: order } = await db
      .from('orders')
      .select('*')
      .eq('id', Number(orderId))
      .single()

    if (!order || order.status === 'paid') {
      return NextResponse.json({ ok: true })
    }

    await db
      .from('orders')
      .update({ status: 'paid', mp_payment_id: String(data.id) })
      .eq('id', Number(orderId))

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
      `✅ <b>Pago confirmado por MP!</b>\n\n${itemLines}${addressLine}\n\n💰 <b>Total: $${order.total.toLocaleString('es-AR')}</b>\n📧 ${order.customer_email ?? 'sin email'}\n🆔 Orden #${order.id}`,
    )

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error('MP Webhook error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}
