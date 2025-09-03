import { createClient } from '@supabase/supabase-js';

// 1. Read the variables from the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Add validation checks to provide clear error messages
if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is not set. Please create a .env file in your project root and add the variable.");
}
if (!supabaseKey) {
    throw new Error("VITE_SUPABASE_ANON_KEY is not set. Please create a .env file in your project root and add the variable.");
}

// 3. Create the client only if the variables exist
const supabase = createClient(supabaseUrl, supabaseKey); 

export default supabase;