import { TelegramSession } from './types'

const sessions = new Map<number, TelegramSession>()

export function getSession(chatId: number): TelegramSession {
  return sessions.get(chatId) ?? { step: 'idle' }
}

export function setSession(chatId: number, session: TelegramSession) {
  sessions.set(chatId, session)
}

export function clearSession(chatId: number) {
  sessions.set(chatId, { step: 'idle' })
}
