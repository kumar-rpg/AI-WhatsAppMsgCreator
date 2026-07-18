-- Run this once in your Supabase project's SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  track text not null default 'Employment' check (track in ('Employment', 'Internship')),
  stage text not null default 'Applied' check (
    stage in ('Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security is enabled with no policies, so only requests made
-- with the service role key (server-side, via this app's API routes) can
-- read or write. The anon/public key has no access at all.
alter table candidates enable row level security;
