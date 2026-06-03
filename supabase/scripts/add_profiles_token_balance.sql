-- Run on Supabase dev branch if you see: column profiles.token_balance does not exist
-- Dashboard → Branches → dev → SQL Editor → paste → Run

alter table public.profiles
  add column if not exists token_balance integer not null default 0;

alter table public.profiles
  drop constraint if exists profiles_token_balance_nonneg;

alter table public.profiles
  add constraint profiles_token_balance_nonneg
  check (token_balance >= 0);
