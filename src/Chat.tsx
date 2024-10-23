import { useEffect, useState } from 'react'
import myData from './data.json'

type UserAssistantInteraction = {
  user: string
  assistant: string
}

export default function Chat() {
  const [data, setData] = useState<UserAssistantInteraction[]>([])
  const [prompt, setPrompt] = useState<string>('')

  useEffect(() => {
    // Fetch existing history


    setData(myData)
  }, [])

  async function promptLLM(query: string) {
    const interaction: UserAssistantInteraction = {
      user: query,
      assistant: '...'
    }

    setData([...data, interaction])

    // const response = await fetch('http://localhost/llm-chat-portal-backend', {
    //   body: JSON.stringify(query),
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json'
    //   }
    // })

    // const { data, errors } = await response.json()
    // if (response.ok) {

    // }
  }

  const dataMap = data.map(item => (
    <div className='mx-auto'>
      <div key={item.user} className="history-entry block py-4">
        <span className='text-gray-100'><small><pre>User: {item.user}</pre></small></span>
        <span className='text-gray-100'><strong>Assistant:</strong> {item.assistant}</span>
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
      <div className=''>
        <h2 className='text-center text-2xl text-white font-semibold'>Chat with your LLM!</h2>

        <div id="history">
          {dataMap}
        </div>

        <div className='flex justify-center'>
          <form
            id="chat-form"
            className='fixed text-center w-4/5 rounded-lg bottom-0 bg-gray-200'
            onSubmit={handleSubmit}>
            
            <div id="prompt-control" className=' flex text-center float-start'>

              <textarea
                id="prompt"
                className='w-full p-2 ring-2 ring-gray-900 rounded-lg'
                onChange={ev => setPrompt(ev.target.value)}
                value={prompt}
                rows={6}
                placeholder="At your service..."/>

              <div>
                <button type="button" 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Default</button>
              </div>
            </div>
            <br />
          </form>
        </div>
      </div>
    </>
  )
} 
