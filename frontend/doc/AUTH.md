# Frontend docs

## Authentication (web)

The Vite app supports email/password and Google Identity Services via
`@react-oauth/google`. Both paths exchange credentials with NestJS for a JWT.

### Environment (`.env`)

```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_WEB_CLIENT_ID=     # Web OAuth client ID from Google Cloud Console
```

Copy from `.env.example` if needed. Restart Vite after changing env vars.

### Flow

1. `SignIn` → email/password form **or** Google button
2. `POST /api/auth/signup`, `/api/auth/signin`, or `/api/auth/google` → store JWT in `localStorage` (`linguaflow_access_token`)
3. `apiFetch` attaches `Authorization: Bearer …` on all API calls
4. Route gate in `App.jsx`:
   - no token → Sign-In
   - `!onboardingCompleted` → Onboarding
   - else → Daily Flow

### Key files

- `src/lib/api.js` — token helpers + `apiFetch` + auth helpers
- `src/components/SignIn.jsx` — email/password + Google login UI
- `src/App.jsx` — auth / onboarding / flow routing
- `src/main.jsx` — `GoogleOAuthProvider`
