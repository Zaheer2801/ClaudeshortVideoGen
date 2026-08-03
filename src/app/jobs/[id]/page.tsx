import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { JobLive } from './JobLive';
import type { VideoJob } from '@/lib/types';

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  // RLS scopes this to the caller's own jobs — a stranger's job id 404s, not 403s.
  const { data: job } = await supabase.from('video_jobs').select('*').eq('id', id).single<VideoJob>();

  if (!job) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-100">{job.topic}</h1>
        <p className="mt-1 text-sm text-neutral-500">{job.track}</p>
      </div>

      {job.script_draft && (
        <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-5">
          <h2 className="text-sm font-medium text-neutral-300">Drafted script</h2>
          <p className="whitespace-pre-wrap text-sm text-neutral-400">{job.script_draft.script}</p>
          {job.cost_estimate && (
            <p className="text-sm text-neutral-500">
              Estimated cost: ${job.cost_estimate.low.toFixed(2)}–${job.cost_estimate.high.toFixed(2)} ({job.cost_estimate.breakdown})
            </p>
          )}
        </section>
      )}

      <JobLive initialJob={job} />
    </main>
  );
}
