'use client';

import { createClient } from '@/lib/supabase/client';

// Google is the only auth provider — deliberately. It doubles as the OAuth
// grant for Drive access (drive.file scope) so there's no separate "connect
// your Drive" step later. access_type=offline + prompt=consent gets us a
// refresh token even on repeat sign-ins.
export default function LoginPage() {
  const supabase = createClient();

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'https://www.googleapis.com/auth/drive.file',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 px-6 text-center text-neutral-100">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">AI Shorts Factory</h1>
        <p className="mt-2 text-neutral-400">Tell it a topic. Get a video in your Drive.</p>
      </div>
      <button
        onClick={signIn}
        className="rounded-lg bg-white px-5 py-2.5 font-medium text-neutral-900 transition hover:bg-neutral-200"
      >
        Sign in with Google
      </button>
    </main>
  );
}
