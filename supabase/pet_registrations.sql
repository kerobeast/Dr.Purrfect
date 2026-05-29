create extension if not exists pgcrypto;

create table if not exists public.pet_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  patient_display_id text not null unique,
  owner_name text not null,
  owner_email text,
  owner_email_normalized text,
  owner_phone text,
  owner_phone_normalized text,
  preferred_contact_method text not null default 'phone',
  best_time_to_contact text,
  pet_name text not null,
  pet_type text not null,
  pet_age text not null,
  pet_breed text,
  pet_gender text not null,
  visit_reason text,
  care_needs text,
  urgency text not null default 'routine',
  consent_to_contact boolean not null default true,
  marketing_consent boolean not null default false,
  source text not null default 'website_registration_form',
  status text not null default 'new',
  page_url text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  admin_notes text,
  constraint pet_registrations_pet_type_check check (pet_type in ('Dog', 'Cat', 'Rabbit', 'Bird', 'Goat', 'Sheep', 'Cow', 'Chicken', 'Other')),
  constraint pet_registrations_pet_gender_check check (pet_gender in ('Male', 'Female', 'Other')),
  constraint pet_registrations_status_check check (status in ('new', 'contacted', 'converted', 'archived')),
  constraint pet_registrations_preferred_contact_method_check check (preferred_contact_method in ('phone', 'text', 'email')),
  constraint pet_registrations_urgency_check check (urgency in ('routine', 'soon', 'urgent')),
  constraint pet_registrations_contact_required_check check (
    nullif(trim(coalesce(owner_email, '')), '') is not null
    or nullif(regexp_replace(coalesce(owner_phone, ''), '[^0-9]', '', 'g'), '') is not null
  )
);

alter table public.pet_registrations
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists owner_email_normalized text,
  add column if not exists owner_phone_normalized text,
  add column if not exists preferred_contact_method text not null default 'phone',
  add column if not exists best_time_to_contact text,
  add column if not exists visit_reason text,
  add column if not exists care_needs text,
  add column if not exists urgency text not null default 'routine',
  add column if not exists consent_to_contact boolean not null default true,
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists admin_notes text;

update public.pet_registrations
set owner_email_normalized = nullif(lower(trim(owner_email)), ''),
    owner_phone_normalized = nullif(regexp_replace(coalesce(owner_phone, ''), '[^0-9]', '', 'g'), ''),
    updated_at = coalesce(updated_at, created_at, now())
where owner_email_normalized is null or owner_phone_normalized is null;

alter table public.pet_registrations
  drop constraint if exists pet_registrations_contact_required_check;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'pet_registrations_pet_type_check') then
    alter table public.pet_registrations
      add constraint pet_registrations_pet_type_check
      check (pet_type in ('Dog', 'Cat', 'Rabbit', 'Bird', 'Goat', 'Sheep', 'Cow', 'Chicken', 'Other'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'pet_registrations_pet_gender_check') then
    alter table public.pet_registrations
      add constraint pet_registrations_pet_gender_check
      check (pet_gender in ('Male', 'Female', 'Other'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'pet_registrations_status_check') then
    alter table public.pet_registrations
      add constraint pet_registrations_status_check
      check (status in ('new', 'contacted', 'converted', 'archived'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'pet_registrations_preferred_contact_method_check') then
    alter table public.pet_registrations
      add constraint pet_registrations_preferred_contact_method_check
      check (preferred_contact_method in ('phone', 'text', 'email'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'pet_registrations_urgency_check') then
    alter table public.pet_registrations
      add constraint pet_registrations_urgency_check
      check (urgency in ('routine', 'soon', 'urgent'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'pet_registrations_contact_required_check') then
    alter table public.pet_registrations
      add constraint pet_registrations_contact_required_check
      check (
        nullif(trim(coalesce(owner_email, '')), '') is not null
        or nullif(regexp_replace(coalesce(owner_phone, ''), '[^0-9]', '', 'g'), '') is not null
      );
  end if;
end $$;

create or replace function public.set_pet_registrations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_pet_registrations_updated_at on public.pet_registrations;
create trigger set_pet_registrations_updated_at
before update on public.pet_registrations
for each row execute function public.set_pet_registrations_updated_at();

alter table public.pet_registrations enable row level security;

drop policy if exists "Public can submit pet registrations" on public.pet_registrations;
create policy "Public can submit pet registrations"
on public.pet_registrations
for insert
to anon, authenticated
with check (
  source = 'website_registration_form'
  and status = 'new'
  and consent_to_contact = true
  and length(trim(owner_name)) between 2 and 160
  and length(trim(pet_name)) between 1 and 120
  and length(trim(pet_age)) between 1 and 80
  and patient_display_id ~ '^DP-[0-9]{5}$'
  and preferred_contact_method in ('phone', 'text', 'email')
  and urgency in ('routine', 'soon', 'urgent')
  and (owner_email is null or owner_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')
  and (owner_phone is null or length(regexp_replace(owner_phone, '[^0-9]', '', 'g')) >= 10)
  and (preferred_contact_method <> 'email' or owner_email is not null)
  and (preferred_contact_method = 'email' or owner_phone is not null)
  and (
    nullif(trim(coalesce(owner_email, '')), '') is not null
    or nullif(regexp_replace(coalesce(owner_phone, ''), '[^0-9]', '', 'g'), '') is not null
  )
);

grant insert on public.pet_registrations to anon, authenticated;
grant select, update, delete on public.pet_registrations to service_role;

create index if not exists pet_registrations_created_at_idx on public.pet_registrations (created_at desc);
create index if not exists pet_registrations_status_idx on public.pet_registrations (status);
create index if not exists pet_registrations_owner_phone_idx on public.pet_registrations (owner_phone);
create index if not exists pet_registrations_owner_phone_normalized_idx on public.pet_registrations (owner_phone_normalized);
create index if not exists pet_registrations_owner_email_normalized_idx on public.pet_registrations (owner_email_normalized);
create index if not exists pet_registrations_urgency_idx on public.pet_registrations (urgency);
