import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createJob } from './actions';
import { TRACKS, STATUS_LABEL, type VideoJob } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: jobs } = await supabase
    .from('video_jobs')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .returns<VideoJob[]>();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-10 px-6 py-16">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">New video</h1>
        <p className="mt-1 text-sm text-neutral-500">Signed in as {user?.email}</p>
      </header>

      <form action={createJob} className="flex flex-col gap-4 rounded-xl border border-neutral-800 p-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-300">What&apos;s it about?</span>
          <textarea
            name="topic"
            required
            rows={3}
            placeholder="e.g. how the James Webb telescope actually works"
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium text-neutral-300">Style</legend>
          {TRACKS.map((t, i) => (
            <label key={t.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-800 p-3 has-[:checked]:border-neutral-400">
              <input type="radio" name="track" value={t.id} defaultChecked={i === 0} className="mt-1" />
              <span>
                <span className="block text-sm font-medium text-neutral-100">{t.label}</span>
                <span className="block text-xs text-neutral-500">{t.blurb}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <button type="submit" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200">
          Draft it
        </button>
      </form>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Your videos</h2>
        {!jobs?.length && <p className="text-sm text-neutral-600">Nothing yet — submit a topic above.</p>}
        <ul className="flex flex-col gap-2">
          {jobs?.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-3 text-sm hover:border-neutral-600"
              >
                <span className="truncate pr-4 text-neutral-200">{job.topic}</span>
                <span className="shrink-0 text-neutral-500">{STATUS_LABEL[job.status]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
