-- Create a table for storing registered users and their roles
create extension if not exists "pgcrypto";

create table if not exists user_roles (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  role text not null default 'user',
  created_at timestamptz default now()
);

alter table user_roles enable row level security;

create policy "Allow inserts into user_roles" on user_roles
  for insert with check (true);

create policy "Allow authenticated selects on user_roles" on user_roles
  for select using (auth.role() = 'authenticated');

-- Create a table for storing orders from checkout
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  user_email text,
  full_name text not null,
  phone text not null,
  city text not null,
  nova_branch text not null,
  comment text,
  order_items jsonb not null,
  total numeric not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Allow inserts into orders" on orders
  for insert with check (true);

create policy "Allow authenticated selects on orders" on orders
  for select using (auth.uid() = user_id);
