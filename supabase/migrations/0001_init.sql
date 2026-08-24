-- ============================================================
-- Perch — initial schema
--
-- One idea per table. Benches are places; sits are what happened
-- when somebody used one. Ratings live on the sit, never on the
-- bench — the bench only carries rolling averages so the map can
-- render without an aggregate query per pin.
-- ============================================================

create extension if not exists postgis;
create extension if not exists "uuid-ossp";

-- ---------- profiles ----------

create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  handle      text unique not null check (handle ~ '^[a-z0-9_]{3,20}$'),
  display_name text,
  created_at  timestamptz not null default now()
);

-- ---------- benches ----------

create type public.bench_source as enum ('osm', 'user');

create table public.benches (
  id          uuid primary key default uuid_generate_v4(),

  -- Set for anything imported from OpenStreetMap. Unique so re-running
  -- the seed script is idempotent rather than duplicating the city.
  osm_id      bigint unique,
  source      public.bench_source not null default 'user',

  geom        geography(Point, 4326) not null,
  city        text not null,
  name        text,

  -- The attributes open data does not carry. Text array rather than a
  -- column each, so adding one is a seed change and not a migration.
  attributes  text[] not null default '{}',

  -- Rolling averages, maintained by trigger. Null until somebody sits.
  avg_view    numeric(3,2),
  avg_shade   numeric(3,2),
  avg_comfort numeric(3,2),
  sit_count   integer not null default 0,

  added_by    uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index benches_geom_idx on public.benches using gist (geom);
create index benches_city_idx on public.benches (city);

-- ---------- sits ----------

create table public.sits (
  id         uuid primary key default uuid_generate_v4(),
  bench_id   uuid not null references public.benches(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,

  view       smallint not null check (view between 1 and 5),
  shade      smallint not null check (shade between 1 and 5),
  comfort    smallint not null check (comfort between 1 and 5),

  note       text check (char_length(note) <= 280),
  photo_path text,
  created_at timestamptz not null default now(),

  -- One rating per person per bench. They can update it; they cannot
  -- stuff the ballot box for their local favourite.
  unique (bench_id, user_id)
);

create index sits_bench_idx on public.sits (bench_id, created_at desc);
create index sits_user_idx  on public.sits (user_id, created_at desc);

-- ---------- rolling averages ----------

create or replace function public.refresh_bench_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.bench_id, old.bench_id);
begin
  update public.benches b
  set avg_view    = s.avg_view,
      avg_shade   = s.avg_shade,
      avg_comfort = s.avg_comfort,
      sit_count   = s.n
  from (
    select avg(view)::numeric(3,2)    as avg_view,
           avg(shade)::numeric(3,2)   as avg_shade,
           avg(comfort)::numeric(3,2) as avg_comfort,
           count(*)                   as n
    from public.sits
    where bench_id = target
  ) s
  where b.id = target;

  return null;
end;
$$;

create trigger sits_refresh_stats
after insert or update or delete on public.sits
for each row execute function public.refresh_bench_stats();

-- ---------- nearby lookup ----------

create or replace function public.benches_nearby(
  in_lat    double precision,
  in_lng    double precision,
  radius_m  integer default 1200,
  max_rows  integer default 200
)
returns table (
  id uuid, osm_id bigint, source public.bench_source,
  lat double precision, lng double precision,
  name text, city text, attributes text[],
  avg_view numeric, avg_shade numeric, avg_comfort numeric,
  sit_count integer, distance_m double precision
)
language sql
stable
as $$
  select b.id, b.osm_id, b.source,
         st_y(b.geom::geometry), st_x(b.geom::geometry),
         b.name, b.city, b.attributes,
         b.avg_view, b.avg_shade, b.avg_comfort, b.sit_count,
         st_distance(b.geom, st_point(in_lng, in_lat)::geography)
  from public.benches b
  where st_dwithin(b.geom, st_point(in_lng, in_lat)::geography, radius_m)
  order by b.geom <-> st_point(in_lng, in_lat)::geography
  limit max_rows;
$$;

-- ---------- row level security ----------

alter table public.profiles enable row level security;
alter table public.benches  enable row level security;
alter table public.sits     enable row level security;

-- The map is public. That is the whole point.
create policy "benches are readable by everyone"
  on public.benches for select using (true);

create policy "sits are readable by everyone"
  on public.sits for select using (true);

create policy "profiles are readable by everyone"
  on public.profiles for select using (true);

-- Writing requires an account.
create policy "signed in users can add benches"
  on public.benches for insert to authenticated
  with check (added_by = auth.uid() and source = 'user');

create policy "signed in users can enrich bench attributes"
  on public.benches for update to authenticated
  using (true) with check (true);

create policy "users manage their own sits"
  on public.sits for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "users manage their own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------- photo storage ----------

insert into storage.buckets (id, name, public)
values ('sit-photos', 'sit-photos', true)
on conflict (id) do nothing;

create policy "sit photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'sit-photos');

create policy "users upload sit photos into their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'sit-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
