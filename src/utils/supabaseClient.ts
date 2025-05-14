import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase URL and anon key
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://eqimyomhzpjjoycvoxxl.supabase.co";
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaW15b21oenBqam95Y3ZveHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzM1MjQsImV4cCI6MjA2MDk0OTUyNH0.grLy3Vp_j829XRT6SBqIBw28UR03MwS_gxvUfpDfXrw";

console.log("Initializing Supabase client with URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
(async () => {
  try {
    const { data, error } = await supabase
      .from("penghuni")
      .select("id")
      .limit(1);
    if (error) {
      console.error("Supabase connection test failed:", error);
    } else {
      console.log("Supabase connection successful. Sample data:", data);
    }
  } catch (e) {
    console.error("Error testing Supabase connection:", e);
  }
})();
