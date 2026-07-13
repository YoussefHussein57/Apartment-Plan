-- خطة تجهيز الشقة — Supabase schema
-- Run this whole file once in the Supabase SQL editor (Project -> SQL Editor -> New query).

create extension if not exists pgcrypto;

create type item_section as enum ('finishing', 'furniture', 'appliances');
create type item_status as enum ('not_started', 'in_progress', 'done');
create type item_priority as enum ('low', 'medium', 'high');

create table settings (
  id int primary key default 1,
  salary numeric not null default 0,
  living_expense numeric not null default 0,
  gam3eya1_installment numeric not null default 0,
  gam3eya1_end_date date,
  gam3eya2_installment numeric not null default 0,
  gam3eya2_end_date date,
  sept_lumpsum numeric not null default 0,
  sept_month date,
  nov_lumpsum numeric not null default 0,
  nov_month date,
  furniture_share_pct numeric not null default 0.5,
  plan_start_date date,
  saved_cash numeric not null default 0,
  gold_grams_21k numeric not null default 0,
  gold_grams_24k numeric not null default 0,
  usd_amount numeric not null default 0,
  eur_amount numeric not null default 0,
  constraint settings_single_row check (id = 1)
);

create table items (
  id uuid primary key default gen_random_uuid(),
  section item_section not null,
  name text not null,
  budget numeric not null default 0,
  total_cost numeric,
  status item_status not null default 'not_started',
  priority item_priority not null default 'medium',
  start_date date,
  end_date date,
  purchase_date date,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete set null,
  date date not null default current_date,
  amount numeric not null,
  method text,
  notes text,
  created_at timestamptz not null default now()
);

create view item_totals as
select
  i.*,
  coalesce(p.paid, 0) as paid,
  greatest(i.budget - coalesce(p.paid, 0), 0) as remaining,
  case when i.budget = 0 then (case when coalesce(p.paid,0) > 0 then 1 else 0 end)
       else least(coalesce(p.paid,0) / i.budget, 1) end as progress
from items i
left join (
  select item_id, sum(amount) as paid
  from payments
  group by item_id
) p on p.item_id = i.id;

create view section_totals as
select
  section,
  sum(budget) as budget,
  sum(paid) as paid,
  sum(remaining) as remaining
from item_totals
group by section;

-- Row Level Security: this app has no login (per the "private link only" choice),
-- so the anon key gets full read/write access. Keep the project URL/anon key out of
-- any public repo and treat the deployed URL as a secret.
alter table settings enable row level security;
alter table items enable row level security;
alter table payments enable row level security;

create policy "anon full access" on settings for all using (true) with check (true);
create policy "anon full access" on items for all using (true) with check (true);
create policy "anon full access" on payments for all using (true) with check (true);

-- Seed data mirroring the original Excel plan --------------------------------

insert into settings (
  id, salary, living_expense,
  gam3eya1_installment, gam3eya1_end_date,
  gam3eya2_installment, gam3eya2_end_date,
  sept_lumpsum, sept_month,
  nov_lumpsum, nov_month,
  furniture_share_pct, plan_start_date
) values (
  1, 23200, 6000,
  5000, '2027-01-31',
  5000, '2027-03-31',
  25000, '2026-09-01',
  25000, '2026-11-01',
  0.5, '2026-08-01'
);

insert into items (section, name, budget, status, priority, sort_order, notes) values
  ('finishing', 'حمام', 40000, 'not_started', 'medium', 1, null),
  ('finishing', 'سباكة', 0, 'not_started', 'medium', 2, null),
  ('finishing', 'عزل', 0, 'not_started', 'medium', 3, null),
  ('finishing', 'سيراميك', 15000, 'not_started', 'medium', 4, null),
  ('finishing', 'مطبخ', 50000, 'not_started', 'medium', 5, null),
  ('finishing', 'بلكونة', 15000, 'not_started', 'medium', 6, null),
  ('finishing', 'نقاشة', 12000, 'not_started', 'medium', 7, null),
  ('finishing', 'إضاءات', 7000, 'not_started', 'medium', 8, null),
  ('finishing', 'أدوات صحية', 15000, 'not_started', 'medium', 9, null),
  ('finishing', 'ثلاجة', 30000, 'not_started', 'medium', 10, null);

insert into items (section, name, budget, total_cost, status, priority, sort_order, notes) values
  ('furniture', 'أوضة النوم', 35000, 70000, 'not_started', 'medium', 1, null),
  ('furniture', 'الركنة', 17500, 35000, 'not_started', 'medium', 2, null),
  ('furniture', 'السفرة', 17500, 35000, 'not_started', 'medium', 3, null),
  ('furniture', 'ترابيزة التلفزيون', 6000, 12000, 'not_started', 'medium', 4, null),
  ('furniture', 'المكتب', 5000, 10000, 'not_started', 'medium', 5, null);

insert into items (section, name, budget, status, priority, sort_order, notes) values
  ('appliances', 'ثلاجة', 30000, 'not_started', 'medium', 1, null),
  ('appliances', 'غسالة أطباق', 0, 'done', 'medium', 2, 'تم شراؤها بالفعل'),
  ('appliances', 'بوتاجاز', 0, 'not_started', 'medium', 3, null),
  ('appliances', 'غسالة', 0, 'not_started', 'medium', 4, null),
  ('appliances', 'ميكروويف', 0, 'not_started', 'medium', 5, null),
  ('appliances', 'شفاط', 0, 'not_started', 'medium', 6, null);
