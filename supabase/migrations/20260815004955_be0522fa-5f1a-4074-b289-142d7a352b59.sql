create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated, service_role;

create or replace function app_private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when _user_id is null then false
    when auth.uid() is distinct from _user_id then false
    else exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
  end
$$;
revoke all on function app_private.has_role(uuid, public.app_role) from public;
grant execute on function app_private.has_role(uuid, public.app_role) to authenticated, service_role;

-- public wrapper is SECURITY INVOKER: no privileged definer function is
-- callable from the exposed API schema, while all RLS policies keep working.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$ select app_private.has_role(_user_id, _role) $$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

-- blog-images bucket is private: drop the blanket public read rule
drop policy if exists "Anyone can view blog images" on storage.objects;
create policy "Staff can view blog images"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'blog-images'
    and (public.has_role(auth.uid(), 'admin'::public.app_role) or public.has_role(auth.uid(), 'editor'::public.app_role))
  );

-- draft preview credential is server-only
revoke select (preview_token) on public.blog_posts from authenticated;