import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const sql = `
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
    DROP POLICY IF EXISTS "anon_select_coda_configs" ON coda_test_configs;
    CREATE POLICY "anon_select_coda_configs" ON coda_test_configs FOR SELECT TO anon, authenticated USING (true);
    DROP POLICY IF EXISTS "anon_insert_coda_configs" ON coda_test_configs;
    CREATE POLICY "anon_insert_coda_configs" ON coda_test_configs FOR INSERT TO anon, authenticated WITH CHECK (true);
    DROP POLICY IF EXISTS "anon_update_coda_configs" ON coda_test_configs;
    CREATE POLICY "anon_update_coda_configs" ON coda_test_configs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
    DROP POLICY IF EXISTS "anon_delete_coda_configs" ON coda_test_configs;
    CREATE POLICY "anon_delete_coda_configs" ON coda_test_configs FOR DELETE TO anon, authenticated USING (true);

    CREATE TABLE IF NOT EXISTS coda_test_sessions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      config_id uuid REFERENCES coda_test_configs(id),
      test_date date NOT NULL DEFAULT CURRENT_DATE,
      referee_ids jsonb NOT NULL DEFAULT '[]',
      groups_json jsonb NOT NULL DEFAULT '[]',
      created_at timestamptz DEFAULT now()
    );
    ALTER TABLE coda_test_sessions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "anon_select_coda_sessions" ON coda_test_sessions;
    CREATE POLICY "anon_select_coda_sessions" ON coda_test_sessions FOR SELECT TO anon, authenticated USING (true);
    DROP POLICY IF EXISTS "anon_insert_coda_sessions" ON coda_test_sessions;
    CREATE POLICY "anon_insert_coda_sessions" ON coda_test_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
    DROP POLICY IF EXISTS "anon_update_coda_sessions" ON coda_test_sessions;
    CREATE POLICY "anon_update_coda_sessions" ON coda_test_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
    DROP POLICY IF EXISTS "anon_delete_coda_sessions" ON coda_test_sessions;
    CREATE POLICY "anon_delete_coda_sessions" ON coda_test_sessions FOR DELETE TO anon, authenticated USING (true);

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
    DROP POLICY IF EXISTS "anon_select_coda_results" ON coda_test_results;
    CREATE POLICY "anon_select_coda_results" ON coda_test_results FOR SELECT TO anon, authenticated USING (true);
    DROP POLICY IF EXISTS "anon_insert_coda_results" ON coda_test_results;
    CREATE POLICY "anon_insert_coda_results" ON coda_test_results FOR INSERT TO anon, authenticated WITH CHECK (true);
    DROP POLICY IF EXISTS "anon_update_coda_results" ON coda_test_results;
    CREATE POLICY "anon_update_coda_results" ON coda_test_results FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
    DROP POLICY IF EXISTS "anon_delete_coda_results" ON coda_test_results;
    CREATE POLICY "anon_delete_coda_results" ON coda_test_results FOR DELETE TO anon, authenticated USING (true);

    INSERT INTO coda_test_configs (sprint1_m, lateral_right_m, lateral_left_m, sprint2_m)
    VALUES (10, 8, 8, 10)
    ON CONFLICT DO NOTHING;
  `;

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { "x-client-info": "edge-function" } } }
    );

    const { data, error } = await supabase.rpc("exec_sql", { sql_text: sql });
    if (error) {
      // Try alternative: use the pg connection
      return new Response(JSON.stringify({ error: error.message, hint: "exec_sql function not found - run the SQL migration manually" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
