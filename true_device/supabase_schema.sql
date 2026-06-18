
create extension if not exists "pgcrypto";

create table if not exists user_roles (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  role text not null default 'user',
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  image_url text,
  category text not null default 'Аксесуари',
  created_at timestamptz default now()
);


create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);


insert into categories (name) values
  ('Телефони'),
  ('Навушники'),
  ('Ноутбуки'),
  ('Планшети'),
  ('Годинники'),
  ('Аксесуари')
on conflict (name) do nothing;


create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);


create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  full_name text,
  phone text,
  avatar_url text,
  address jsonb,
  city text,
  country text,
  postal_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


alter table if exists profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists avatar_url text,
  add column if not exists address jsonb,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists postal_code text,
  add column if not exists updated_at timestamptz default now();
