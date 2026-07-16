# Nehru Children Model School — Batch of 2004–2005 Countdown

A warm, mobile-friendly countdown and shared RSVP website for the one-day **Nehru Children Model School — Batch of 2004–2005** reunion. Classmates can vote between Saturday, December 26, 2026 and Sunday, December 27, 2026. The countdown currently targets Saturday, December 26, 2026 at 12:00 PM India Standard Time.

## Features

- Live days, hours, minutes, and seconds countdown
- Completion message when the reunion starts
- Shared RSVP list backed by Supabase
- Shared date voting backed by Supabase
- Blank-name and duplicate-name prevention
- Saved attendee list and date votes across refreshes and visitors
- Loading, success, and friendly error states
- Mobile-first responsive layout with accessible labels and keyboard support
- Metadata, favicon, and social-sharing image

## Local Installation

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Environment Variables

Copy `.env.example` to `.env.local` for local development and configure the same variables in Vercel.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_SUPABASE_ATTENDEES_TABLE=reunion_attendees
VITE_SUPABASE_DATE_VOTES_TABLE=reunion_date_votes
```

The anon key is safe to expose when Row Level Security is enabled with the policies in `supabase/schema.sql`. Do not commit service-role keys or private tokens.

## Database Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the SQL in `supabase/schema.sql`.
4. Copy the project URL and public anon key into your Vercel environment variables.

The attendee and date-vote tables use `normalized_name` as a unique column, so names like `Jane Smith` and ` jane   smith ` cannot be submitted twice.

## Test And Build

```bash
npm run lint
npm run test
npm run build
```

## Deployment

This app is configured for Vercel.

1. Push the repository to GitHub.
2. Import the GitHub repository in Vercel, or link it with the Vercel CLI.
3. Add the Supabase environment variables in Vercel.
4. Deploy to production.

Future pushes to the connected GitHub repository will redeploy automatically.
