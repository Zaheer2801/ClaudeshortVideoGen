import Anthropic from '@anthropic-ai/sdk';
import type { VideoTrack } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const TRACK_NOTES: Record<VideoTrack, string> = {
  'make-short': 'a 100%-code-animated vertical short, ~38-42s: hook -> setup -> reveal -> twist -> seamless loop, no CTA outro.',
  'make-vox': 'a paper-collage documentary style short, 35-45s: maps/archival-style images with camera pushes, chip annotations, no burned captions.',
  'make-ai-short': 'an AI-generated video-clip short with a locked recurring character, ~35-40s.',
};

export type DraftResult = {
  script: string;
  vo: { beat: string; text: string }[];
  costEstimate: { low: number; high: number; currency: 'USD'; breakdown: string };
};

// v0 of the draft step: writes a short script + VO beat sheet and a rough cost
// estimate for the given topic/track. Deliberately NOT doing the full
// fact-verification-via-WebSearch pass the interactive pipeline does today —
// that's a known gap to close before this handles anything fact-sensitive
// unattended. Good enough to prove the approve/reject workflow end to end.
export async function draftScript(topic: string, track: VideoTrack): Promise<DraftResult> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system:
      'You write short-form video scripts for a faceless-shorts production pipeline. ' +
      'Be factually careful and flag anything you are not confident is accurate rather than inventing specifics. ' +
      'Respond ONLY with a single tool call.',
    tools: [
      {
        name: 'submit_draft',
        description: 'Submit the drafted script and cost estimate.',
        input_schema: {
          type: 'object',
          properties: {
            script: { type: 'string', description: 'A short prose summary of the video concept and structure.' },
            vo: {
              type: 'array',
              items: {
                type: 'object',
                properties: { beat: { type: 'string' }, text: { type: 'string' } },
                required: ['beat', 'text'],
              },
            },
            cost_low: { type: 'number', description: 'Low end of estimated API cost in USD.' },
            cost_high: { type: 'number', description: 'High end of estimated API cost in USD.' },
            cost_breakdown: { type: 'string', description: 'One-line breakdown, e.g. "voice ~$0.15, 6 images ~$0.40".' },
          },
          required: ['script', 'vo', 'cost_low', 'cost_high', 'cost_breakdown'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'submit_draft' },
    messages: [
      {
        role: 'user',
        content: `Topic: "${topic}"\nFormat: ${TRACK_NOTES[track]}\n\nDraft a script (hook/setup/reveal/twist/loop beat sheet with VO lines) and a rough cost estimate for producing this.`,
      },
    ],
  });

  const toolUse = msg.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') throw new Error('Claude did not return a draft');
  const input = toolUse.input as {
    script: string;
    vo: { beat: string; text: string }[];
    cost_low: number;
    cost_high: number;
    cost_breakdown: string;
  };

  return {
    script: input.script,
    vo: input.vo,
    costEstimate: { low: input.cost_low, high: input.cost_high, currency: 'USD', breakdown: input.cost_breakdown },
  };
}
