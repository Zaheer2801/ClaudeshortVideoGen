'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { VideoTrack } from '@/lib/types';
import { inngest } from '@/lib/inngest/client';

export async function createJob(formData: FormData) {
  const topic = String(formData.get('topic') ?? '').trim();
  const track = String(formData.get('track') ?? 'make-short') as VideoTrack;
  if (!topic) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: job, error } = await supabase
    .from('video_jobs')
    .insert({ user_id: user.id, topic, track, status: 'drafting' })
    .select('id')
    .single();

  if (error || !job) {
    console.error('createJob failed', error);
    return;
  }

  // hand off to the durable workflow: draft script -> await approval -> ...
  await inngest.send({ name: 'video-job/created', data: { jobId: job.id } });

  redirect(`/jobs/${job.id}`);
}
