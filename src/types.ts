export type UserAssistantInteraction = {
  role: string
  content: string
}

type ObjectId = {
  $oid: string
}

export type Conversation = {
  _id: ObjectId
  title: string
  creation_date: string
  history: UserAssistantInteraction[]
}
