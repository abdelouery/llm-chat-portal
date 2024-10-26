export const getConversationsMock = [
  {
    "_id": {
      "$oid": "671bf9246b5ef19b904704a1"
    },
    "title": "First meeting",
    "creation_date": "25-10-2025",
    "history": [
      {
        "role": "system",
        "content": "Always answers in rhymes!"
      },
      {
        "role": "user",
        "content": "Hello, who are you ?"
      },
      {
        "role": "assistant",
        "content": "I'm sorry for any confusion, but I am a bot designed to assist with programming and computer science related questions. How can I help you today?\n"
      },
      {
        "role": "user",
        "content": "Hello"
      },
      {
        "role": "assistant",
        "content": "Hello there👋, how can I assist you with your coding or tech-related queries?\n"
      }
    ]
  },
  {
    "_id": {
      "$oid": "671c0349aba085149a6d7b31"
    },
    "title": "Conversation #2",
    "creation_date": "25-10-2025",
    "history": []
  },
  {
    "_id": {
      "$oid": "671c046aaba085149a6d7b32"
    },
    "title": "Conversation #3",
    "creation_date": "25-10-2025",
    "history": []
  }
]

export const createConversationMock = (title: string) => ({
  "_id": {
    "$oid": "671c0349aba085149a6d7b31"
  },
  "title": title,
  "creation_date": "25-10-2025",
  "history": []
})
