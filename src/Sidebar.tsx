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
    <nav className="">
      <ul className="flex-column">
        <li onClick={onChatView}>Chat</li>
        <li onClick={onSettingsView}>Settings</li>
      </ul>
    </nav>
  )
}

export default Sidebar
