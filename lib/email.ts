import { Resend } from 'resend'
import { CartItem, OrderAddress } from './types'

function formatItems(items: CartItem[]): string {
  return items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8D5C4;">${i.product.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8D5C4;text-align:center;">x${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8D5C4;text-align:right;">$${(i.product.price * i.quantity).toLocaleString('es-AR')}</td>
        </tr>`,
    )
    .join('')
}

export async function sendAdminNewOrder(
  orderId: number,
  items: CartItem[],
  total: number,
  shippingCost: number,
  address: OrderAddress,
  customerEmail: string | null,
) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM_EMAIL || 'MAMINA Artesanías <noreply@mamina.com>'
  const itemsHtml = formatItems(items)
  const addressStr = `${address.address}, ${address.city}, ${address.province} (CP: ${address.postal_code})`

  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `🛒 Nueva venta #${orderId} — $${total.toLocaleString('es-AR')}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#5C3D2E;background:#FFF8F0;padding:32px;border-radius:12px;">
        <h1 style="color:#C4714B;font-size:24px;margin-bottom:4px;">¡Nueva venta! 🎉</h1>
        <p style="color:#8B6355;margin-top:0;">Orden #${orderId}</p>

        <h3 style="border-bottom:2px solid #E8D5C4;padding-bottom:8px;">Productos</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="color:#8B6355;font-size:13px;">
              <th style="text-align:left;padding-bottom:8px;">Producto</th>
              <th style="text-align:center;padding-bottom:8px;">Cant.</th>
              <th style="text-align:right;padding-bottom:8px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:right;margin-top:8px;color:#8B6355;font-size:14px;">
          Envío: $${shippingCost.toLocaleString('es-AR')}
        </div>
        <div style="text-align:right;font-size:20px;font-weight:bold;color:#C4714B;margin-top:4px;">
          Total: $${total.toLocaleString('es-AR')}
        </div>

        <h3 style="border-bottom:2px solid #E8D5C4;padding-bottom:8px;margin-top:24px;">Datos de envío</h3>
        <p style="margin:4px 0;"><strong>Nombre:</strong> ${address.name} ${address.last_name}</p>
        <p style="margin:4px 0;"><strong>Dirección:</strong> ${addressStr}</p>
        <p style="margin:4px 0;"><strong>Teléfono:</strong> ${address.phone}</p>
        ${customerEmail ? `<p style="margin:4px 0;"><strong>Email:</strong> ${customerEmail}</p>` : ''}
      </div>
    `,
  })
}

export async function sendBuyerConfirmation(
  orderId: number,
  items: CartItem[],
  total: number,
  shippingCost: number,
  address: OrderAddress,
  customerEmail: string,
) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM_EMAIL || 'MAMINA Artesanías <noreply@mamina.com>'
  const itemsHtml = formatItems(items)

  await resend.emails.send({
    from,
    to: customerEmail,
    subject: `Tu pedido en MAMINA Artesanías — Orden #${orderId}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#5C3D2E;background:#FFF8F0;padding:32px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:48px;">🧶</div>
          <h1 style="color:#C4714B;font-size:24px;margin:8px 0;">¡Gracias por tu compra!</h1>
          <p style="color:#8B6355;margin:0;">Recibimos tu pedido y lo estamos preparando con amor.</p>
        </div>

        <h3 style="border-bottom:2px solid #E8D5C4;padding-bottom:8px;">Tu pedido #${orderId}</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="color:#8B6355;font-size:13px;">
              <th style="text-align:left;padding-bottom:8px;">Producto</th>
              <th style="text-align:center;padding-bottom:8px;">Cant.</th>
              <th style="text-align:right;padding-bottom:8px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:right;margin-top:8px;color:#8B6355;font-size:14px;">
          Envío: $${shippingCost.toLocaleString('es-AR')}
        </div>
        <div style="text-align:right;font-size:20px;font-weight:bold;color:#C4714B;margin-top:4px;">
          Total: $${total.toLocaleString('es-AR')}
        </div>

        <h3 style="border-bottom:2px solid #E8D5C4;padding-bottom:8px;margin-top:24px;">Dirección de envío</h3>
        <p style="margin:4px 0;">${address.name} ${address.last_name}</p>
        <p style="margin:4px 0;">${address.address}</p>
        <p style="margin:4px 0;">${address.city}, ${address.province} — CP ${address.postal_code}</p>
        <p style="margin:4px 0;">Tel: ${address.phone}</p>

        <p style="color:#8B6355;font-size:13px;margin-top:24px;text-align:center;">
          Nos pondremos en contacto para coordinar la entrega. ¡Gracias por elegirnos! 🤍
        </p>
      </div>
    `,
  })
}
