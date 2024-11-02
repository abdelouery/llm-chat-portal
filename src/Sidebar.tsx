import { MessageCircle, Bolt, SquarePlus, XIcon } from 'lucide-react'
import { Conversation } from './types'
import { useEffect, useState } from 'react'

type SidebarProps = {
  conversations: Conversation[]
  onSwitchConversation: (conversation: Conversation) => void
  onAddConversation: () => void
  onRemoveConversation: (conversation: Conversation) => void
  onChatView: () => void
  onSettingsView: () => void
}

function Sidebar({
  conversations,
  onSwitchConversation,
  onAddConversation,
  onRemoveConversation,
  onChatView,
  onSettingsView
}: SidebarProps) {

  const [active, setActive] = useState<string>('')

  const applyActive = (c: Conversation) => active === c._id.$oid ? 'text-yellow-600' : 'text-white';

  useEffect(() => {
    if (conversations.length) {
      setActive(conversations[conversations.length - 1]._id.$oid)
    }
  }, [conversations])

  const dataMap = conversations.map(conversation => (
    <div
      key={conversation._id.$oid}
      className={'py-2.5 px-1.5'}
    >
      <XIcon
        className='inline text-red-300 hover:text-red-600 cursor-pointer'
        onClick={ () => onRemoveConversation(conversation) }
      />

      <span
        className={'cursor-pointer hover:text-yellow-800 ' + applyActive(conversation)}
        onClick={() => { onSwitchConversation(conversation); setActive(conversation._id.$oid) }}
      >
        {conversation.title}
      </span>
    </div>
  ))

  return (
    <>
      <div className="fixed up-2 left-0 px-6 py-2">
        {dataMap}

        <div
          onClick={onAddConversation}
          className="text-white py-2.5 px-1.5
          cursor-pointer hover:font-semibold"
        >
          <SquarePlus className='inline'/>
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
