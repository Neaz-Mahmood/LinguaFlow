import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Theme } from '@astryxdesign/core/theme'
import { gothicTheme } from '@astryxdesign/theme-gothic/built'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'

const googleClientId = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID || ''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme theme={gothicTheme}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
        <Toaster richColors position="top-center" closeButton />
      </GoogleOAuthProvider>
    </Theme>
  </StrictMode>,
)
