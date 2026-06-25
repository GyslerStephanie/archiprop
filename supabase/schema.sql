-- ArchiProp — Supabase schema
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- It is safe to re-run (idempotent).

-- ---------------------------------------------------------------------------
-- projects: one row per AR building site shown on the map / fetched by QR.
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  architect         text,
  status            text not null default 'planning'
                      check (status in ('planning', 'under_construction', 'complete')),
  anchor_lat        double precision not null,
  anchor_lng        double precision not null,
  anchor_elevation  double precision default 0,
  ifc_north_offset  double precision default 0,
  model_url         text,          -- public/signed URL of the 3D model file
  thumbnail_url     text,          -- preview image shown on the download screen
  qr_token          text unique,   -- value encoded in the site's QR code
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: signed-in users can read all projects; nobody can
-- write from the client (manage rows from the dashboard or a service role).
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "Authenticated users can read projects" on public.projects;
create policy "Authenticated users can read projects"
  on public.projects
  for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for the 3D model files + thumbnails.
-- Public read so the app can download model_url without a signed request.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('models', 'models', true)
on conflict (id) do nothing;

drop policy if exists "Public read for model files" on storage.objects;
create policy "Public read for model files"
  on storage.objects
  for select
  to public
  using (bucket_id = 'models');

-- ---------------------------------------------------------------------------
-- Optional: seed the three demo sites so the map has content immediately.
-- ---------------------------------------------------------------------------
insert into public.projects (name, architect, status, anchor_lat, anchor_lng, ifc_north_offset, qr_token)
values
  ('Hardbrücke Tower',     'Studio Zurich',        'planning',           47.3853, 8.5237,  0, 'AP-001'),
  ('Langstrasse Residenz', 'Architektur AG',       'under_construction', 47.3779, 8.5282, 15, 'AP-002'),
  ('Zürich West Pavilion', 'Herzog & de Meuron',   'complete',           47.3876, 8.5196,  0, 'AP-003')
on conflict (qr_token) do nothing;
