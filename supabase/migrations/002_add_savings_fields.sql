-- Run this once in your existing project's SQL Editor to add savings/asset
-- tracking fields to the settings table (cash, gold at 21k and 24k, USD, EUR).

alter table settings add column if not exists saved_cash numeric not null default 0;
alter table settings add column if not exists gold_grams_21k numeric not null default 0;
alter table settings add column if not exists gold_grams_24k numeric not null default 0;
alter table settings add column if not exists usd_amount numeric not null default 0;
alter table settings add column if not exists eur_amount numeric not null default 0;
