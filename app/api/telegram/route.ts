import { NextResponse } from 'next/server'
import {
  sendTelegramMessage,
  sendTelegramPhoto,
  sendMessageWithButtons,
  answerCallbackQuery,
  editMessage,
  getFileUrl,
} from '@/lib/telegram'
import { getSession, setSession, clearSession } from '@/lib/bot-sessions'
import { getAdminClient } from '@/lib/supabase'

const ALLOWED_USER_ID = Number(process.env.TELEGRAM_ALLOWED_USER_ID)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const CATEGORIES = ['Tazas', 'Combos', 'Bandejas', 'Gres']

// Teclados inline reutilizables
const KB_DELIVERY = [[
  { text: '📦 Correo', callback_data: 'del:correo' },
  { text: '🏪 Retiro', callback_data: 'del:retiro' },
  { text: '✅ Ambos', callback_data: 'del:ambos' },
]]

const KB_PAYMENT = [[
  { text: '✅ Sí, acepta MP', callback_data: 'mp:si' },
  { text: '❌ No', callback_data: 'mp:no' },
]]

const KB_CONFIRM = [[
  { text: '🚀 Publicar', callback_data: 'pub:si' },
  { text: '🗑 Cancelar', callback_data: 'pub:no' },
]]

// Categorías: 2 por fila
const KB_CATEGORIES = CATEGORIES.reduce<{ text: string; callback_data: string }[][]>(
  (rows, cat, i) => {
    if (i % 2 === 0) rows.push([])
    rows[rows.length - 1].push({ text: cat, callback_data: `cat:${cat}` })
    return rows
  },
  [],
)

async function uploadImageFromTelegram(fileId: string): Promise<string> {
  const fileUrl = await getFileUrl(fileId)
  const imageRes = await fetch(fileUrl)
  const blob = await imageRes.blob()
  const arrayBuffer = await blob.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const db = getAdminClient()
  const filename = `product-${Date.now()}.jpg`
  const { error } = await db.storage
    .from('product-images')
    .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

  if (error) throw new Error(`Storage error: ${error.message}`)

  const { data: urlData } = db.storage.from('product-images').getPublicUrl(filename)
  return urlData.publicUrl
}

async function publishProduct(chatId: number, session: Awaited<ReturnType<typeof getSession>>) {
  await sendTelegramMessage(chatId, '⏳ Subiendo imagen y publicando...')

  let imageUrl: string | null = null
  if (session.photo_file_id) {
    imageUrl = await uploadImageFromTelegram(session.photo_file_id)
  }

  const db = getAdminClient()
  const { data: product, error } = await db
    .from('products')
    .insert({
      name: session.name,
      description: session.description ?? null,
      price: session.price,
      stock: session.stock ?? 0,
      image_url: imageUrl,
      category: session.category ?? null,
      delivery: session.delivery ?? ['retiro'],
      accepts_mp: session.accepts_mp ?? true,
      visible: true,
    })
    .select()
    .single()

  if (error) {
    await sendTelegramMessage(chatId, `❌ Error al guardar: ${error.message}`)
    return
  }

  await clearSession(chatId)
  const productUrl = `${APP_URL}/tienda/${product.id}`
  const msg = `✅ <b>¡Publicado!</b>\n\n🔗 ${productUrl}`

  if (imageUrl) {
    await sendTelegramPhoto(chatId, imageUrl, msg)
  } else {
    await sendTelegramMessage(chatId, msg)
  }
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-telegram-bot-api-secret-token')
  if (secret && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let update: {
    message?: {
      message_id: number
      from: { id: number; first_name: string }
      chat: { id: number }
      text?: string
      photo?: Array<{ file_id: string; file_size: number }>
    }
    callback_query?: {
      id: string
      from: { id: number }
      message: { chat: { id: number }; message_id: number }
      data: string
    }
  }

  try {
    update = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  // ── CALLBACK QUERY (botones inline) ────────────────────────────────
  if (update.callback_query) {
    const cb = update.callback_query
    const chatId = cb.message.chat.id
    const userId = cb.from.id
    const data = cb.data
    const msgId = cb.message.message_id

    await answerCallbackQuery(cb.id)

    if (userId !== ALLOWED_USER_ID) return NextResponse.json({ ok: true })

    const session = await getSession(chatId)

    // Categoría
    if (data.startsWith('cat:') && session.step === 'awaiting_category') {
      const category = data.replace('cat:', '')
      await editMessage(chatId, msgId, `🗂 Categoría: <b>${category}</b> ✅`)
      await setSession(chatId, { ...session, step: 'awaiting_stock', category })
      await sendTelegramMessage(
        chatId,
        '¿Cuántas unidades tenés disponibles?\n(Enviá <code>0</code> si es "a pedido")',
      )
      return NextResponse.json({ ok: true })
    }

    // Método de entrega
    if (data.startsWith('del:') && session.step === 'awaiting_delivery') {
      const key = data.replace('del:', '')
      const deliveryMap: Record<string, string[]> = {
        correo: ['correo'],
        retiro: ['retiro'],
        ambos: ['correo', 'retiro'],
      }
      const labels: Record<string, string> = {
        correo: '📦 Envío por correo',
        retiro: '🏪 Retiro en tienda',
        ambos: '📦 Correo + 🏪 Retiro',
      }
      const delivery = deliveryMap[key]
      await editMessage(chatId, msgId, `🚚 Entrega: <b>${labels[key]}</b> ✅`)
      await setSession(chatId, { ...session, step: 'awaiting_payment', delivery })
      await sendMessageWithButtons(chatId, '¿Aceptás MercadoPago para este producto?', KB_PAYMENT)
      return NextResponse.json({ ok: true })
    }

    // MercadoPago
    if (data.startsWith('mp:') && session.step === 'awaiting_payment') {
      const acceptsMP = data === 'mp:si'
      await editMessage(chatId, msgId, `💳 MercadoPago: <b>${acceptsMP ? 'Sí ✅' : 'No ❌'}</b>`)
      await setSession(chatId, { ...session, step: 'confirming', accepts_mp: acceptsMP })

      const deliveryLabels: Record<string, string> = {
        correo: 'Envío por correo',
        retiro: 'Retiro en tienda',
      }
      const deliveryStr = (session.delivery ?? []).map((d) => deliveryLabels[d] ?? d).join(' + ')

      await sendMessageWithButtons(
        chatId,
        `Revisá el producto antes de publicarlo:\n\n` +
          `🏷️ <b>${session.name}</b>\n` +
          `🗂️ ${session.category ?? '—'} · 💰 $${session.price?.toLocaleString('es-AR')}\n` +
          `📦 Stock: ${session.stock === 0 ? 'A pedido' : session.stock}\n` +
          `🚚 ${deliveryStr}\n` +
          `💳 MP: ${acceptsMP ? 'Sí' : 'No'}\n` +
          (session.description ? `\n📝 ${session.description}` : ''),
        KB_CONFIRM,
      )
      return NextResponse.json({ ok: true })
    }

    // Publicar / Cancelar
    if (data.startsWith('pub:') && session.step === 'confirming') {
      if (data === 'pub:no') {
        await editMessage(chatId, msgId, '🗑 Producto descartado.')
        await clearSession(chatId)
        await sendTelegramMessage(chatId, 'Listo. Mandame otra foto cuando quieras cargar un producto.')
        return NextResponse.json({ ok: true })
      }

      if (data === 'pub:si') {
        await editMessage(chatId, msgId, '⏳ Publicando...')
        try {
          await publishProduct(chatId, session)
        } catch (e) {
          console.error('Bot publish error:', e)
          await sendTelegramMessage(chatId, '❌ Hubo un error al publicar. Intentá de nuevo.')
        }
        return NextResponse.json({ ok: true })
      }
    }

    return NextResponse.json({ ok: true })
  }

  // ── MESSAGE ────────────────────────────────────────────────────────
  const message = update.message
  if (!message) return NextResponse.json({ ok: true })

  const chatId = message.chat.id
  const userId = message.from.id
  const text = message.text?.trim() ?? ''

  if (userId !== ALLOWED_USER_ID) {
    await sendTelegramMessage(chatId, '⛔ No estás autorizada para usar este bot.')
    return NextResponse.json({ ok: true })
  }

  const session = await getSession(chatId)

  // Comandos
  if (text.startsWith('/')) {
    const [cmd, ...args] = text.split(/\s+/)

    if (cmd === '/start' || cmd === '/ayuda') {
      await clearSession(chatId)
      await sendTelegramMessage(
        chatId,
        '¡Hola! Soy el bot de MAMINA Artesanías 🧶\n\n' +
          'Enviame una <b>foto</b> para agregar un nuevo producto.\n\n' +
          'Comandos disponibles:\n' +
          '/mis_productos — Ver los últimos productos\n' +
          '/ocultar [id] — Ocultar un producto\n' +
          '/editar_precio [id] [precio] — Cambiar el precio\n' +
          '/editar_stock [id] [cantidad] — Actualizar el stock\n' +
          '/cancelar — Cancelar lo que estés haciendo',
      )
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/cancelar') {
      await clearSession(chatId)
      await sendTelegramMessage(chatId, '✅ Cancelado. Mandame una foto para empezar de nuevo.')
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/mis_productos') {
      const db = getAdminClient()
      const { data } = await db
        .from('products')
        .select('id, name, price, stock, category, visible')
        .order('created_at', { ascending: false })
        .limit(10)

      if (!data || data.length === 0) {
        await sendTelegramMessage(chatId, 'Todavía no hay productos cargados.')
      } else {
        const list = data
          .map(
            (p) =>
              `• <b>${p.name}</b>${p.category ? ` [${p.category}]` : ''} — $${p.price.toLocaleString('es-AR')} — Stock: ${p.stock} ${p.visible ? '✅' : '🚫'} — ID: ${p.id}`,
          )
          .join('\n')
        await sendTelegramMessage(chatId, `Últimos productos:\n\n${list}`)
      }
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/ocultar' && args[0]) {
      const db = getAdminClient()
      const { error } = await db.from('products').update({ visible: false }).eq('id', Number(args[0]))
      await sendTelegramMessage(chatId, error ? `❌ Error: ${error.message}` : `✅ Producto ${args[0]} ocultado.`)
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/editar_precio' && args[0] && args[1]) {
      const db = getAdminClient()
      const { error } = await db.from('products').update({ price: Number(args[1]) }).eq('id', Number(args[0]))
      await sendTelegramMessage(
        chatId,
        error ? `❌ Error: ${error.message}` : `✅ Precio del producto ${args[0]} actualizado a $${Number(args[1]).toLocaleString('es-AR')}.`,
      )
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/editar_stock' && args[0] && args[1]) {
      const db = getAdminClient()
      const { error } = await db.from('products').update({ stock: Number(args[1]) }).eq('id', Number(args[0]))
      await sendTelegramMessage(
        chatId,
        error ? `❌ Error: ${error.message}` : `✅ Stock del producto ${args[0]} actualizado a ${args[1]} unidades.`,
      )
      return NextResponse.json({ ok: true })
    }

    await sendTelegramMessage(chatId, 'Comando no reconocido. Usá /ayuda para ver las opciones.')
    return NextResponse.json({ ok: true })
  }

  // Foto → arrancar el flujo
  if (message.photo && message.photo.length > 0) {
    const largest = message.photo[message.photo.length - 1]
    await setSession(chatId, { step: 'awaiting_price', photo_file_id: largest.file_id })
    await sendTelegramMessage(
      chatId,
      '¡Qué hermoso! 😍\n\n¿Cuál es el precio?\n(Solo el número, ej: <code>2500</code>)',
    )
    return NextResponse.json({ ok: true })
  }

  // Flujo conversacional (solo pasos que requieren texto)
  if (session.step === 'awaiting_price') {
    const price = parseFloat(text.replace(',', '.'))
    if (isNaN(price) || price <= 0) {
      await sendTelegramMessage(chatId, '❌ Ingresá un precio válido. Ej: <code>1500</code>')
      return NextResponse.json({ ok: true })
    }
    await setSession(chatId, { ...session, step: 'awaiting_name', price })
    await sendTelegramMessage(chatId, '¿Cómo se llama este producto?')
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'awaiting_name') {
    if (text.length < 2) {
      await sendTelegramMessage(chatId, '❌ El nombre es muy corto.')
      return NextResponse.json({ ok: true })
    }
    await setSession(chatId, { ...session, step: 'awaiting_description', name: text })
    await sendTelegramMessage(
      chatId,
      '¿Querés agregar una descripción?\n(Materiales, tamaño, colores… o enviá <code>-</code> para saltearlo)',
    )
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'awaiting_description') {
    const description = text === '-' ? undefined : text
    await setSession(chatId, { ...session, step: 'awaiting_category', description })
    await sendMessageWithButtons(chatId, '¿A qué categoría pertenece?', KB_CATEGORIES)
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'awaiting_stock') {
    const stock = parseInt(text)
    if (isNaN(stock) || stock < 0) {
      await sendTelegramMessage(chatId, '❌ Ingresá un número válido (0 o más).')
      return NextResponse.json({ ok: true })
    }
    await setSession(chatId, { ...session, step: 'awaiting_delivery', stock })
    await sendMessageWithButtons(chatId, '¿Cómo se puede recibir este producto?', KB_DELIVERY)
    return NextResponse.json({ ok: true })
  }

  await sendTelegramMessage(
    chatId,
    'Enviame una <b>foto</b> para agregar un nuevo producto, o usá /ayuda.',
  )
  return NextResponse.json({ ok: true })
}
