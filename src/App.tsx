import Chat from './Chat'
import Sidebar from './Sidebar'
import { useState } from 'react'


function App() {
  const [view, setView] = useState<string>('chat')

  function renderSettings() {
    return (
      <h2>Settings</h2>
    )
  }

  return (
    <div id="wrapper">
      <Sidebar
        onChatView={() => setView('chat')}
        onSettingsView={() => setView('settings')}>
      </Sidebar>

      <section id="content">
        {view === 'chat' ? <Chat></Chat> : renderSettings()}
      </section>
    </div>
  )
}

export default App
