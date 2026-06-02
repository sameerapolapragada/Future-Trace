# Future Trace — Mobile (iOS & Android)

Expo app on the **`Dev`** git branch. Uses the **same Supabase project and schema** as the web app.

## Setup

```bash
cd mobile
cp .env.example .env
# EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY (same as web)
npm install
npx expo start
```

- Press **i** — iOS Simulator  
- Press **a** — Android Emulator  

## Navigation

Gold-gradient **drawer** (matches web home panel):

- Home  
- AI Evolution Timeline  
- Industry Adoption Waves  
- Jobs Affected by AI Evolution  
- What Comes Next  

Legacy routes `(auth)` and `(app)` tabs remain in the repo for sign-in and score flows.

## Branch policy

Commit mobile changes to **`Dev` only** — do not merge into `Web-Dev`.

## Supabase

`lib/supabase.ts` is ready for auth and data when you wire real sign-in. Schema migrations live in `/supabase/migrations` at the repo root.
