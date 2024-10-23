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
    <nav className="bg-gray-900 p-6 h-screen w-48">
      <ul className="flex-column">
        <li
          onClick={onChatView}
          className="text-white py-2.5 px-1.5
          cursor-pointer hover:font-semibold"
        >
          Chat
        </li>
        <li
          onClick={onSettingsView}
          className="text-white py-2.5 px-1.5
          cursor-pointer hover:font-semibold"
        >
          Settings
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar
