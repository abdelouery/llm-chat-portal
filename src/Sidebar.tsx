import { MessageCircle, Bolt, MessageSquareText, SquarePlus } from 'lucide-react'
import { Conversation } from './types'
import { useEffect, useState } from 'react'

type SidebarProps = {
  conversations: Conversation[]
  onSwitchConversation: (conversation: Conversation) => void
  onAddConversation: () => void
  onChatView: () => void
  onSettingsView: () => void
}

function Sidebar({
  conversations,
  onSwitchConversation,
  onAddConversation,
  onChatView,
  onSettingsView
}: SidebarProps) {

  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (conversations.length) {
      setActive(conversations[conversations.length - 1]._id.$oid)
    }
  }, [conversations])

  const dataMap = conversations.map(conversation => (
    <div
      key={conversation._id.$oid}
      onClick={() => { onSwitchConversation(conversation); setActive(conversation._id.$oid) }}
      className={'py-2.5 px-1.5 cursor-pointer hover:font-semibold ' + (active === conversation._id.$oid ? 'text-yellow-600' : 'text-white')}
    >
      <MessageSquareText className='inline'/>
      {conversation.title}
    </div>
  ))

  return (
    <>
      <div className="fixed up-2 left-0 px-6 py-2">
        {dataMap}

        <div
          onClick={onAddConversation}
          className="text-green-600 py-2.5 px-1.5
          cursor-pointer hover:font-semibold"
        >
          <SquarePlus className='inline'/>
          Add Conversation
        </div>
      </div>
      <div className="fixed bottom-2 left-0 px-6 py-2">
        <div
          onClick={onChatView}
          className="text-white py-2.5 px-1.5
          cursor-pointer hover:font-semibold"
        >
          <MessageCircle />
        </div>

        <div
          onClick={onSettingsView}
          className="text-white py-2.5 px-1.5
          cursor-pointer hover:font-semibold"
        >
          <Bolt />
        </div>
      </div>
    </>
  )
}

export default Sidebar
