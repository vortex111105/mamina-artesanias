import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import { CartItem } from './types'

function getMPClient() {
  return new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  })
}

export async function createPreference(
  items: CartItem[],
  orderId: number,
  payerEmail?: string,
  shippingCost = 0,
) {
  const client = getMPClient()
  const preference = new Preference(client)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const mpItems = items.map((item) => ({
    id: String(item.product.id),
    title: item.product.name,
    quantity: item.quantity,
    unit_price: item.product.price,
    currency_id: 'ARS',
  }))

  if (shippingCost > 0) {
    mpItems.push({
      id: 'envio',
      title: 'Costo de envío',
      quantity: 1,
      unit_price: shippingCost,
      currency_id: 'ARS',
    })
  }

  const result = await preference.create({
    body: {
      items: mpItems,
      payer: payerEmail ? { email: payerEmail } : undefined,
      back_urls: {
        success: `${appUrl}/gracias?order_id=${orderId}`,
        failure: `${appUrl}/carrito?error=true`,
        pending: `${appUrl}/gracias?order_id=${orderId}&pending=true`,
      },
      auto_return: 'approved',
      notification_url: `${appUrl}/api/mercadopago/webhook`,
      external_reference: String(orderId),
    },
  })

  return result
}

export async function getPayment(paymentId: string) {
  const client = getMPClient()
  const payment = new Payment(client)
  return payment.get({ id: paymentId })
}
