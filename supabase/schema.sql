-- =============================================
-- MAMINA Artesanías — Supabase Schema
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- Tabla de productos
create table if not exists products (
  id          bigserial primary key,
  name        text not null,
  description text,
  price       numeric(10,2) not null check (price > 0),
  stock       int default 0 check (stock >= 0),
  image_url   text,
  category    text,
  delivery    text[] default '{"retiro"}',
  accepts_mp  boolean default true,
  visible     boolean default true,
  created_at  timestamptz default now()
);

-- Tabla de órdenes
create table if not exists orders (
  id                bigserial primary key,
  mp_preference_id  text,
  mp_payment_id     text,
  status            text default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  items             jsonb not null default '[]',
  total             numeric(10,2) not null,
  customer_email    text,
  address           jsonb,
  shipping_cost     numeric(10,2) default 0,
  created_at        timestamptz default now()
);

-- Tabla para sesiones del bot de Telegram (reemplaza Map en memoria)
create table if not exists bot_sessions (
  chat_id     bigint primary key,
  data        jsonb not null default '{}',
  updated_at  timestamptz default now()
);

-- Índices
create index if not exists products_visible_idx on products (visible, created_at desc);
create index if not exists products_category_idx on products (category, visible);
create index if not exists orders_status_idx on orders (status, created_at desc);

-- RLS (Row Level Security)
alter table products enable row level security;
alter table orders enable row level security;
alter table bot_sessions enable row level security;

-- Política: productos visibles son públicos
create policy "productos_publicos" on products
  for select using (visible = true);

-- Política: órdenes solo desde el backend (service role)
create policy "ordenes_solo_servicio" on orders
  for all using (false);

-- Política: bot_sessions solo desde el backend (service role)
create policy "bot_sessions_solo_servicio" on bot_sessions
  for all using (false);

-- Storage bucket para imágenes
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do nothing;

-- Política: subida solo con service role (desde el bot)
create policy "imagenes_publicas" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "imagenes_upload_servicio" on storage.objects
  for insert with check (bucket_id = 'product-images');

-- =============================================
-- Migraciones para bases de datos existentes
-- (correr solo si la tabla ya existe)
-- =============================================
-- alter table products add column if not exists category text;
-- alter table orders add column if not exists address jsonb;
-- alter table orders add column if not exists shipping_cost numeric(10,2) default 0;
