-- Supabase schema for True Device
-- Run this in Supabase SQL editor to create the required tables.

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
  created_at timestamptz default now()
);

-- Table for messages sent from the Contact form
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);
