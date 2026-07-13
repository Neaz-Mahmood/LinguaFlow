# Backend docs

## Auth overview

NestJS supports Google ID-token exchange and email/password credentials. Both
issue the same LinguaFlow JWT. There is no Supabase.

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/signup` | Public | Body `{ "email", "password" }` → `{ accessToken, user, needsOnboarding }` |
| `POST` | `/api/auth/signin` | Public | Body `{ "email", "password" }` → `{ accessToken, user, needsOnboarding }` |
| `POST` | `/api/auth/google` | Public | Body `{ "idToken": "..." }` → `{ accessToken, user, needsOnboarding }` |
| `GET` | `/api/auth/me` | Bearer JWT | Current user + `needsOnboarding` |

All other `/api/*` routes require `Authorization: Bearer <accessToken>`.

Password rules: minimum 8 characters. Emails are stored lowercase.
`passwordHash` is never returned in API responses.

### Account rules

- Sign-up fails with `409` if the email is already registered.
- Email sign-in fails for Google-only accounts (no password set); use Google.
- Google sign-in can link to an existing email/password user by email.

### Environment (`.env`)

```bash
JWT_SECRET=linguaflow-dev-secret-change-me
GOOGLE_WEB_CLIENT_ID=          # required — token audience
GOOGLE_IOS_CLIENT_ID=          # optional audience allowlist
GOOGLE_ANDROID_CLIENT_ID=      # optional audience allowlist
```

### First-login profile defaults

New users (Google or email) are created with:

- `onboardingCompleted: false`
- `goals: ['general']`
- `contentRatios: { input: 0.5, output: 0.5 }`
- `nativeLanguage: 'English'`

`POST /api/user/onboard` sets profile fields and marks `onboardingCompleted: true`.
