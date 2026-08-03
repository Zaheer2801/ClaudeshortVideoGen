import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Exchanges the OAuth code for a session, then upserts our `public.users` profile
// row and stashes the Google refresh token (needed later for unattended Drive
// uploads — the user won't be present when a background job finishes).
// TODO before production: encrypt refresh_token at rest instead of storing it
// plain (see plan: `google_refresh_token_encrypted`). Left plain here so the
// auth flow can be verified end-to-end first; encrypt before inviting real users.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const { user, provider_refresh_token } = data.session as unknown as {
        user: { id: string; email?: string };
        provider_refresh_token?: string;
      };

      await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          ...(provider_refresh_token ? { google_refresh_token: provider_refresh_token } : {}),
        },
        { onConflict: 'id' }
      );

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
