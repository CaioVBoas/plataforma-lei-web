import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyAccessibility } from './lib/accessibility'

// As preferências de leitura entram antes da primeira tela, para não piscar no tamanho normal.
applyAccessibility()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
