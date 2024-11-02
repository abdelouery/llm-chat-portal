import { Conversation } from '../types'
import { CONFIG } from './config'
import { request } from './request'
import { formatDate } from './utils'

const url = CONFIG.useMocks ? 'api' : 'http://localhost:8000/api'

export async function fetchConversations() {
  return await request<Conversation[]>(`${url}/conversations`)
}

export async function createConversation(title: string) {
  return await request<Conversation>(`${url}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      creation_date: formatDate(new Date()),
      history: []
    })
  })
}

export async function deleteConversation(id: string) {
  return await request<Conversation>(`${url}/conversations/${id}`, {
    method: 'DELETE'
  })
}
