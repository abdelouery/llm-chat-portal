import { ArrowUp } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Conversation, UserAssistantInteraction } from './types'
import { fetchHistory, sendPrompt } from './services/history'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from './Spinner'

type ChatProps = {
  conversation: Conversation | null
}

export default function Chat({ conversation }: ChatProps) {
  const [history, setHistory] = useState<UserAssistantInteraction[]>([])
  const [prompt, setPrompt] = useState<string>('')
  const [promptHappened, setPromptHappened] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [prevConversationId] = useState('')
  const historyRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const queryClient = useQueryClient()

  const conversationId = conversation?._id.$oid
  const { isPending, data } = useQuery({
    queryKey: ['fetchHistory'],
    queryFn: async () => fetchHistory(conversationId),
    enabled: !!conversationId
  })

  useEffect(() => {
    // Convesation changed, fetch history
    if (conversation && conversation._id.$oid !== prevConversationId) {
      queryClient.invalidateQueries({ queryKey: ['fetchHistory'] })
    }

    if (data) {
      setHistory(data)
    }

    const historyElement = historyRef.current

    // Set up a MutationObserver to watch for changes in historyRef
    const observer = new MutationObserver(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    });

    // Observe changes in the history element
    if (historyElement) {
      observer.observe(historyElement, { childList: true })
    }

    if (historyElement) {
      historyElement.addEventListener('scroll', handleScroll)
      return () => historyElement.removeEventListener('scroll', handleScroll)
    }

    return () => observer.disconnect();
  }, [conversation, data, promptHappened])

  const handleScroll = () => {
    if (historyRef.current) {
      const scrollTop = historyRef.current.scrollTop
      setShowScrollTop(scrollTop > 100)
    }
  }

  const scrollToTop = () => {
    if (historyRef.current) {
      historyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const promptLLM = async (conversationId: string | undefined, content: string) => {
    const interaction = { role: 'user', content }
    const responseInteraction = { role: 'assistant', content: '' }

    setHistory([...history, interaction])

    const response = await sendPrompt(conversationId, content)
    const reader = response.body?.getReader()
    const decoder = new TextDecoder("utf-8")

    let done = false
    while (!done) {
      setPromptHappened(promptHappened ? false : true)
      const { value, done: streamDone } = await reader!.read();
      done = streamDone;

      if (value) {
        // Decode the bytes to a string and accumulate response
        const chunk = decoder.decode(value, { stream: true });
        responseInteraction.content += chunk;
        setHistory([...history, interaction, responseInteraction])

        if (historyRef.current) {
          historyRef.current.scrollTop = historyRef.current.scrollHeight
        }
      }
    }
  }

  const dataMap = history.map((item, index) => (
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

    const value = formElements.prompt.value.trim()
    if (value !== '') {
      promptLLM(conversation?._id.$oid, value)
      setPrompt('')
    }
  }

  return (
    <>
      <h2 className='text-center p-4 text-2xl text-white font-semibold'>
        {conversation?.title}
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
        { isPending && <Spinner/> }

        {dataMap}

        <div ref={bottomRef}></div>
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
