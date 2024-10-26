export type UserAssistantInteraction = {
  role: string
  content: string
}

export type Conversation = {
  _id: object
  title: string
  creation_date: string
  history: UserAssistantInteraction[]
}
