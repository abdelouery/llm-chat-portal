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
    <ul key={item.user} className="history-entry">
      <li><small><pre>User: {item.user}</pre></small></li>
      <li><strong>Assistant:</strong> {item.assistant}</li>
    </ul>
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
      <h2>Chat with your LLM!</h2>

      <div id="history">
        {dataMap}
        <hr />
      </div>

      <form id="chat-form" onSubmit={handleSubmit}>
        <div id="prompt-control">
          <label>
            <small>Prompt:</small>
          </label>

          <textarea
            id="prompt"
            onChange={ev => setPrompt(ev.target.value)}
            value={prompt}
            rows={6}
            placeholder="At your service..."/>

          <input id="send-btn" type="submit" value="Send" />
        </div>
        <br />
      </form>
    </>
  )
} 
