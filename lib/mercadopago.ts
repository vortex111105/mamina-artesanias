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
) {
  const client = getMPClient()
  const preference = new Preference(client)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const result = await preference.create({
    body: {
      items: items.map((item) => ({
        id: String(item.product.id),
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        currency_id: 'ARS',
      })),
      payer: payerEmail ? { email: payerEmail } : undefined,
      back_urls: {
        success: `${appUrl}/gracias?order_id=${orderId}`,
        failure: `${appUrl}/carrito?error=true`,
        pending: `${appUrl}/gracias?order_id=${orderId}&pending=true`,
      },
      auto_return: 'approved',
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
