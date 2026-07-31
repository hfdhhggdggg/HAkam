-- CODA Fitness Test Tables Migration
-- Run this in the Supabase SQL Editor (SQL > New Query)
-- ==============================================================================

-- 1. Configuration table: stores test distances and time limits per rank
CREATE TABLE IF NOT EXISTS coda_test_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint1_m numeric NOT NULL DEFAULT 10,
  lateral_right_m numeric NOT NULL DEFAULT 8,
  lateral_left_m numeric NOT NULL DEFAULT 8,
  sprint2_m numeric NOT NULL DEFAULT 10,
  limit_international numeric,
  limit_first numeric,
  limit_second numeric,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE coda_test_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_coda_configs" ON coda_test_configs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_coda_configs" ON coda_test_configs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_coda_configs" ON coda_test_configs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_coda_configs" ON coda_test_configs FOR DELETE TO anon, authenticated USING (true);

-- 2. Sessions table: records each test session
CREATE TABLE IF NOT EXISTS coda_test_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES coda_test_configs(id),
  test_date date NOT NULL DEFAULT CURRENT_DATE,
  referee_ids jsonb NOT NULL DEFAULT '[]',
  groups_json jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coda_test_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_coda_sessions" ON coda_test_sessions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_coda_sessions" ON coda_test_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_coda_sessions" ON coda_test_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_coda_sessions" ON coda_test_sessions FOR DELETE TO anon, authenticated USING (true);

-- 3. Results table: per-referee results for a session
CREATE TABLE IF NOT EXISTS coda_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES coda_test_sessions(id) ON DELETE CASCADE,
  referee_id text NOT NULL,
  referee_name text NOT NULL,
  referee_rank text NOT NULL,
  time1 numeric,
  time2 numeric,
  result text CHECK (result IN ('pass', 'retry', 'fail', 'pending')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coda_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_coda_results" ON coda_test_results FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_coda_results" ON coda_test_results FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_coda_results" ON coda_test_results FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_coda_results" ON coda_test_results FOR DELETE TO anon, authenticated USING (true);

-- 4. Insert a default config row
INSERT INTO coda_test_configs (sprint1_m, lateral_right_m, lateral_left_m, sprint2_m)
VALUES (10, 8, 8, 10)
ON CONFLICT DO NOTHING;
