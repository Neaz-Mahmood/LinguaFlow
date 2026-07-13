import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Theme } from '@astryxdesign/core/theme'
import { gothicTheme } from '@astryxdesign/theme-gothic/built'
import { Toaster } from 'sonner'
import './i18n'
import './index.css'
import App from './App.jsx'
import { PreferencesProvider } from './features/preferences/PreferencesProvider.jsx'
import { usePreferences } from './hooks/usePreferences.js'

const googleClientId = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID || ''

function ThemedApp() {
  const { themeMode } = usePreferences()

  return (
    <Theme theme={gothicTheme} mode={themeMode}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
        <Toaster richColors position="top-center" closeButton />
      </GoogleOAuthProvider>
    </Theme>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreferencesProvider>
      <ThemedApp />
    </PreferencesProvider>
  </StrictMode>,
)
