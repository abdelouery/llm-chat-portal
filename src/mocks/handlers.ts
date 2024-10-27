import { http, HttpResponse } from 'msw'
import { getConversationsMock, createConversationMock } from './conversationsMock'
import { getHistoryMock } from './historyMock'
import { Conversation } from '../types'

export const handlers = [
  http.get('api/conversations', () => {
    return HttpResponse.json(getConversationsMock, { status: 200 })
  }),

  http.post('api/conversations', async ({ request }) => {
    const body = await request.json()

    return HttpResponse.json(createConversationMock((body as Conversation).title), { status: 200 })
  }),

  http.get('api/history/:id', () => {
    return HttpResponse.json(getHistoryMock, { status: 200 })
  })
]
