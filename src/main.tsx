import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CONFIG } from './services/config.ts'

if (import.meta.env.DEV && CONFIG.useMocks) {
  const { worker } = await import('./mocks/browser.ts')
  worker.start()
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
