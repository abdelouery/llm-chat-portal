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
    <div id="wrapper" className="w-full min-h-screen flex">
      <Sidebar
        onChatView={() => setView('chat')}
        onSettingsView={() => setView('settings')}>
      </Sidebar>
      <section id="content" className='w-full p-4 flex justify-center'> 
        <div> 
          {view === 'chat' ? <Chat></Chat> : renderSettings()}
        </div>
      </section>
    </div>
  )
}

export default App
