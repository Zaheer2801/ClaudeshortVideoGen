import React from 'react';
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from 'remotion';
import { BigTitle, Captions, Kicker, ProgressBar, ShortsBackdrop, Stamp, prog } from '../../lib/shorts';
import { TerminalWindow, TermLine } from '../../lib/terminal';
import { VO } from './vo.gen';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'Short13Pipeline',
  durationInSeconds: 38,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// STYLE
// =============================================================================
const GOLD = '#f5d76e';
const GREEN = '#54c982';
const PINK = '#e8879f';
const EASE_INOUT = Easing.bezier(0.37, 0, 0.63, 1);

// Same persistent-canvas box everywhere so the loop's frozen-ready terminal
// overlays the main terminal's frame-0 pixel-for-pixel.
const BOX = { x: 58, y: 280, w: 964, h: 900 };
const TERM = { fontSize: 26, lineH: 41, pad: 28, title: 'shorts-factory — zsh', promptPath: 'shorts-factory' } as const;

// The frozen payoff state — shown pre-revealed at frame 0 (hook) and again at
// the loop, so the last frame dissolves back onto frame 0 exactly.
const READY: TermLine[] = [{ kind: 'ok', text: '✓ short-13-pipeline.mp4 ready', at: -5 }];

// The real pipeline this repo runs (see script.md). Cue `at` frames are keyed
// to each VO line's authored START second × 30fps — gen_voice.py anchors line
// starts, so these stay valid even after real word timestamps come back.
const SESSION: TermLine[] = [
  ...READY,
  { kind: 'dim', text: '# no camera · no actors · no footage', at: 105 },
  { kind: 'dim', text: '# 100% code + AI voice', at: 130 },
  { kind: 'cmd', text: '# 1. write script.md + beats.json', at: 380, gap: 14 },
  { kind: 'out', text: 'beats.json  ·  12 VO lines  ·  7 beats', at: 410 },
  { kind: 'cmd', text: 'node scripts/render-all.mjs Short13Pipeline', type: true, at: 486, gap: 14 },
  { kind: 'ok', text: '✓ Short13Pipeline.mp4 rendered', at: 560 },
  { kind: 'cmd', text: 'python tools/gen_voice.py --emit-ts vo.gen.ts', type: true, at: 582, gap: 14 },
  { kind: 'ok', text: '✓ voice.wav — word-timed', at: 658, hl: GOLD, hlAt: 690 },
  { kind: 'cmd', text: 'python tools/mix_sfx.py sfx-plan.json', type: true, at: 762, gap: 14 },
  { kind: 'ok', text: '✓ sfx mixed −15.5 LUFS', at: 830 },
  { kind: 'cmd', text: 'ls output/', type: true, at: 846, gap: 14 },
  { kind: 'ok', text: 'short-13-sfx.mp4', at: 878 },
  { kind: 'dim', text: '# every short in this repo: same 5 steps', at: 920, gap: 14 },
];

// =============================================================================
// SCENES
// =============================================================================
// The hook / loop headline. Only the TITLE carries the punch-in scale so the
// terminal underneath stays at scale 1 in both the hook and the loop — the
// loop's last frame (scale 1.06) lands exactly on the hook's frame-0.
const TitleCard: React.FC<{ mode: 'settle' | 'grow' }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const scale =
    mode === 'settle'
      ? 1.06 - 0.06 * EASE_INOUT(prog(frame, 0, 26))
      : 1.0 + 0.06 * EASE_INOUT(prog(frame, 0, 96));
  return (
    <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 150px', transform: `scale(${scale})` }}>
      <BigTitle
        lines={[
          { text: 'HOW THIS VIDEO', color: '#ffffff' },
          { text: 'BUILT ITSELF', color: GOLD },
        ]}
        y={80}
        size={62}
        warm={mode === 'settle'}
      />
    </div>
  );
};

const Term: React.FC<{ lines: TermLine[]; appearAt?: number }> = ({ lines, appearAt = -40 }) => (
  <TerminalWindow
    box={BOX}
    lines={lines}
    title={TERM.title}
    promptPath={TERM.promptPath}
    fontSize={TERM.fontSize}
    lineH={TERM.lineH}
    pad={TERM.pad}
    appearAt={appearAt}
  />
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const Short13Pipeline: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0d1117' }}>
      <ShortsBackdrop base="#0d1117" glow="#161b22" />

      {/* persistent terminal — mounted from frame 0 so line `at` == global frame */}
      <Sequence from={0} durationInFrames={1140} name="session">
        <FadeOut from={1100} to={1130}>
          <Term lines={SESSION} />
        </FadeOut>
      </Sequence>

      {/* hook headline over the frozen ready-state (terminal shows only the
          checkmark line at f0) */}
      <Sequence from={0} durationInFrames={130} name="hook">
        <FadeOut from={100} to={128}>
          <TitleCard mode="settle" />
        </FadeOut>
      </Sequence>

      {/* section labels + impact stamp (global time) */}
      <Kicker text="THE QUESTION" color={PINK} y={205} at={214} until={306} />
      <Kicker text="THE PIPELINE" color={GREEN} y={205} at={306} until={846} />
      <Stamp text="DONE" color={GREEN} x={540} y={1105} size={72} at={880} until={916} rotate={-7} />

      {/* loop — dissolve back to the frozen ready-state + headline; last frame
          == frame 0. Inside this Sequence useCurrentFrame is LOCAL (0 at
          global 1035), so the fade + TitleCard 'grow' are authored in local
          frames. */}
      <Sequence from={1035} durationInFrames={105} name="loop">
        <FadeIn from={0} to={40}>
          <Term lines={READY} appearAt={-999} />
          <TitleCard mode="grow" />
        </FadeIn>
      </Sequence>

      <Captions lines={VO} y={1270} accent={GOLD} />
      <ProgressBar color={GOLD} />
    </AbsoluteFill>
  );
};

// Root-relative opacity envelopes (children keep their own global frame).
const FadeOut: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: 1 - prog(frame, from, to) }}>{children}</AbsoluteFill>;
};
const FadeIn: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: prog(frame, from, to) }}>{children}</AbsoluteFill>;
};

export default Short13Pipeline;
