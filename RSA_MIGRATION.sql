-- RSA Test Schema Migration
-- Run this in the Supabase SQL Editor (SQL > New Query)
-- ==============================================================================

-- 1. RSA Test Configs (one row, updated each time)
CREATE TABLE IF NOT EXISTS rsa_test_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  distance_before_m numeric NOT NULL DEFAULT 1.5,
  sprint_distance_m numeric NOT NULL DEFAULT 40,
  attempts_count integer NOT NULL DEFAULT 6,
  rest_seconds integer NOT NULL DEFAULT 60,
  limit_ref_international numeric,
  limit_ast_international numeric,
  limit_ref_first numeric,
  limit_ast_first numeric,
  limit_ref_second numeric,
  limit_ast_second numeric,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE rsa_test_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_rsa_configs" ON rsa_test_configs;
CREATE POLICY "anon_select_rsa_configs" ON rsa_test_configs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_rsa_configs" ON rsa_test_configs;
CREATE POLICY "anon_insert_rsa_configs" ON rsa_test_configs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_rsa_configs" ON rsa_test_configs;
CREATE POLICY "anon_update_rsa_configs" ON rsa_test_configs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_rsa_configs" ON rsa_test_configs;
CREATE POLICY "anon_delete_rsa_configs" ON rsa_test_configs FOR DELETE TO anon, authenticated USING (true);

-- 2. RSA Test Sessions (one per test run)
CREATE TABLE IF NOT EXISTS rsa_test_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES rsa_test_configs(id) ON DELETE SET NULL,
  test_date date NOT NULL DEFAULT CURRENT_DATE,
  referee_ids jsonb NOT NULL DEFAULT '[]',
  groups_json jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE rsa_test_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_rsa_sessions" ON rsa_test_sessions;
CREATE POLICY "anon_select_rsa_sessions" ON rsa_test_sessions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_rsa_sessions" ON rsa_test_sessions;
CREATE POLICY "anon_insert_rsa_sessions" ON rsa_test_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_rsa_sessions" ON rsa_test_sessions;
CREATE POLICY "anon_update_rsa_sessions" ON rsa_test_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_rsa_sessions" ON rsa_test_sessions;
CREATE POLICY "anon_delete_rsa_sessions" ON rsa_test_sessions FOR DELETE TO anon, authenticated USING (true);

-- 3. RSA Test Results (one row per referee per session)
CREATE TABLE IF NOT EXISTS rsa_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES rsa_test_sessions(id) ON DELETE CASCADE,
  referee_id text NOT NULL,
  referee_name text,
  referee_rank text,
  times_json jsonb NOT NULL DEFAULT '[]',
  extra_time numeric,
  result text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE rsa_test_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_rsa_results" ON rsa_test_results;
CREATE POLICY "anon_select_rsa_results" ON rsa_test_results FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_rsa_results" ON rsa_test_results;
CREATE POLICY "anon_insert_rsa_results" ON rsa_test_results FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_rsa_results" ON rsa_test_results;
CREATE POLICY "anon_update_rsa_results" ON rsa_test_results FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_rsa_results" ON rsa_test_results;
CREATE POLICY "anon_delete_rsa_results" ON rsa_test_results FOR DELETE TO anon, authenticated USING (true);
