import { TelegramSession } from './types'
import { getAdminClient } from './supabase'

export async function getSession(chatId: number): Promise<TelegramSession> {
  const db = getAdminClient()
  const { data } = await db
    .from('bot_sessions')
    .select('data')
    .eq('chat_id', chatId)
    .single()
  return (data?.data as TelegramSession) ?? { step: 'idle' }
}

export async function setSession(chatId: number, session: TelegramSession) {
  const db = getAdminClient()
  await db.from('bot_sessions').upsert(
    { chat_id: chatId, data: session, updated_at: new Date().toISOString() },
    { onConflict: 'chat_id' },
  )
}

export async function clearSession(chatId: number) {
  const db = getAdminClient()
  await db.from('bot_sessions').delete().eq('chat_id', chatId)
}
