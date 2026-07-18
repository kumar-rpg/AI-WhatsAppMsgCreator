# Candidate Status Tool — Cortex Robotics HR

An internal recruitment tracker: log candidates, move them through stages, and
generate a copy-paste-ready WhatsApp status update for each one. Shared with
the team behind a single password, backed by Supabase.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
   This creates the `candidates` table.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret, not the `anon` key) → `SUPABASE_SERVICE_ROLE_KEY`

The app talks to Supabase only from the server using the service role key —
the browser never sees it, and the `anon` key isn't used at all. Row Level
Security is enabled with no policies, so nothing is publicly readable/writable
outside this app.

## 2. Local setup

```bash
npm install
cp .env.example .env.local
# fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and pick an APP_PASSWORD
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the
password screen first. Enter whatever you set as `APP_PASSWORD`.

## 3. Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this from there).
2. Go to [vercel.com/new](https://vercel.com/new) and import the
   `AI-WhatsAppMsgCreator` repo.
3. Before the first deploy, add these Environment Variables in the Vercel
   project settings (same three as `.env.example`):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_PASSWORD`
4. Deploy. Share the resulting `*.vercel.app` link with your team — they'll
   need the `APP_PASSWORD` to get in.

## How it works

- `src/proxy.js` — gates every page and API route behind a password check
  (Next.js 16 renamed Middleware to "Proxy"; same mechanism).
- `src/app/login` — the password screen.
- `src/app/api/candidates` — list/create candidates.
- `src/app/api/candidates/[id]` — update stage / delete a candidate.
- `src/lib/messageBuilder.js` — the stage timelines and WhatsApp message copy,
  shared between the API and the UI.
- `src/app/page.js` — the dashboard: add a candidate, change their stage,
  view and copy their WhatsApp message.

## Stage timelines

| Stage     | Response timeline                              |
| --------- | ----------------------------------------------- |
| Applied   | Initial review within 3–5 working days           |
| Screening | Screening outcome within 3–5 working days        |
| Interview | Interview outcome within 5–7 working days        |
| Offer     | Offer response requested within 3 working days   |
| Hired     | Onboarding details sent within 2 working days    |
| Rejected  | Notified immediately, no further timeline needed |

Candidates can always reply on WhatsApp or email hr@cortexrobotics.my with
questions — that's baked into every generated message.
