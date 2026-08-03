'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { decideJob } from './actions';
import { STATUS_LABEL, type VideoJob } from '@/lib/types';

// Subscribes to Realtime updates for this one job so the status label/result
// section update live without a manual refresh, and renders the approve/
// reject controls while the job is awaiting_approval.
export function JobLive({ initialJob }: { initialJob: VideoJob }) {
  const [job, setJob] = useState(initialJob);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`video_jobs:${job.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'video_jobs', filter: `id=eq.${job.id}` },
        (payload) => {
          setJob(payload.new as VideoJob);
          router.refresh();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-neutral-800 px-4 py-3 text-sm">
        <span className="text-neutral-500">Status: </span>
        <span className="font-medium text-neutral-100">{STATUS_LABEL[job.status]}</span>
      </div>

      {job.status === 'awaiting_approval' && (
        <div className="flex gap-3">
          <button
            disabled={isPending}
            onClick={() => startTransition(() => decideJob(job.id, true))}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
          >
            Approve — start rendering
          </button>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => decideJob(job.id, false))}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:border-neutral-500 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}

      {job.status === 'completed' && (
        <div className="flex flex-col gap-2 rounded-lg border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm">
          <p className="font-medium text-emerald-300">Your video is ready.</p>
          {job.drive_link ? (
            <a href={job.drive_link} target="_blank" rel="noreferrer" className="underline text-emerald-200">
              Open in Google Drive
            </a>
          ) : (
            <p className="text-emerald-400/70">Drive link pending — worker/upload wiring not connected yet.</p>
          )}
        </div>
      )}

      {(job.status === 'failed' || job.status === 'qa_failed') && job.error && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">{job.error}</div>
      )}
    </div>
  );
}
