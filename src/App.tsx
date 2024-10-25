import Chat from './Chat'
import { request } from './request'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import { Conversation } from './types'

function App() {
  const [view, setView] = useState<string>('chat')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConv, setCurrentConv] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    request<Conversation[]>(`http://localhost:8000/api/conversations`)
      .then(data => {
        setConversations(data)
        setCurrentConv(data[0].title)
        setIsLoading(false)
      }
    )
  }, [])

  const addEmptyConversation = () => {
    request<Conversation>(
      `http://localhost:8000/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: "New",
          creation_date: "25-10-2025",
          history: []
        })
      }
    ).then(data => setConversations([...conversations, data]))
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

      { !isLoading &&
        <section id="content" className='w-full p-4 flex justify-center'>
          <div>
            {view === 'chat' ? <Chat conversationId={currentConv}></Chat> : renderSettings()}
          </div>
        </section> }
    </div>
  )
}

export default App
