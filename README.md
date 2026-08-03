# AI Shorts Factory

Website wrapper for the [claude-faceless-shorts-creator](../claudeshortvideos) video pipeline.
Log in, submit a topic, approve the drafted script + cost estimate, and the finished video
lands in your Google Drive. See `/Users/zaheer/.claude/plans/parallel-knitting-beaver.md` for
the full architecture plan.

**Status:** first working slice — auth + dashboard + the draft/approve/reject workflow are
built. The actual render pipeline (asset generation, Remotion render, QA loop, SFX, Drive
upload) is still stubbed (`src/lib/inngest/functions.ts`, the `stub-*` steps) pending the
Fly.io worker (build order step 4).

## One-time setup

### 1. Supabase (auth + database)

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API: copy the **Project URL**, **anon public key**, and **service_role
   key** into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`).
3. SQL Editor → New query → paste the contents of `supabase/schema.sql` → Run.
4. Authentication → Providers → enable **Google**. You'll need a Google OAuth client (next
   step) for the Client ID/Secret it asks for.
5. Authentication → URL Configuration: add `http://localhost:3000/auth/callback` as a
   redirect URL (and your production URL later).

### 2. Google OAuth client (login + Drive access, same client)

1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials →
   Create Credentials → OAuth client ID → Web application.
2. Authorized redirect URI: the **Supabase callback URL** shown on the Google provider setup
   page in Supabase (looks like `https://<project>.supabase.co/auth/v1/callback`) — not your
   app's own `/auth/callback`.
3. Enable the **Google Drive API** for the project (APIs & Services → Library).
4. Paste the Client ID/Secret into Supabase's Google provider settings (step 1.4 above).

### 3. Anthropic

Get an API key from [console.anthropic.com](https://console.anthropic.com) → `ANTHROPIC_API_KEY`.

### 4. Inngest (background workflow)

Local dev needs no account — `npx inngest-cli dev` runs a local dev server against your
Next.js app. Production deployment needs an [inngest.com](https://inngest.com) account for
`INNGEST_EVENT_KEY`/`INNGEST_SIGNING_KEY`.

### 5. Approving yourself

There's no admin UI yet. After your first Google sign-in, flip your own row in Supabase:
Table Editor → `users` → your row → `approved` → `true`.

## Running locally

```bash
npm install
cp .env.local.example .env.local   # fill in the values from above
npm run dev                         # Next.js app on :3000

# in a second terminal
npx inngest-cli dev                 # local Inngest dev server + UI on :8288
```

Visit `http://localhost:3000`, sign in with Google, approve yourself in Supabase, submit a
topic. You should see the drafted script + cost estimate appear, and after clicking Approve,
the status will cycle through the stubbed pipeline stages (3s apart) to `completed`.

## What's stubbed vs real right now

- **Real**: Google auth, the `approved` gate, job creation, Claude-drafted script + cost
  estimate, the durable approve/reject workflow (Inngest `waitForEvent`), Realtime status
  updates on the job page.
- **Stubbed**: everything after approval just sleeps and flips status — no actual voice/image
  generation, Remotion render, QA loop, SFX mix, or Drive upload yet. `draftScript()`
  (`src/lib/anthropic.ts`) also doesn't do the fact-verification web search pass the
  interactive pipeline does today — noted as a TODO in that file.
