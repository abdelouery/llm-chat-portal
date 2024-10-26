import { Conversation } from '../types'
import { request } from './request'
import { formatDate } from './utils';

const url = import.meta.env.DEV ? 'api' : 'http://localhost:8000/api'

export async function fetchConversations() {
  return await request<Conversation[]>(`${url}/conversations`);
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
