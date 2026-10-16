-- Paid seats for Drisyon cohorts. Written only by the Razorpay webhook (service role).
create table if not exists public.drisyon_enrolments (
  payment_id     text primary key,
  order_id       text not null,
  program        text,
  seats          integer not null check (seats between 1 and 10),
  amount_paise   bigint not null check (amount_paise >= 0),
  refunded_paise bigint not null default 0,
  offer          text,
  name           text,
  email          text,
  phone          text,
  company        text,
  gstin          text,
  status         text not null default 'paid' check (status in ('paid', 'refunded')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists drisyon_enrolments_status_idx on public.drisyon_enrolments (status);

create or replace function public.drisyon_enrolments_touch() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists drisyon_enrolments_touch on public.drisyon_enrolments;
create trigger drisyon_enrolments_touch before update on public.drisyon_enrolments
  for each row execute function public.drisyon_enrolments_touch();

-- Personal data: no anon or authenticated access. The service role bypasses RLS.
alter table public.drisyon_enrolments enable row level security;
revoke all on public.drisyon_enrolments from anon, authenticated;
revoke execute on function public.drisyon_enrolments_touch() from public, anon, authenticated;
