import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { AppStoreProvider } from './context/AppStore'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AppStoreProvider>
          <App />
        </AppStoreProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
