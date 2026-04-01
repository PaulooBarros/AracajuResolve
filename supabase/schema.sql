create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('iluminacao', 'buracos', 'lixo', 'esgoto', 'arvores', 'sinalizacao', 'calcadas', 'animais', 'poluicao', 'outros')),
  neighborhood text not null,
  street text,
  reference_point text,
  status text not null default 'aberta' check (status in ('aberta', 'em_andamento', 'resolvida', 'arquivada')),
  priority text not null default 'media' check (priority in ('baixa', 'media', 'alta', 'critica')),
  responsible_organ text not null default 'A definir',
  image_url text,
  latitude double precision not null,
  longitude double precision not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  confirmations_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.complaint_confirmations (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (complaint_id, user_id)
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

create or replace function public.handle_complaint_confirmation_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.complaints
      set confirmations_count = confirmations_count + 1,
          updated_at = timezone('utc', now())
    where id = new.complaint_id;
    return new;
  end if;

  if tg_op = 'DELETE' then
    update public.complaints
      set confirmations_count = greatest(confirmations_count - 1, 0),
          updated_at = timezone('utc', now())
    where id = old.complaint_id;
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_complaints_updated_at on public.complaints;
create trigger handle_complaints_updated_at
  before update on public.complaints
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_confirmation_changed on public.complaint_confirmations;
create trigger on_confirmation_changed
  after insert or delete on public.complaint_confirmations
  for each row execute procedure public.handle_complaint_confirmation_count();

alter table public.profiles enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_confirmations enable row level security;

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user_id and role = 'admin'
  );
$$;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (
  public.is_admin(auth.uid())
  or (
    auth.uid() = id
    and role = (
      select current_profile.role
      from public.profiles as current_profile
      where current_profile.id = auth.uid()
    )
  )
);

drop policy if exists "complaints_select_authenticated" on public.complaints;
create policy "complaints_select_authenticated"
on public.complaints
for select
to authenticated
using (true);

drop policy if exists "complaints_insert_authenticated" on public.complaints;
create policy "complaints_insert_authenticated"
on public.complaints
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "complaints_update_owner_or_admin" on public.complaints;
create policy "complaints_update_owner_or_admin"
on public.complaints
for update
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "complaint_confirmations_select_authenticated" on public.complaint_confirmations;
create policy "complaint_confirmations_select_authenticated"
on public.complaint_confirmations
for select
to authenticated
using (true);

drop policy if exists "complaint_confirmations_insert_authenticated" on public.complaint_confirmations;
create policy "complaint_confirmations_insert_authenticated"
on public.complaint_confirmations
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "complaint_confirmations_delete_own_or_admin" on public.complaint_confirmations;
create policy "complaint_confirmations_delete_own_or_admin"
on public.complaint_confirmations
for delete
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public)
values ('complaint-images', 'complaint-images', true)
on conflict (id) do nothing;

drop policy if exists "complaint_images_public_read" on storage.objects;
create policy "complaint_images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'complaint-images');

drop policy if exists "complaint_images_upload_authenticated" on storage.objects;
create policy "complaint_images_upload_authenticated"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'complaint-images');

drop policy if exists "complaint_images_update_owner_or_admin" on storage.objects;
create policy "complaint_images_update_owner_or_admin"
on storage.objects
for update
to authenticated
using (bucket_id = 'complaint-images')
with check (bucket_id = 'complaint-images');

drop policy if exists "complaint_images_delete_owner_or_admin" on storage.objects;
create policy "complaint_images_delete_owner_or_admin"
on storage.objects
for delete
to authenticated
using (bucket_id = 'complaint-images');

create or replace view public.admin_user_summary as
select
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.avatar_url,
  p.created_at,
  p.updated_at,
  count(c.id)::int as complaints_count
from public.profiles p
left join public.complaints c on c.user_id = p.id
group by p.id;

comment on table public.profiles is 'User profile data synchronized from auth.users';
comment on table public.complaints is 'Citizen complaints registered in the platform';
comment on table public.complaint_confirmations is 'Prevents duplicate confirmations per complaint/user';

-- Promote the first admin manually after signup:
-- update public.profiles set role = 'admin' where email = 'admin@seu-dominio.com';
