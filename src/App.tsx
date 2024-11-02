import Chat from './Chat'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import { Conversation } from './types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createConversation, deleteConversation, fetchConversations } from './services/conversations'
import { formatDate } from './services/utils'
import { Popup } from './Popup'

function App() {
  const [view, setView] = useState<string>('chat')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConv, setCurrentConv] = useState<Conversation | null>(null)

  const [toDelete, setToDelete] = useState<Conversation | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const { isPending, data } = useQuery({
    queryKey: ['fetchConversations'],
    queryFn: fetchConversations
  })

  const createMutation = useMutation({
    mutationKey: ['createConversation'],
    mutationFn: (title: string) => createConversation(`Conversation of ${title}`)
  })

  const deleteMutation = useMutation({
    mutationKey: ['deleteConversation'],
    mutationFn: (id: string) => deleteConversation(id)
  })

  useEffect(() => {
    if (data) {
      setConversations(data)
      setCurrentConv(data[0])
    }
  }, [isPending, data])

  const addEmptyConversation = () => {
    createMutation.mutate(formatDate(new Date()));

    if (createMutation.isSuccess) {
      setConversations([...conversations, createMutation.data])
      setCurrentConv(createMutation.data)
    }
  }

  const removeConversation = () => {
    if (toDelete) {
      deleteMutation.mutate(toDelete._id.$oid)
      setConversations(conversations.filter(c => c._id.$oid !== toDelete._id.$oid))
      if (currentConv?._id.$oid === toDelete._id.$oid) {
        setCurrentConv(conversations[0]);
      }
      closePopup()
    }
  }

  const renderSettings = () => {
    return (
      <h2 className='text-center p-4 text-2xl text-white font-semibold'>
        Settings
      </h2>
    )
  }

  return (
    <>
      <div id="wrapper" className="w-full min-h-screen flex">
        <Sidebar
          conversations={conversations}
          onSwitchConversation={conv => setCurrentConv(conv)}
          onAddConversation={addEmptyConversation}
          onRemoveConversation={conv => { setToDelete(conv); openPopup() }}
          onChatView={() => setView('chat')}
          onSettingsView={() => setView('settings')}>
        </Sidebar>

        <section id="content" className='w-full p-4 flex justify-center'>
          <div>
            {
            view === 'chat'
              ? <Chat conversation={currentConv}></Chat>
              : renderSettings()
            }
          </div>
        </section>
      </div>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <h2 className="text-lg font-semibold mb-4">Delete a conversation</h2>
        <p className="text-gray-700">Are you sure you want to delete {toDelete?.title} ?</p>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={removeConversation}
        >
          Delete
        </button>

        <button
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          onClick={closePopup}
        >
          Close
        </button>
      </Popup>
    </>
  )
}

export default App
