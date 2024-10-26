import Chat from './Chat'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import { Conversation } from './types'
import { useQuery } from '@tanstack/react-query'
import { createConversation, fetchConversations } from './services/conversations'
import { formatDate } from './services/utils'

function App() {
  const [view, setView] = useState<string>('chat')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConv, setCurrentConv] = useState<string>('')

  const { isPending, data } = useQuery({
    queryKey: ['fetchConversations'],
    queryFn: fetchConversations
  })

  useEffect(() => {
    if (data) {
      setConversations(data)
      setCurrentConv(data[0].title)
    }
  }, [isPending, data])

  const addEmptyConversation = () => {
    const today = formatDate(new Date())
    createConversation(`Conversation of ${today}`)
      .then((created: Conversation) => {
        setConversations([...conversations, created])
        setCurrentConv(created.title)
      })
  }

  const renderSettings = () => {
    return (
      <h2 className='text-center p-4 text-2xl text-white font-semibold'>
        Settings
      </h2>
    )
  }

  return (
    <div id="wrapper" className="w-full min-h-screen flex">
      <Sidebar
        conversations={conversations}
        onSwitchConversation={id => setCurrentConv(id)}
        onAddConversation={addEmptyConversation}
        onChatView={() => setView('chat')}
        onSettingsView={() => setView('settings')}>
      </Sidebar>

      <section id="content" className='w-full p-4 flex justify-center'>
        <div>
          {
          view === 'chat'
            ? <Chat conversationId={currentConv}></Chat>
            : renderSettings()
          }
        </div>
      </section>
    </div>
  )
}

export default App
