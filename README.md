# VNLIVEVENTS

VNLIVEVENTS is a Next.js web app for creating and sharing cinematic live-event invitation pages (weddings, engagements, birthdays, housewarming, and more).

It includes:
- A public homepage (`/`) that showcases live/upcoming events
- Dynamic invitation pages (`/[slug]`) for each event
- A Firebase-backed admin panel (`/admin/...`) to create, edit, and manage events

## Core features

- Occasion presets (wedding, half saree, birthday, engagement, baby shower, housewarming, anniversary, custom)
- Real-time event loading from Firestore
- Countdown-to-live transition and embedded livestream playback
- Invitation theming (accent/secondary colors, gradients, particles, optional footer image)
- Admin event CRUD with image upload support via Firebase Storage
- Admin auth with email/password and Google sign-in (allowlist enforced in code)
- Share link + add-to-calendar actions

## Tech stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Framer Motion
- Firebase (Auth, Firestore, Storage)
- ESLint

## Project structure

- `/app/page.tsx` – public homepage and event listing
- `/app/[slug]/page.tsx` – public invitation page
- `/app/admin/...` – admin login, layout, event list, create/edit pages
- `/components/invitation/*` – invitation UI modules (countdown, particles, audio, calendar, etc.)
- `/lib/occasionPresets.ts` – preset configuration + `EventData` shape
- `/lib/firebase/config.ts` – Firebase initialization
- `/lib/hooks/useAuth.tsx` – admin auth context and allowlist checks

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### 3) Run the app

```bash
npm run dev
```

Open: http://localhost:3000

## Available scripts

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Firebase notes

- Firestore collection used by the app: `events`
- Event images are uploaded to Firebase Storage under `events/...`
- Admin access is restricted by the hardcoded `ALLOWED_EMAILS` list in:
  - `/tmp/workspace/rexploretech/vnlivevents/lib/hooks/useAuth.tsx`
- Ensure Firebase Auth, Firestore, and Storage rules are configured for your deployment

## Current quality status

At the time of this README update:
- `npm run lint` reports pre-existing ESLint errors/warnings in source files
- `npm run build` fails in this sandbox because Google Fonts could not be fetched

These are existing project issues and are unrelated to this documentation change.
