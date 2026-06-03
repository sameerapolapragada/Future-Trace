-- One-time scan credits for mobile/web matcher (wallet tokens).
do $migration$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'profiles'
  ) then
    alter table public.profiles
      add column if not exists token_balance integer not null default 0;

    alter table public.profiles
      drop constraint if exists profiles_token_balance_nonneg;

    alter table public.profiles
      add constraint profiles_token_balance_nonneg
      check (token_balance >= 0);
  end if;
end
$migration$;
