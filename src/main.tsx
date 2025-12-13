import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App.tsx'
import { theme } from './theme'



import { ErrorBoundary } from './components/ErrorBoundary'

console.log('Main: Mounting React application...');
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
