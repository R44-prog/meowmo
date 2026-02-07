# Meowmo (Vibe Brain)

Meowmo is a PWA designed for "calm observation" of cat health. It focuses on privacy, local-first data, and delightful UX.

## Features
- **Daily Vibe Log**: Record photos, health scores, and notes.
- **Health Insights**: Analyze patterns and streaks to monitor your cat's well-being.
- **Vet Export**: Generate PDF reports of your cat's health history.
- **Privacy First**: Local-first storage with optional Supabase sync and biometric lock.
- **Offline Mode**: Fully functional offline with background syncing.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide icons.
- **Backend**: Supabase (Auth, DB, Storage).
- **Export**: jsPDF for report generation.

## Development
```bash
npm install
npm run dev
npm run build
```

## Phase K: Polish & Excellence
The most recent sprint focused on:
- Global Toast notification system.
- Enhanced empty states for better onboarding.
- Full accessibility audit and ARIA compliance.
- Code cleanup and extraction of inline styles.
- JSDoc documentation for core services.
