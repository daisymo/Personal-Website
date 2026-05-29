import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { MotionProvider } from './motion/MotionProvider'
import { LanguageProvider } from './providers/LanguageProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <MotionProvider>
        <App />
      </MotionProvider>
    </LanguageProvider>
  </StrictMode>,
)
