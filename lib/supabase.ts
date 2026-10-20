import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hzysabgjbcypfydeigkh.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6eXNhYmdqYmN5cGZ5ZGVpZ2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjIxMjk2OSwiZXhwIjoyMTA3Nzg4OTY5fQ.2te043w-UVmprA-cPwBfeICOofkw9mM_6V-ojWKVXyk";

export const supabase = createClient(supabaseUrl, supabaseKey);
