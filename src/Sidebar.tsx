import { MessageCircle, Bolt, MessageSquareText, SquarePlus } from 'lucide-react'
import { Conversation } from './types'

type SidebarProps = {
  conversations: Conversation[]
  onSwitchConversation: (conversationId: string) => void
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

  const dataMap = conversations.map((conversation, index) => (
    <div
      key={index}
      onClick={() => onSwitchConversation(conversation.title)}
      className="text-white py-2.5 px-1.5
      cursor-pointer hover:font-semibold"
    >
      {conversation.title}
      <MessageSquareText />
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
          Add Conversation
          <SquarePlus />
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
