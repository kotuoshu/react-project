create table public.likes (
  entry_id uuid not null references public.entries(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  primary key (entry_id, user_id)
);
alter table public.likes enable row level security;
revoke all on public.likes from anon, authenticated;
grant select on public.likes to anon, authenticated;
grant insert, delete on public.likes to authenticated;
create policy "Public likes" on public.likes for select to anon, authenticated using (true);
create policy "Own likes insert" on public.likes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own likes delete" on public.likes for delete to authenticated using ((select auth.uid()) = user_id);
