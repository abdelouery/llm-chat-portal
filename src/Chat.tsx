import { ArrowUp } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import myData from './data.json'

type UserAssistantInteraction = {
  user: string
  assistant: string
}

export default function Chat() {
  const [data, setData] = useState<UserAssistantInteraction[]>([])
  const [prompt, setPrompt] = useState<string>('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setData(myData)
  }, [])

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [data])

  // Gérer l'apparition/disparition du bouton de scroll
  const handleScroll = () => {
    if (historyRef.current) {
      const scrollTop = historyRef.current.scrollTop
      setShowScrollTop(scrollTop > 100) // Afficher après 100px de scroll
    }
  }

  // Ajouter l'événement de scroll
  useEffect(() => {
    const historyElement = historyRef.current
    if (historyElement) {
      historyElement.addEventListener('scroll', handleScroll)
      return () => historyElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    if (historyRef.current) {
      historyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  async function promptLLM(query: string) {
    const interaction: UserAssistantInteraction = {
      user: query,
      assistant: '...'
    }

    setData([...data, interaction])
  }

  const dataMap = data.map(item => (
    <div key={item.user} className='mx-auto w-3/4'>
      <div className="history-entry py-4 flex flex-col gap-2">
        <div className='flex'>
          <div className='rounded-lg p-2 bg-gray-800 w-fit'>
            <span className='text-gray-100'><small><pre>User: {item.user}</pre></small></span>
          </div>
        </div>
        <div className='flex'>
          <div className='rounded-lg p-2 bg-yellow-700 w-fit'>
            <span className='text-gray-100'><strong>Assistant:</strong> {item.assistant}</span>
          </div>
        </div>
      </div>
    </div>
  ))

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
      prompt: HTMLInputElement
    }

    const value = formElements.prompt.value.trim();
    if (value !== '') {
      promptLLM(value)
      setPrompt('')
    }
  }

  return (
    <>
      <h2 className='text-center p-4 text-2xl text-white font-semibold'>
        Chat with your LLM!
      </h2>

      <button 
        onClick={scrollToTop}
        className={`fixed right-10 top-20 text-white bg-yellow-600 rounded-full p-2 transition-opacity duration-300 hover:bg-yellow-700 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <div 
        ref={historyRef} 
        id="history" 
        className='mx-auto flex-1 flex-col justify-center pb-8 h-[calc(100vh-200px)] overflow-y-auto'
      >
        {dataMap}
      </div>

      <div className='flex justify-center'>
        <form
          id="chat-form"
          className='fixed text-center w-4/5 bottom-0'
          onSubmit={handleSubmit}>
          
          <div id="prompt-control" className='w-full flex text-center float-start'>
            <textarea
              id="prompt"
              className='w-full p-4 text-gray-100 bg-gray-800 focus:outline-none rounded-t-xl'
              onChange={ev => setPrompt(ev.target.value)}
              value={prompt}
              rows={2}
              placeholder="At your service..."/>

            <div className='absolute right-2 top-5'>
              <button 
                type="submit" 
                className="text-white bg-yellow-600 rounded-lg text-sm px-3 py-2.5 mr-2 mb-2"
              >
                <ArrowUp />
              </button>
            </div>
          </div>
          <br />
        </form>
      </div>
    </>
  )
}