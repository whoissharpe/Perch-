-- ============================================================
-- Perch — initial schema
--
-- Three ideas, one table each:
--   spots  — a place worth stopping (bench, viewpoint, rock ledge)
--   marks  — one person's photo or video of stopping there
--   saves  — somebody else wanting to go
--
-- Media lives on the mark, never on the spot. A spot without a
-- picture is just a pin, and pins are the part open data already
-- has. The spot carries a denormalised cover so the map can draw
-- without a join per pin.
-- ============================================================

create extension if not exists postgis;
create extension if not exists "uuid-ossp";

-- ---------- enums ----------

create type public.spot_kind as enum
  ('bench', 'viewpoint', 'trail_rest', 'picnic', 'shelter');

create type public.media_type as enum ('photo', 'video');

-- ---------- profiles ----------

create table public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  handle       text unique not null check (handle ~ '^[a-z0-9_]{3,20}$'),
  display_name text,
  avatar_path  text,
  bio          text check (char_length(bio) <= 160),
  marks_count  integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- spots ----------

create table public.spots (
  id       uuid primary key default uuid_generate_v4(),
  kind     public.spot_kind not null default 'bench',
  geom     geography(Point, 4326) not null,

  name     text not null check (char_length(name) between 1 and 80),
  place    text,
  attributes text[] not null default '{}',

  -- Denormalised cover, maintained by trigger from the first mark.
  cover_media_path text,
  cover_media_type public.media_type,

  marks_count integer not null default 0,
  saves_count integer not null default 0,

  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index spots_geom_idx on public.spots using gist (geom);
create index spots_kind_idx on public.spots (kind);

-- ---------- marks ----------

create table public.marks (
  id         uuid primary key default uuid_generate_v4(),
  spot_id    uuid not null references public.spots(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,

  -- Required. This is the whole product.
  media_path text not null,
  media_type public.media_type not null default 'photo',
  poster_path text,

  caption    text check (char_length(caption) <= 280),
  saves_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index marks_spot_idx on public.marks (spot_id, created_at desc);
create index marks_user_idx on public.marks (user_id, created_at desc);

-- ---------- saves ----------

create table public.saves (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  spot_id    uuid not null references public.spots(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, spot_id)
);

-- ---------- follows ----------

create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followee_id uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, followee_id),
  -- Following yourself is not a feed, it is a diary.
  check (follower_id <> followee_id)
);

-- ---------- counters ----------

create or replace function public.refresh_spot_from_marks()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.spot_id, old.spot_id);
begin
  update public.spots s
  set marks_count = m.n,
      cover_media_path = coalesce(m.cover_path, s.cover_media_path),
      cover_media_type = coalesce(m.cover_type, s.cover_media_type)
  from (
    select count(*) as n,
           (array_agg(media_path order by created_at))[1] as cover_path,
           (array_agg(media_type order by created_at))[1] as cover_type
    from public.marks
    where spot_id = target
  ) m
  where s.id = target;

  update public.profiles p
  set marks_count = (select count(*) from public.marks where user_id = p.id)
  where p.id = coalesce(new.user_id, old.user_id);

  return null;
end;
$$;

create trigger marks_refresh_spot
after insert or update or delete on public.marks
for each row execute function public.refresh_spot_from_marks();

create or replace function public.refresh_spot_saves()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.spot_id, old.spot_id);
begin
  update public.spots
  set saves_count = (select count(*) from public.saves where spot_id = target)
  where id = target;
  return null;
end;
$$;

create trigger saves_refresh_spot
after insert or delete on public.saves
for each row execute function public.refresh_spot_saves();

-- ---------- nearby lookup ----------

create or replace function public.spots_nearby(
  in_lat   double precision,
  in_lng   double precision,
  radius_m integer default 2000,
  max_rows integer default 300
)
returns table (
  id uuid, kind public.spot_kind,
  lat double precision, lng double precision,
  name text, place text, attributes text[],
  cover_media_path text, cover_media_type public.media_type,
  marks_count integer, saves_count integer,
  added_by uuid, created_at timestamptz,
  distance_m double precision
)
language sql
stable
as $$
  select s.id, s.kind,
         st_y(s.geom::geometry), st_x(s.geom::geometry),
         s.name, s.place, s.attributes,
         s.cover_media_path, s.cover_media_type,
         s.marks_count, s.saves_count, s.added_by, s.created_at,
         st_distance(s.geom, st_point(in_lng, in_lat)::geography)
  from public.spots s
  where st_dwithin(s.geom, st_point(in_lng, in_lat)::geography, radius_m)
  order by s.geom <-> st_point(in_lng, in_lat)::geography
  limit max_rows;
$$;

-- ---------- the following feed ----------

create or replace function public.feed_for(viewer uuid, max_rows integer default 50)
returns table (
  id uuid, spot_id uuid, user_id uuid,
  media_path text, media_type public.media_type, poster_path text,
  caption text, saves_count integer, created_at timestamptz,
  author_handle text, author_display_name text,
  spot_name text, spot_kind public.spot_kind,
  lat double precision, lng double precision
)
language sql
stable
as $$
  select m.id, m.spot_id, m.user_id,
         m.media_path, m.media_type, m.poster_path,
         m.caption, m.saves_count, m.created_at,
         p.handle, p.display_name,
         s.name, s.kind,
         st_y(s.geom::geometry), st_x(s.geom::geometry)
  from public.marks m
  join public.profiles p on p.id = m.user_id
  join public.spots s on s.id = m.spot_id
  where m.user_id in (
    select followee_id from public.follows where follower_id = viewer
  )
  order by m.created_at desc
  limit max_rows;
$$;

-- ---------- row level security ----------

alter table public.profiles enable row level security;
alter table public.spots    enable row level security;
alter table public.marks    enable row level security;
alter table public.saves    enable row level security;
alter table public.follows  enable row level security;

-- The map is public. That is the point of a shared map.
create policy "spots readable by everyone"    on public.spots    for select using (true);
create policy "marks readable by everyone"    on public.marks    for select using (true);
create policy "profiles readable by everyone" on public.profiles for select using (true);
create policy "saves readable by everyone"    on public.saves    for select using (true);
create policy "follows readable by everyone"  on public.follows  for select using (true);

-- Writing requires an account, and you only ever write as yourself.
create policy "signed in users add spots"
  on public.spots for insert to authenticated
  with check (added_by = auth.uid());

create policy "signed in users enrich spots"
  on public.spots for update to authenticated
  using (true) with check (true);

create policy "users manage their own marks"
  on public.marks for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "users manage their own saves"
  on public.saves for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "users manage their own follows"
  on public.follows for all to authenticated
  using (follower_id = auth.uid()) with check (follower_id = auth.uid());

create policy "users manage their own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------- media storage ----------

insert into storage.buckets (id, name, public)
values ('marks', 'marks', true)
on conflict (id) do nothing;

create policy "mark media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'marks');

create policy "users upload mark media into their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'marks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users delete their own mark media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'marks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
