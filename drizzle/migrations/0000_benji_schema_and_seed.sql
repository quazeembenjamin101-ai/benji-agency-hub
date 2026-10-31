-- Benji Agency schema + seed data
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text,
  email text not null,
  build text,
  source text not null default 'contact',
  status text not null default 'New',
  amount numeric not null default 0,
  call_when timestamptz,
  msgs jsonb not null default '[]'::jsonb,
  ts timestamptz not null default now(),
  close date
);

create table public.members (
  user_id uuid primary key,
  name text not null,
  joined_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  author_name text not null default 'Member',
  category text not null default 'General',
  content text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid not null,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  rating int not null default 5,
  text text not null,
  created_at timestamptz not null default now()
);

create table public.keywords (
  id int generated always as identity primary key,
  keyword text not null unique,
  category text not null,
  custom boolean not null default false
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_at timestamptz not null,
  kind text not null default 'event'
);

create table public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  visitor text not null,
  ts timestamptz not null default now()
);

-- ===== GRANTs =====
grant select, update on public.profiles to authenticated;
grant all on public.user_roles to service_role;
grant select on public.user_roles to authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant insert on public.leads to anon;
grant all on public.leads to service_role;
grant select, insert, update on public.members to authenticated;
grant select on public.members to anon;
grant all on public.members to service_role;
grant select on public.posts to anon;
grant select, insert, delete on public.posts to authenticated;
grant all on public.posts to service_role;
grant select on public.post_likes to anon;
grant select, insert, delete on public.post_likes to authenticated;
grant all on public.post_likes to service_role;
grant select on public.post_comments to anon;
grant select, insert, delete on public.post_comments to authenticated;
grant all on public.post_comments to service_role;
grant select on public.reviews to anon;
grant insert on public.reviews to anon;
grant select, insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
grant select, insert, update, delete on public.keywords to authenticated;
grant all on public.keywords to service_role;
grant select on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
grant insert on public.page_views to anon;
grant select on public.page_views to authenticated;
grant all on public.page_views to service_role;

-- ===== RLS =====
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.leads enable row level security;
alter table public.members enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.reviews enable row level security;
alter table public.keywords enable row level security;
alter table public.events enable row level security;
alter table public.page_views enable row level security;

create policy "profiles readable by authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(coalesce(new.email, 'member'), '@', 1))
  on conflict (id) do nothing;
  -- the first person to sign up becomes the owner (admin)
  if not exists (select 1 from public.user_roles) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create policy "leads anyone can submit" on public.leads for insert to anon, authenticated with check (true);
create policy "admin reads leads" on public.leads for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin updates leads" on public.leads for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin deletes leads" on public.leads for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "members public roster" on public.members for select to anon, authenticated using (true);
create policy "members self join" on public.members for insert to authenticated with check (auth.uid() = user_id);
create policy "members self update" on public.members for update to authenticated using (auth.uid() = user_id);

create policy "posts public read" on public.posts for select to anon, authenticated using (true);
create policy "posts members write" on public.posts for insert to authenticated with check (auth.uid() = user_id);
create policy "posts own or admin delete" on public.posts for delete to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "likes public read" on public.post_likes for select to anon, authenticated using (true);
create policy "likes own toggle" on public.post_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "likes own remove" on public.post_likes for delete to authenticated using (auth.uid() = user_id);

create policy "comments public read" on public.post_comments for select to anon, authenticated using (true);
create policy "comments members write" on public.post_comments for insert to authenticated with check (auth.uid() = user_id);
create policy "comments own or admin delete" on public.post_comments for delete to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "reviews public read" on public.reviews for select to anon, authenticated using (true);
create policy "reviews anyone can write" on public.reviews for insert to anon, authenticated with check (true);
create policy "admin manages reviews" on public.reviews for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin deletes reviews" on public.reviews for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "admin reads keywords" on public.keywords for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin writes keywords" on public.keywords for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "admin updates keywords" on public.keywords for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin deletes keywords" on public.keywords for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "events public read" on public.events for select to anon, authenticated using (true);
create policy "admin manages events" on public.events for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "anyone records a view" on public.page_views for insert to anon, authenticated with check (true);
create policy "admin reads views" on public.page_views for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ===== SEED =====
insert into public.leads (name, email, source, status, amount, build, ts) values
  ('Ada O.','ada@example.com','contact','New',8750,'Nile Site Revamp', now() - interval '2 days'),
  ('Chidi N.','chidi@example.com','community','Contacted',12300,'Beta Launch Site', now() - interval '4 days'),
  ('Maria L.','maria@example.com','ai-chat','Proposal',15500,'Summit Digital Site', now() - interval '6 days'),
  ('Sam K.','sam@example.com','newsletter','Demo',11900,'Vanguard Access Page', now() - interval '8 days'),
  ('Tola A.','tola@example.com','call','Won',19100,'Titan Crest Launch', now() - interval '11 days'),
  ('Ben R.','ben@example.com','contact','Contract',17200,'Optima Route Landing', now() - interval '13 days'),
  ('Zed K.','zed@example.com','contact','Lost',9200,'AJ Investments', now() - interval '15 days');

insert into public.posts (author_name, category, content, pinned) values
  ('Benji Agency · Admin','Announcements','Welcome to the Benji community! Introduce yourself, share what you are building and ask questions. We are here to help.', true),
  ('Quazeem B.','General','New here? Start with the Classroom tab — three short tracks on websites, conversion and AI automation.', false),
  ('Ada O.','Wins','Launched my bakery site last week and got three enquiries in two days. The onboarding checklist helped a lot!', false);

insert into public.keywords (keyword, category)
select b.k || case when m.m = '' then '' else ' ' || m.m end, b.k
from (values
  ('wordpress development','wordpress migration','wordpress fix','wordpress template design','website redesign','web design','ecommerce website','multi vendor marketplace','shopify store setup','woocommerce development','webflow development','framer website design','figma ui design','ui ux design','mobile app development','full stack development','crm development','erp software development','booking system development','inventory management system','ai chatbot development','ai agent development','workflow automation','business automation','email marketing','klaviyo expert','lead generation','funnel building','conversion rate optimization','seo services','local seo','google business profile','technical seo','content seo','social media management','video editing','animation design','lottie animation','explainer video','logo design','brand identity design','graphic design','flyer design','brochure design','landing page design','website maintenance','web3 development','smart contract development','dapp development')
) as b(k),
(values
  ('','agency','services','company','cost','near me','for small business','hire','freelancer','expert','consultant','pricing')
) as m(m);