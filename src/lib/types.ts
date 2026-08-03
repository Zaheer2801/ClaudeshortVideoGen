export type VideoTrack = 'make-short' | 'make-vox' | 'make-ai-short';

export const TRACKS: { id: VideoTrack; label: string; blurb: string }[] = [
  { id: 'make-short', label: 'Animated', blurb: '100% code-animated short — cheapest, fastest, most reliable.' },
  { id: 'make-vox', label: 'Documentary', blurb: 'Paper-collage documentary style with maps, artifacts, and archival images.' },
  { id: 'make-ai-short', label: 'AI Video', blurb: 'AI-generated video clips with a locked recurring character.' },
];

export type JobStatus =
  | 'drafting'
  | 'awaiting_approval'
  | 'rejected'
  | 'generating_assets'
  | 'rendering'
  | 'qa_running'
  | 'qa_failed'
  | 'qa_passed'
  | 'rendering_final'
  | 'mixing_sfx'
  | 'generating_seo'
  | 'uploading'
  | 'completed'
  | 'failed';

export type VideoJob = {
  id: string;
  user_id: string;
  topic: string;
  track: VideoTrack;
  status: JobStatus;
  script_draft: { script: string; beats?: unknown } | null;
  cost_estimate: { low: number; high: number; currency: string; breakdown?: string } | null;
  error: string | null;
  drive_file_id: string | null;
  drive_link: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_LABEL: Record<JobStatus, string> = {
  drafting: 'Writing script…',
  awaiting_approval: 'Awaiting your approval',
  rejected: 'Rejected',
  generating_assets: 'Generating voice & images…',
  rendering: 'Rendering…',
  qa_running: 'Running QA…',
  qa_failed: 'QA failed — needs a look',
  qa_passed: 'QA passed',
  rendering_final: 'Rendering final cut…',
  mixing_sfx: 'Mixing sound effects…',
  generating_seo: 'Writing SEO content…',
  uploading: 'Uploading to Drive…',
  completed: 'Done',
  failed: 'Failed',
};
