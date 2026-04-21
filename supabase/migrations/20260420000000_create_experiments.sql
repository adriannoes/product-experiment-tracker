-- Migration: create_experiments
-- Applied: 2026-04-20
-- Project: replace with your Supabase project name / ref in your own environment
--
-- SECURITY NOTE (demo mode):
--   RLS is enabled. DELETE is intentionally NOT granted to the `anon` role
--   because the anon key is bundled in the browser JS bundle and is therefore
--   publicly readable. Any user with the key could wipe all data via a direct
--   Supabase REST call if DELETE were allowed.
--
--   Next hardening step: Supabase Auth + user_id column + per-user RLS policies.
--   Do NOT use these policies in a multi-tenant or public-facing production app.

-- Domain for status values.
-- Using a named domain (instead of an inline CHECK) ensures the UTF-8 special
-- characters (em-dash U+2014, accented letters) are defined once and shared.
CREATE DOMAIN experiment_status AS text
  CHECK (VALUE IN (
    'Backlog',
    'Em andamento',
    'Concluído — Validada',
    'Concluído — Invalidada'
  ));

-- Main experiments table.
-- id is sent by the client (crypto.randomUUID()) — DB does NOT generate it.
-- criado_em is sent by the client (new Date().toISOString()).
-- atualizado_em is managed exclusively by the trigger below; the app never
-- writes it directly to avoid clock-skew inconsistencies.
CREATE TABLE experiments (
  id             uuid          PRIMARY KEY,
  nome           text          NOT NULL,
  metrica_sucesso text         NOT NULL,
  status         experiment_status NOT NULL,
  aprendizado    text,                          -- PRD v1.1: nullable, reserved
  criado_em      timestamptz   NOT NULL,
  atualizado_em  timestamptz   NOT NULL DEFAULT now()
);

-- Index for the default list order (criado_em DESC).
CREATE INDEX ON experiments (criado_em DESC);

-- Trigger: keep atualizado_em fresh on every UPDATE.
-- The app reads this value back after each mutation via `returning`.
CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_atualizado_em
BEFORE UPDATE ON experiments
FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- Row Level Security (demo mode).
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select" ON experiments
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert" ON experiments
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update" ON experiments
  FOR UPDATE TO anon USING (true);

-- DELETE is intentionally NOT granted to anon (see security note above).
