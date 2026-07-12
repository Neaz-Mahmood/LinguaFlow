# Frontend docs

## Google Sign-In (web)

The Vite app uses Google Identity Services via `@react-oauth/google`. The browser
returns an ID token (`credential`), which is exchanged with NestJS for a JWT.

### Environment (`.env`)

```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_WEB_CLIENT_ID=     # Web OAuth client ID from Google Cloud Console
```

Copy from `.env.example` if needed. Restart Vite after changing env vars.

### Flow

1. `SignIn` → Google button → ID token
2. `POST /api/auth/google` → store JWT in `localStorage` (`linguaflow_access_token`)
3. `apiFetch` attaches `Authorization: Bearer …` on all API calls
4. Route gate in `App.jsx`:
   - no token → Sign-In
   - `!onboardingCompleted` → Onboarding
   - else → Daily Flow

### Key files

- `src/lib/api.js` — token helpers + `apiFetch`
- `src/components/SignIn.jsx` — Google login UI
- `src/App.jsx` — auth / onboarding / flow routing
- `src/main.jsx` — `GoogleOAuthProvider`
