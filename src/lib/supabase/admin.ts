import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Service-role client for background work (Inngest functions, the render
// worker) that runs outside any user's request/session context and needs to
// write to jobs regardless of RLS. NEVER import this into client components
// or anywhere it could leak to the browser — server-only, full DB access.
export function createAdminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
