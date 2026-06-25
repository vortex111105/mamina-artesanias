import { NextResponse } from 'next/server'
import { sendTelegramMessage, sendTelegramPhoto, getFileUrl } from '@/lib/telegram'
import { getSession, setSession, clearSession } from '@/lib/bot-sessions'
import { getAdminClient } from '@/lib/supabase'

const ALLOWED_USER_ID = Number(process.env.TELEGRAM_ALLOWED_USER_ID)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const CATEGORIES = [
  'Tejidos',
  'Macramé',
  'Cerámica',
  'Joyería',
  'Decoración',
  'Textiles',
  'Accesorios',
  'Otro',
]

interface TgMessage {
  message_id: number
  from: { id: number; first_name: string }
  chat: { id: number }
  text?: string
  photo?: Array<{ file_id: string; file_size: number }>
}

interface TgUpdate {
  message?: TgMessage
}

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

export async function POST(req: Request) {
  const secret = req.headers.get('x-telegram-bot-api-secret-token')
  if (secret && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let update: TgUpdate
  try {
    update = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

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

  // --- Commands ---
  if (text.startsWith('/')) {
    const [cmd, ...args] = text.split(/\s+/)

    if (cmd === '/start' || cmd === '/ayuda') {
      await sendTelegramMessage(
        chatId,
        `¡Hola! Soy el bot de MAMINA Artesanías 🧶\n\nEnviame una <b>foto</b> para agregar un nuevo producto.\n\nComandos disponibles:\n/mis_productos — Ver los últimos productos\n/ocultar [id] — Ocultar un producto\n/editar_precio [id] [precio] — Cambiar el precio\n/editar_stock [id] [cantidad] — Actualizar el stock\n/cancelar — Cancelar lo que estés haciendo`,
      )
      await clearSession(chatId)
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/cancelar') {
      await clearSession(chatId)
      await sendTelegramMessage(chatId, '✅ Listo, cancelado. Podés empezar de nuevo.')
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
              `• <b>${p.name}</b>${p.category ? ` [${p.category}]` : ''} — $${p.price.toLocaleString('es-AR')} — Stock: ${p.stock} — ${p.visible ? '✅' : '🚫'} — ID: ${p.id}`,
          )
          .join('\n')
        await sendTelegramMessage(chatId, `Últimos productos:\n\n${list}`)
      }
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/ocultar' && args[0]) {
      const db = getAdminClient()
      const { error } = await db
        .from('products')
        .update({ visible: false })
        .eq('id', Number(args[0]))

      await sendTelegramMessage(
        chatId,
        error ? `❌ Error: ${error.message}` : `✅ Producto ${args[0]} ocultado.`,
      )
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/editar_precio' && args[0] && args[1]) {
      const db = getAdminClient()
      const { error } = await db
        .from('products')
        .update({ price: Number(args[1]) })
        .eq('id', Number(args[0]))

      await sendTelegramMessage(
        chatId,
        error
          ? `❌ Error: ${error.message}`
          : `✅ Precio del producto ${args[0]} actualizado a $${Number(args[1]).toLocaleString('es-AR')}.`,
      )
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/editar_stock' && args[0] && args[1]) {
      const db = getAdminClient()
      const { error } = await db
        .from('products')
        .update({ stock: Number(args[1]) })
        .eq('id', Number(args[0]))

      await sendTelegramMessage(
        chatId,
        error
          ? `❌ Error: ${error.message}`
          : `✅ Stock del producto ${args[0]} actualizado a ${args[1]} unidades.`,
      )
      return NextResponse.json({ ok: true })
    }

    await sendTelegramMessage(chatId, 'Comando no reconocido. Usá /ayuda para ver las opciones.')
    return NextResponse.json({ ok: true })
  }

  // --- Photo received: start product upload flow ---
  if (message.photo && message.photo.length > 0) {
    const largest = message.photo[message.photo.length - 1]
    await setSession(chatId, { step: 'awaiting_price', photo_file_id: largest.file_id })
    await sendTelegramMessage(
      chatId,
      '¡Qué hermoso! 😍\n\n¿Cuál es el precio de este producto?\n(Solo el número, ej: <code>2500</code>)',
    )
    return NextResponse.json({ ok: true })
  }

  // --- Conversational flow ---
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
      await sendTelegramMessage(chatId, '❌ El nombre es muy corto, escribí algo más descriptivo.')
      return NextResponse.json({ ok: true })
    }
    await setSession(chatId, { ...session, step: 'awaiting_description', name: text })
    await sendTelegramMessage(
      chatId,
      'Genial 👍 ¿Querés agregar una descripción breve?\n(Materiales, tamaño, colores, etc. O enviá <code>-</code> para saltearlo)',
    )
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'awaiting_description') {
    const description = text === '-' ? undefined : text
    await setSession(chatId, { ...session, step: 'awaiting_category', description })

    const catList = CATEGORIES.map((c, i) => `<b>${i + 1}</b> — ${c}`).join('\n')
    await sendTelegramMessage(
      chatId,
      `¿A qué categoría pertenece este producto?\n\n${catList}\n\nRespondé con el número.`,
    )
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'awaiting_category') {
    const idx = parseInt(text) - 1
    if (isNaN(idx) || idx < 0 || idx >= CATEGORIES.length) {
      await sendTelegramMessage(chatId, `❌ Respondé con un número del 1 al ${CATEGORIES.length}.`)
      return NextResponse.json({ ok: true })
    }
    const category = CATEGORIES[idx]
    await setSession(chatId, { ...session, step: 'awaiting_stock', category })
    await sendTelegramMessage(
      chatId,
      `Categoría: <b>${category}</b> ✅\n\n¿Cuántas unidades tenés disponibles?\n(Enviá <code>0</code> si es "a pedido")`,
    )
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'awaiting_stock') {
    const stock = parseInt(text)
    if (isNaN(stock) || stock < 0) {
      await sendTelegramMessage(chatId, '❌ Ingresá un número válido (0 o más).')
      return NextResponse.json({ ok: true })
    }
    await setSession(chatId, { ...session, step: 'awaiting_delivery', stock })
    await sendTelegramMessage(
      chatId,
      'Métodos de entrega disponibles:\n\n<b>1</b> — Envío por correo\n<b>2</b> — Retiro en tienda\n<b>3</b> — Ambos\n\nRespondé con el número.',
    )
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'awaiting_delivery') {
    const deliveryMap: Record<string, string[]> = {
      '1': ['correo'],
      '2': ['retiro'],
      '3': ['correo', 'retiro'],
    }
    const delivery = deliveryMap[text]
    if (!delivery) {
      await sendTelegramMessage(chatId, '❌ Respondé con 1, 2 o 3.')
      return NextResponse.json({ ok: true })
    }
    await setSession(chatId, { ...session, step: 'awaiting_payment', delivery })
    await sendTelegramMessage(
      chatId,
      '¿Aceptás MercadoPago para este producto?\n\nRespondé <b>sí</b> o <b>no</b>.',
    )
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'awaiting_payment') {
    const acceptsMP = ['sí', 'si', 's', 'yes', 'y'].includes(text.toLowerCase())
    await setSession(chatId, { ...session, step: 'confirming', accepts_mp: acceptsMP })

    const deliveryLabels: Record<string, string> = { correo: 'Envío por correo', retiro: 'Retiro en tienda' }
    const deliveryStr = (session.delivery ?? []).map((d) => deliveryLabels[d] ?? d).join(', ')

    await sendTelegramMessage(
      chatId,
      `Revisá los datos antes de publicar:\n\n🏷️ <b>Nombre:</b> ${session.name}\n🗂️ <b>Categoría:</b> ${session.category ?? '—'}\n💰 <b>Precio:</b> $${session.price?.toLocaleString('es-AR')}\n📝 <b>Descripción:</b> ${session.description ?? '—'}\n📦 <b>Stock:</b> ${session.stock === 0 ? 'A pedido' : session.stock}\n🚚 <b>Entrega:</b> ${deliveryStr}\n💳 <b>MercadoPago:</b> ${acceptsMP ? 'Sí' : 'No'}\n\nRespondé <b>publicar</b> para confirmar o <b>cancelar</b> para descartar.`,
    )
    return NextResponse.json({ ok: true })
  }

  if (session.step === 'confirming') {
    if (['cancelar', 'no', 'n'].includes(text.toLowerCase())) {
      await clearSession(chatId)
      await sendTelegramMessage(chatId, '❌ Producto descartado. Podés empezar de nuevo enviando otra foto.')
      return NextResponse.json({ ok: true })
    }

    if (['publicar', 'sí', 'si', 's', 'yes'].includes(text.toLowerCase())) {
      try {
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
          return NextResponse.json({ ok: true })
        }

        await clearSession(chatId)
        const productUrl = `${APP_URL}/tienda/${product.id}`

        if (imageUrl) {
          await sendTelegramPhoto(
            chatId,
            imageUrl,
            `✅ ¡Producto publicado en ${session.category ?? 'Sin categoría'}!\n\n🔗 ${productUrl}`,
          )
        } else {
          await sendTelegramMessage(
            chatId,
            `✅ ¡Producto publicado en ${session.category ?? 'Sin categoría'}!\n\n🔗 ${productUrl}`,
          )
        }
      } catch (e) {
        console.error('Bot publish error:', e)
        await sendTelegramMessage(chatId, '❌ Hubo un error al publicar. Intentá de nuevo.')
      }
      return NextResponse.json({ ok: true })
    }

    await sendTelegramMessage(chatId, 'Respondé <b>publicar</b> para confirmar o <b>cancelar</b> para descartar.')
    return NextResponse.json({ ok: true })
  }

  await sendTelegramMessage(
    chatId,
    'Enviame una <b>foto</b> para agregar un nuevo producto, o usá /ayuda para ver los comandos.',
  )
  return NextResponse.json({ ok: true })
}
