import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eqimyomhzpjjoycvoxxl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaW15b21oenBqam95Y3ZveHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzM1MjQsImV4cCI6MjA2MDk0OTUyNH0.grLy3Vp_j829XRT6SBqIBw28UR03MwS_gxvUfpDfXrw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
