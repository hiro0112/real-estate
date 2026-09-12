-- ============================================================
-- 不動産管理アプリ：物件テーブルのスキーマ定義
-- Supabaseダッシュボードの SQL Editor でそのまま実行してください。
-- ============================================================

-- gen_random_uuid() を使うための拡張機能（Supabaseでは通常デフォルトで有効）
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 物件テーブル（properties）
-- 物件名・家賃・エリア・間取りに加え、登録したユーザーのIDを保持する
-- ------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),

  -- 物件を登録したユーザーのID（未指定の場合はログイン中のユーザーIDが自動で入る）
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,

  name text not null,       -- 物件名
  rent integer not null,    -- 家賃（円）
  area text not null,       -- エリア名
  layout text not null,     -- 間取り（例：1LDK）

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- user_id での絞り込み（RLSのポリシー評価）を高速化するためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- ------------------------------------------------------------
-- updated_at を更新のたびに自動更新するトリガー
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
  before update on public.properties
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- RLS（Row Level Security）の有効化
-- ------------------------------------------------------------
alter table public.properties enable row level security;

-- 自分が登録した物件のみ閲覧できる
drop policy if exists "Users can view their own properties" on public.properties;
create policy "Users can view their own properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のuser_idとしてのみ物件を登録できる
drop policy if exists "Users can insert their own properties" on public.properties;
create policy "Users can insert their own properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
drop policy if exists "Users can update their own properties" on public.properties;
create policy "Users can update their own properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
drop policy if exists "Users can delete their own properties" on public.properties;
create policy "Users can delete their own properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);
