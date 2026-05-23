create extension if not exists pgcrypto;

create table if not exists public.pet_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  patient_display_id text not null unique,
  owner_name text not null,
  owner_email text,
  owner_phone text,
  pet_name text not null,
  pet_type text not null check (pet_type in ('Dog', 'Cat', 'Rabbit', 'Bird', 'Goat', 'Sheep', 'Cow', 'Chicken', 'Other')),
  pet_age text not null,
  pet_breed text,
  pet_gender text not null check (pet_gender in ('Male', 'Female', 'Other')),
  source text not null default 'website_registration_form',
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'archived')),
  page_url text,
  user_agent text
);

alter table public.pet_registrations enable row level security;

drop policy if exists "Public can submit pet registrations" on public.pet_registrations;
create policy "Public can submit pet registrations"
on public.pet_registrations
for insert
to anon, authenticated
with check (
  source = 'website_registration_form'
  and length(trim(owner_name)) > 0
  and length(trim(pet_name)) > 0
  and length(trim(pet_age)) > 0
  and length(trim(patient_display_id)) > 0
);

grant insert on public.pet_registrations to anon, authenticated;
grant select, update, delete on public.pet_registrations to service_role;

create index if not exists pet_registrations_created_at_idx on public.pet_registrations (created_at desc);
create index if not exists pet_registrations_status_idx on public.pet_registrations (status);
create index if not exists pet_registrations_owner_phone_idx on public.pet_registrations (owner_phone);
