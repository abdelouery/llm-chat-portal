import { UserAssistantInteraction } from '../types'
import { CONFIG } from './config'
import { request } from './request'

const url = CONFIG.useMocks ? 'api' : 'http://localhost:8000/api'

export async function fetchHistory(id: string | undefined) {
  return await request<UserAssistantInteraction[]>(`${url}/history/${id}`)
}

export async function sendPrompt(conversationId: string | undefined, content: string) {
  return await fetch(
    `${url}/prompt/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'user', content })
    }
  )
}
