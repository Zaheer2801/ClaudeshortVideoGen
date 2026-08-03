import { inngest } from './client';
import { createAdminClient } from '../supabase/admin';
import { draftScript } from '../anthropic';
import type { JobStatus, VideoTrack } from '../types';

async function setStatus(jobId: string, status: JobStatus, extra: Record<string, unknown> = {}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('video_jobs').update({ status, ...extra }).eq('id', jobId);
  if (error) throw new Error(`failed to set job ${jobId} status=${status}: ${error.message}`);
}

// The durable workflow: draft -> await human approval -> (stubbed) render
// pipeline -> completed. Stages after approval are stubs for now (Build order
// step 3) — step 4 replaces them with real calls to the Fly.io render worker.
export const runVideoJob = inngest.createFunction(
  { id: 'run-video-job', retries: 2, triggers: { event: 'video-job/created' } },
  async ({ event, step }) => {
    const { jobId } = event.data;

    const job = await step.run('load-job', async () => {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from('video_jobs').select('topic, track').eq('id', jobId).single();
      if (error || !data) throw new Error(`job ${jobId} not found`);
      return data as { topic: string; track: VideoTrack };
    });

    const draft = await step.run('draft-script', async () => draftScript(job.topic, job.track));

    await step.run('save-draft-and-await-approval', async () => {
      await setStatus(jobId, 'awaiting_approval', {
        script_draft: { script: draft.script, beats: draft.vo },
        cost_estimate: {
          low: draft.costEstimate.low,
          high: draft.costEstimate.high,
          currency: draft.costEstimate.currency,
          breakdown: draft.costEstimate.breakdown,
        },
      });
    });

    const decision = await step.waitForEvent('await-approval', {
      event: 'video-job/decision',
      timeout: '7d',
      if: `event.data.jobId == "${jobId}"`,
    });

    if (!decision) {
      // timed out waiting for a human
      await step.run('mark-rejected-timeout', async () => setStatus(jobId, 'rejected', { error: 'approval timed out after 7 days' }));
      return { jobId, outcome: 'timed_out' };
    }

    if (!decision.data.approved) {
      await step.run('mark-rejected', async () => setStatus(jobId, 'rejected'));
      return { jobId, outcome: 'rejected' };
    }

    // ---- STUBBED from here down (Build order step 4 replaces this block
    // with real calls to the Fly.io render worker) ----
    const stubStages: JobStatus[] = [
      'generating_assets',
      'rendering',
      'qa_running',
      'qa_passed',
      'rendering_final',
      'mixing_sfx',
      'generating_seo',
      'uploading',
    ];
    for (const stage of stubStages) {
      await step.run(`stub-${stage}`, async () => setStatus(jobId, stage));
      await step.sleep(`stub-${stage}-pause`, '3s');
    }

    await step.run('mark-completed', async () =>
      setStatus(jobId, 'completed', {
        drive_link: null, // real worker fills this in once Drive upload is wired
      })
    );

    return { jobId, outcome: 'completed_stub' };
  }
);
