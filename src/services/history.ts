import { UserAssistantInteraction } from '../types';
import { request } from './request'

const url = import.meta.env.DEV ? 'api' : 'http://localhost:8000/api'

export async function fetchHistory(id: string) {
  return await request<UserAssistantInteraction[]>(`${url}/history/${id}`);
}

export async function sendPrompt(conversationId: string, content: string) {
  return await fetch(
    `${url}/api/prompt/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'user', content })
    }
  )
}
