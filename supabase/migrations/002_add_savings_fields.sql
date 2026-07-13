-- Run this once in your existing project's SQL Editor to add savings/asset
-- tracking fields to the settings table (cash, gold, USD, EUR holdings).

alter table settings add column if not exists saved_cash numeric not null default 0;
alter table settings add column if not exists gold_grams numeric not null default 0;
alter table settings add column if not exists gold_karat int not null default 21;
alter table settings add column if not exists usd_amount numeric not null default 0;
alter table settings add column if not exists eur_amount numeric not null default 0;

alter table settings drop constraint if exists settings_gold_karat;
alter table settings add constraint settings_gold_karat check (gold_karat in (21, 24));
