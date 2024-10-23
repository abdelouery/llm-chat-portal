import { MessageCircle, Bolt } from 'lucide-react'

type SidebarProps = {
  onChatView: () => void
  onSettingsView: () => void
}

function Sidebar({ onChatView, onSettingsView }: SidebarProps) {

  // function toggleTheme() {
  //   const current = document.documentElement.getAttribute('data-bs-theme')
  //   document.documentElement.setAttribute('data-bs-theme', current === 'light' ? 'dark' : 'light')
  //   localStorage.setItem('theme', document.documentElement.getAttribute('data-bs-theme')!)
  // }

  return (
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
  )
}

export default Sidebar
