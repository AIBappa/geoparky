import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cgwyggytcflriaptnkvr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd3lnZ3l0Y2ZscmlhcHRua3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2MjQ5OTQsImV4cCI6MTk5NjIwMDk5NH0.Qd4kAP27hz5su1sHjozFsXPvd8hD29qSqeMEipE_1NM";

const supabase = createClient(supabaseUrl, supabaseKey,  { multiTab: false });

export default supabase;