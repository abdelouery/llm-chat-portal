import { ArrowUp } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { request } from './request'
import ReactMarkdown from 'react-markdown'
import { UserAssistantInteraction } from './types'

type ChatProps = {
  conversationId: string
}

export default function Chat({ conversationId }: ChatProps) {
  const [data, setData] = useState<UserAssistantInteraction[]>([])
  const [promptHappened, setPromptHappened] = useState(false)
  const [prompt, setPrompt] = useState<string>('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchHistory(conversationId)

    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }

    const historyElement = historyRef.current
    if (historyElement) {
      historyElement.addEventListener('scroll', handleScroll)
      return () => historyElement.removeEventListener('scroll', handleScroll)
    }
  }, [promptHappened, conversationId])

  // Gérer l'apparition/disparition du bouton de scroll
  const handleScroll = () => {
    if (historyRef.current) {
      const scrollTop = historyRef.current.scrollTop
      setShowScrollTop(scrollTop > 100) // Afficher après 100px de scroll
    }
  }

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    if (historyRef.current) {
      historyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const fetchHistory = async (conversationId: string) => {
    setPromptHappened(false)
    request<UserAssistantInteraction[]>(`http://localhost:8000/api/history/${conversationId}`)
      .then(data => setData(data.filter(item => item.role !== 'system')))
  }

  const promptLLM = async (conversationId: string, content: string) => {
    const interaction = { role: 'user', content }
    const responseInteraction = { role: 'assistant', content: '' }

    const response = await fetch(
      `http://localhost:8000/api/prompt/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'user', content })
    }
    )

    setPromptHappened(true);

    const decoder = new TextDecoder()
    for await (const chunk of response.body) {
      responseInteraction.content += decoder.decode(chunk, { stream: true })
      setData([...data, interaction, responseInteraction])
    }
  }

  const dataMap = data.map((item, index) => (
    <div key={index} className='mx-auto w-3/4'>
      <div className="history-entry py-4 flex flex-col gap-2">
        <div className='flex'>
          {item.role === 'user'
            ?
            <div className='rounded-lg p-2 bg-gray-800 w-fit'>
              <span className='text-gray-100'>{item.content}</span>
            </div>
            :
            <div className='rounded-lg p-4 bg-yellow-700 w-fit'>
              <span className='text-gray-100'><strong>{item.role}:</strong></span>
              <ReactMarkdown className='prose text-slate-200'>{item.content}</ReactMarkdown>
            </div>
          }
        </div>
      </div>
    </div>
  ))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
      prompt: HTMLInputElement
    }

    const value = formElements.prompt.value.trim();
    if (value !== '') {
      promptLLM(conversationId, value)
      setPrompt('')
      setPromptHappened(true)
    }
  }

  return (
    <>
      <h2 className='text-center p-4 text-2xl text-white font-semibold'>
        Chat with your LLM!
      </h2>

      <button
        onClick={scrollToTop}
        className={`fixed right-10 top-20 text-white bg-yellow-600 rounded-full p-2 transition-opacity duration-300 hover:bg-yellow-700 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
          onSubmit={handleSubmit}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmit(e)
            }
          }}>

          <div id="prompt-control" className='w-full flex text-center float-start'>
            <textarea
              id="prompt"
              className='w-full p-4 text-gray-100 bg-gray-800 focus:outline-none rounded-t-xl'
              onChange={ev => setPrompt(ev.target.value)}
              value={prompt}
              rows={2}
              placeholder="At your service..." />

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
