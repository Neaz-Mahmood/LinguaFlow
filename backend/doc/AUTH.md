# Backend docs

## Google ID-token auth

NestJS verifies Google ID tokens and issues LinguaFlow JWTs. There is no Supabase.

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/google` | Public | Body `{ "idToken": "..." }` → `{ accessToken, user, needsOnboarding }` |
| `GET` | `/api/auth/me` | Bearer JWT | Current user + `needsOnboarding` |

All other `/api/*` routes require `Authorization: Bearer <accessToken>`.

### Environment (`.env`)

```bash
JWT_SECRET=linguaflow-dev-secret-change-me
GOOGLE_WEB_CLIENT_ID=          # required — token audience
GOOGLE_IOS_CLIENT_ID=          # optional audience allowlist
GOOGLE_ANDROID_CLIENT_ID=      # optional audience allowlist
```

### First-login profile defaults

New Google users are created with:

- `onboardingCompleted: false`
- `goals: ['general']`
- `contentRatios: { input: 0.5, output: 0.5 }`
- `nativeLanguage: 'English'`

`POST /api/user/onboard` sets profile fields and marks `onboardingCompleted: true`.
