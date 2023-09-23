import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.supabaseURL;
const supabaseKey = process.env.supabaseKey;

const supabase = createClient(supabaseUrl, supabaseKey,  { multiTab: false });

export default supabase;
