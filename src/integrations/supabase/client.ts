// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://axujvekzqtlshmdubrjw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWp2ZWt6cXRsc2htZHVicmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTg5NjAsImV4cCI6MjA2NTU5NDk2MH0.3mQBoqCZpEIC-6qLPxwausAbuZyzI8qr8Lou2cir9C8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);