/**
 * Registra el webhook del bot de Telegram en Vercel
 * Uso: node scripts/setup-webhook.mjs
 * Requiere TELEGRAM_BOT_TOKEN, NEXT_PUBLIC_APP_URL y TELEGRAM_WEBHOOK_SECRET
 */
const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const APP_URL = process.env.NEXT_PUBLIC_APP_URL
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET

if (!TOKEN || !APP_URL) {
  console.error('Falta TELEGRAM_BOT_TOKEN o NEXT_PUBLIC_APP_URL')
  process.exit(1)
}

const webhookUrl = `${APP_URL}/api/telegram`

const res = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: webhookUrl, secret_token: SECRET || undefined }),
})

const data = await res.json()
if (data.ok) {
  console.log('✅ Webhook registrado en:', webhookUrl)
} else {
  console.error('❌ Error:', data.description)
}
