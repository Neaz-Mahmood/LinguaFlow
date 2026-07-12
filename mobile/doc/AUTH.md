# Mobile Google Sign-In Setup

Native Google auth uses the ID-token exchange pattern: the OS returns a signed
Google ID token, which is posted to NestJS `POST /api/auth/google`.

## Google Cloud Console

1. Create (or reuse) an OAuth project.
2. Create three OAuth client IDs:
   - **Web** — used by NestJS token verification and Expo `webClientId`.
   - **iOS** — used by the native iOS SDK (`iosClientId` + `iosUrlScheme`).
   - **Android** — bound to your debug/release SHA-1 fingerprints.
3. Copy values into:
   - `mobile/.env` (`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`)
   - `backend/.env` (`GOOGLE_WEB_CLIENT_ID`, `GOOGLE_IOS_CLIENT_ID`, `GOOGLE_ANDROID_CLIENT_ID`)

## Expo plugin (`app.json`)

Replace `YOUR_IOS_CLIENT_ID` in `iosUrlScheme` with the reversed iOS client ID
prefix (everything before `.apps.googleusercontent.com`), for example:

```text
com.googleusercontent.apps.123456789-abcdefg
```

Rebuild with EAS / a development client after changing native plugins:

```bash
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

Google Sign-In requires a **dev client or production build**; it does not work
in Expo Go.

## Android SHA-1

```bash
# Debug keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Add that SHA-1 to the Android OAuth client in Google Cloud Console.

## Flow

1. `configureGoogleAuth()` on app start
2. `GoogleSignin.signIn()` → `idToken`
3. `POST /api/auth/google` with `{ idToken }`
4. Store Nest JWT in SecureStore
5. Route: `needsOnboarding` → Onboarding placeholder; else Daily Flow placeholder

## Key files

- `src/lib/authService.ts` — Google configure / sign-in / SecureStore
- `src/lib/api.ts` — Nest API helper
- `App.tsx` — auth → onboarding → flow shell
