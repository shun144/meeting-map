import { createClient } from "@supabase/supabase-js";
import type { Database } from "./schema";

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
// const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
);
