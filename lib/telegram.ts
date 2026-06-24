const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

export async function sendTelegramMessage(chatId: number | string, text: string) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
  return res.json()
}

export async function sendTelegramPhoto(
  chatId: number | string,
  photo: string,
  caption?: string,
) {
  const res = await fetch(`${TELEGRAM_API}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, photo, caption, parse_mode: 'HTML' }),
  })
  return res.json()
}

export async function getFileUrl(fileId: string): Promise<string> {
  const res = await fetch(`${TELEGRAM_API}/getFile?file_id=${fileId}`)
  const data = await res.json()
  const filePath = data.result?.file_path
  return `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`
}

export async function notifyAdmin(message: string) {
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!adminChatId) return
  return sendTelegramMessage(adminChatId, message)
}
