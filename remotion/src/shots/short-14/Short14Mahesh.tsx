import React from 'react';
import { AbsoluteFill, Easing, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { BigTitle, Captions, Kicker, ProgressBar, ShortsBackdrop, StatChip, prog } from '../../lib/shorts';
import { StoryVignette } from '../../lib/story';
import { VO } from './vo.gen';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'Short14Mahesh',
  durationInSeconds: 36,
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
const EASE_OUT = Easing.bezier(0.33, 1, 0.68, 1);
const EASE_INOUT = Easing.bezier(0.37, 0, 0.63, 1);

const PORTRAIT = 'projects/short-14-mahesh/mahesh-portrait.jpg';
const FILMFARE = 'projects/short-14-mahesh/mahesh-filmfare.jpg';

// The career timeline — cue `at` frames keyed to each VO line's authored START
// second x30fps (gen_voice.py anchors line starts, so these stay valid after
// real word timestamps come back). Sourced facts — see script.md citations.
const DOTS: { year: string; label: string; at: number; upcoming?: boolean }[] = [
  { year: '1979', label: 'First film — age 4', at: 105 },
  { year: '1999', label: 'Lead debut — Best Debut award', at: 140 },
  { year: '2006', label: "Pokiri — Telugu's #1 grosser", at: 294 },
  { year: '2011', label: 'Dookudu — ₹100 Cr milestone', at: 402 },
  { year: '2020', label: 'Sarileru Neekevvaru — biggest hit yet', at: 498 },
  { year: '2027', label: 'Varanasi w/ Rajamouli — global epic', at: 735, upcoming: true },
];
const RAIL_X = 130;
const RAIL_TOP = 330;
const RAIL_GAP = 150;
const dotY = (i: number) => RAIL_TOP + i * RAIL_GAP;

// =============================================================================
// SCENES
// =============================================================================
// The hero photo — STATIC pose only (no Ken Burns drift). The hook shows it at
// frame 0 fully composed (hook rule); the loop re-shows the identical static
// pose so the last frame lands pixel-for-pixel on frame 0.
const HeroPhoto: React.FC = () => (
  <AbsoluteFill>
    <Img
      src={staticFile(PORTRAIT)}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: '50% 22%',
        transform: 'scale(1.14)',
      }}
    />
    <StoryVignette strength={0.5} />
  </AbsoluteFill>
);

const Credit: React.FC<{ text: string; y: number }> = ({ text, y }) => (
  <div
    style={{
      position: 'absolute',
      left: 60,
      right: 60,
      top: y,
      textAlign: 'center',
      fontFamily: 'inherit',
      fontSize: 20,
      letterSpacing: 0.5,
      color: 'rgba(255,255,255,0.55)',
      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
    }}
  >
    {text}
  </div>
);

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
          { text: 'FOUR YEARS OLD', color: '#ffffff' },
          { text: 'TO GLOBAL EPIC', color: GOLD },
        ]}
        y={80}
        size={62}
        warm={mode === 'settle'}
      />
    </div>
  );
};

// One rail dot + its label. Lit (gold/green glow) once frame >= at; the 2027
// dot pulses gently to read as "upcoming" rather than "already happened".
const Dot: React.FC<{ d: (typeof DOTS)[number]; i: number }> = ({ d, i }) => {
  const frame = useCurrentFrame();
  const lit = frame >= d.at;
  const p = EASE_OUT(prog(frame, d.at, d.at + 14));
  const pulse = d.upcoming && lit ? 1 + 0.06 * Math.sin((frame - d.at) / 9) : 1;
  const color = d.upcoming ? GOLD : GREEN;
  const y = dotY(i);
  return (
    <React.Fragment>
      <div
        style={{
          position: 'absolute',
          left: RAIL_X,
          top: y,
          width: 26,
          height: 26,
          borderRadius: 999,
          transform: `translate(-50%, -50%) scale(${lit ? pulse : 1})`,
          background: lit ? color : '#2a2f3a',
          border: `3px solid ${lit ? color : '#454b58'}`,
          boxShadow: lit ? `0 0 ${18 * p}px ${color}` : 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: RAIL_X + 46,
          top: y,
          width: 760,
          transform: `translateY(-50%) translateY(${(1 - p) * 10}px)`,
          opacity: p,
        }}
      >
        <div style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 32, color, letterSpacing: 1 }}>{d.year}</div>
        <div style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: 24, color: 'rgba(255,255,255,0.88)', marginTop: 2 }}>
          {d.label}
        </div>
      </div>
    </React.Fragment>
  );
};

const TimelineRail: React.FC = () => {
  const frame = useCurrentFrame();
  // fully hide the rail during the award-stat burst (606-733) — it fills the
  // same vertical band as the dot labels, so a partial dim still collided
  // with the StatChips/photo; a clean swap reads better than fighting for space
  const dim = 1 - (prog(frame, 596, 616) - prog(frame, 716, 736));
  return (
    <AbsoluteFill style={{ opacity: dim }}>
      {DOTS.map((d, i) =>
        i === 0 ? null : (
          <div
            key={`line-${i}`}
            style={{
              position: 'absolute',
              left: RAIL_X - 2,
              top: dotY(i - 1) + 13,
              width: 4,
              height: dotY(i) - dotY(i - 1) - 26,
              background: '#2a2f3a',
            }}
          />
        )
      )}
      {DOTS.map((d, i) => (
        <Dot key={d.year} d={d} i={i} />
      ))}
    </AbsoluteFill>
  );
};

// StatChip has no built-in fade-out (it stays visible forever once shown), so
// this beat needs its own bounded opacity envelope or the 3 chips would still
// be sitting on screen during TWIST/CLOSE.
const AwardsBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const op = Math.min(1, prog(frame, 606, 622)) * (1 - prog(frame, 718, 733));
  if (op <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <StatChip label="Awards" value="9 Nandi Awards" color={GOLD} x={110} y={930} w={860} at={606} />
      <StatChip label="Awards" value="5 Filmfare Awards South" color={GOLD} x={110} y={1030} w={860} at={632} />
      <StatChip label="Ranking" value="Forbes India Celebrity 100, 2012–2025" color={GREEN} x={110} y={1130} w={860} at={658} />
    </div>
  );
};

// Occupies the same vertical band the (now-hidden) rail used, centered — the
// photo sits above the 3 StatChips instead of beside the rail's text column.
const AwardsPhoto: React.FC = () => {
  const frame = useCurrentFrame();
  const p = EASE_OUT(prog(frame, 606, 622));
  const out = 1 - prog(frame, 720, 735);
  const op = Math.min(p, out);
  if (op <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 290, top: 500, width: 500, opacity: op, transform: `translateY(${(1 - p) * 14}px)` }}>
      <div style={{ borderRadius: 20, overflow: 'hidden', border: `2px solid ${GOLD}88`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <Img src={staticFile(FILMFARE)} style={{ width: '100%', display: 'block' }} />
      </div>
      <div style={{ marginTop: 14, textAlign: 'center', fontSize: 18, letterSpacing: 0.5, color: 'rgba(255,255,255,0.55)' }}>
        Photo: Bollywood Hungama · CC BY 3.0
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const Short14Mahesh: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0f1216' }}>
      <ShortsBackdrop base="#0f1216" glow="#1d2430" />

      {/* persistent timeline — mounted from frame 0 so dot `at` == global frame */}
      <Sequence from={0} durationInFrames={1080} name="rail">
        <FadeWindow inFrom={100} inTo={128} outFrom={1030} outTo={1065}>
          <TimelineRail />
        </FadeWindow>
      </Sequence>

      <Sequence from={0} durationInFrames={870} name="awards-burst">
        <AwardsBurst />
        <AwardsPhoto />
      </Sequence>

      {/* hook — hero photo + headline over the fully-lit rail state */}
      <Sequence from={0} durationInFrames={130} name="hook">
        <FadeOut from={100} to={128}>
          <HeroPhoto />
          <Credit text="Photo: Silverscreen Inc. · CC BY-SA 3.0" y={1830} />
          <TitleCard mode="settle" />
        </FadeOut>
      </Sequence>

      <Kicker text="THE RECORD-BREAKERS" color={GOLD} y={205} at={213} until={294} />

      {/* loop — dissolve back to the frozen hero photo + headline; last frame
          == frame 0. Local frames (0 at global 966). */}
      <Sequence from={966} durationInFrames={114} name="loop">
        <FadeIn from={0} to={40}>
          <HeroPhoto />
          <Credit text="Photo: Silverscreen Inc. · CC BY-SA 3.0" y={1830} />
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
const FadeWindow: React.FC<{ inFrom: number; inTo: number; outFrom: number; outTo: number; children: React.ReactNode }> = ({
  inFrom,
  inTo,
  outFrom,
  outTo,
  children,
}) => {
  const frame = useCurrentFrame();
  const op = Math.min(1, prog(frame, inFrom, inTo)) * (1 - prog(frame, outFrom, outTo));
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

export default Short14Mahesh;
