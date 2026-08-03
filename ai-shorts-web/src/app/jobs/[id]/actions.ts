'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { inngest } from '@/lib/inngest/client';

export async function decideJob(jobId: string, approved: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // ownership check happens via RLS on this select; if the row isn't theirs
  // this returns nothing and we bail rather than firing the event blind.
  const { data: job } = await supabase.from('video_jobs').select('id, status').eq('id', jobId).single();
  if (!job || job.status !== 'awaiting_approval') return;

  await inngest.send({ name: 'video-job/decision', data: { jobId, approved } });
}
