import React from 'react';
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import {
  ArchivalPhoto,
  CollageBoard,
  Cutout,
  Grain,
  LabelChip,
  PaperBG,
  SerifStatement,
  VOX,
} from '../../lib/collage';

// =============================================================================
// COMPOSITION CONFIG — "5,000 Years, Two Minutes" (history of India, expanded cut).
// Beats + VO contract: vox-shorts/vox-2-india/beats.json. Facts verified 2026-08-02.
// Scope: civilizational continuity + a sourced economic arc; no religious/
// territorial/political-conflict content, no depiction of any real person.
// =============================================================================
export const compositionConfig = {
  id: 'Vox2India',
  durationInSeconds: 120,
  fps: 30,
  width: 1080,
  height: 1920,
};

const W = 1080;
const H = 1920;
const asset = (f: string) => staticFile(`projects/vox-2-india/layers/${f}`);

// =============================================================================
// CUES (GLOBAL frames @30) — estimated from beats.json windows; retimed to real
// word starts after gen_voice.py writes actual times.
// =============================================================================
const CUE = {
  indusStart: 180,
  indusIn: 195,
  indusChip: 240,
  bridgeStart: 480,
  bridgeStatement: 510,
  goldenStart: 660,
  manuscriptIn: 675,
  zeroStatement: 760,
  zeroChip: 800,
  nalandaStart: 960,
  nalandaChip: 990,
  nalandaStat: 1040,
  tradeStart: 1260,
  tradeChip: 1290,
  peakStart: 1560,
  peakChip: 1590,
  declineStart: 1740,
  declineChip: 1770,
  declineStatement: 1830,
  indepStart: 2100,
  charkhaIn: 2130,
  indepChip: 2220,
  econStart: 2460,
  skylineIn: 2490,
  econChip: 2580,
  spaceStart: 2760,
  rocketIn: 2790,
  spaceChip: 2900,
  loopStart: 3120,
  loopTitle: 3380,
  loopChip: 3420,
} as const;

// Camera: one continuous journey across the whole board — pushes toward each
// era's subject, pulls back to the wide map for the connective beats, and
// returns to the exact hook framing so the last frame ≈ frame 0.
const CAM = [
  { f: 0, x: 540, y: 960, z: 1 },
  { f: 150, x: 540, y: 960, z: 1.08 },
  { f: 280, x: 360, y: 700, z: 1.35 },
  { f: 470, x: 360, y: 700, z: 1.35 },
  { f: 560, x: 540, y: 960, z: 1.05 },
  { f: 760, x: 660, y: 720, z: 1.35 },
  { f: 1100, x: 660, y: 720, z: 1.35 },
  { f: 1300, x: 540, y: 1000, z: 1.2 },
  { f: 1900, x: 540, y: 1000, z: 1.2 },
  { f: 2200, x: 540, y: 1120, z: 1.4 },
  { f: 2500, x: 540, y: 1300, z: 1.15 },
  { f: 2850, x: 540, y: 560, z: 1.35 },
  { f: 3150, x: 540, y: 960, z: 1.05 },
  { f: 3250, x: 540, y: 960, z: 1 },
  { f: 3599, x: 540, y: 960, z: 1 },
];

// Map geometry (map layer ~1000px wide, centered 540/960; points are source fractions)
const MAP = { cx: 540, cy: 960, w: 1000 };
const mapPt = (fx: number, fy: number) => ({
  x: MAP.cx - MAP.w / 2 + fx * MAP.w,
  y: MAP.cy - MAP.w / 2 + fy * MAP.w,
});
const INDUS_PT = mapPt(0.22, 0.32);
const GUPTA_PT = mapPt(0.58, 0.34);

const TITLE_WORDS = [{ t: 'THE' }, { t: 'WORLD’S' }, { t: 'OLDEST' }, { t: 'CIVILIZATION', hl: true }];

// Fades a whole scene's layers out over its last `dur` local frames.
const SceneFade: React.FC<{ out: number; dur?: number; children: React.ReactNode }> = ({ out, dur = 16, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [out - dur, out], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity: op }}>{children}</div>;
};

// Colored wash over the map — narrates the economic arc without new art:
// neutral (origin/golden age) -> warm gold (wealth/1700 peak) -> desaturated
// dark (colonial decline + independence) -> neutral again (today/loop).
const MapTint: React.FC = () => {
  const frame = useCurrentFrame();
  // single trapezoid interpolate per tint (fade in -> hold -> fade out); a
  // Math.max of two separate ranges is a trap here — extrapolateLeft:'clamp'
  // on a DESCENDING range returns its first (highest) output for every frame
  // before that range even starts, pinning the tint on from frame 0.
  const gold = interpolate(
    frame,
    [CUE.tradeStart, CUE.tradeStart + 40, CUE.declineStart, CUE.declineStart + 40],
    [0, 0.4, 0.4, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const dark = interpolate(
    frame,
    [CUE.declineStart, CUE.declineStart + 40, CUE.econStart, CUE.econStart + 60],
    [0, 0.55, 0.55, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return (
    <>
      <div style={{ position: 'absolute', left: MAP.cx - MAP.w / 2, top: MAP.cy - MAP.w / 2, width: MAP.w, height: MAP.w, background: VOX.yellow, opacity: gold, mixBlendMode: 'multiply' }} />
      <div style={{ position: 'absolute', left: MAP.cx - MAP.w / 2, top: MAP.cy - MAP.w / 2, width: MAP.w, height: MAP.w, background: '#1c1a14', opacity: dark, mixBlendMode: 'multiply' }} />
    </>
  );
};

const Vox2India: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: VOX.paper }}>
      <CollageBoard cam={CAM}>
        <PaperBG w={W} h={H} />

        {/* ---- MAP scenery: persists the whole video, only its tint changes ---- */}
        <Sequence from={0} durationInFrames={3600} layout="none">
          {/* negative `at`: pre-settled by frame 0 (hook rule) — Layer's raw progress is
              already 1 by frame 0, vs. a small positive `at` which leaves frame 0 blank */}
          <Cutout src={asset('map.png')} x={MAP.cx} y={MAP.cy} w={MAP.w} at={-40} dur={20} enter="place" rotate={-1} sticker={0} shadow={3} drift={0.35} />
          <MapTint />
        </Sequence>

        {/* ---- HOOK (0–6s): title + chapter chip ---- */}
        <Sequence from={0} durationInFrames={180} layout="none">
          <SceneFade out={176}>
            <SerifStatement x={540} y={360} w={920} at={-40} size={72} backing words={TITLE_WORDS} />
            <LabelChip x={540} y={1650} at={-30} text="5,000+ years of history" kicker="A short history" accent={VOX.red} size={32} rotate={-1.2} />
          </SceneFade>
        </Sequence>

        {/* ---- INDUS VALLEY (6–16s) ---- */}
        <Sequence from={CUE.indusStart} durationInFrames={300} layout="none">
          <SceneFade out={292}>
            <Cutout src={asset('indus-seal.png')} x={INDUS_PT.x} y={INDUS_PT.y} w={380} at={CUE.indusIn - CUE.indusStart} enter="place" rotate={-3} depth={0.08} sticker={6} shadow={3} />
            <LabelChip x={INDUS_PT.x} y={INDUS_PT.y + 260} at={CUE.indusChip - CUE.indusStart} text="Ancient sewers & city grids" kicker="Indus Valley · c. 2600 BCE" accent={VOX.teal} size={28} rotate={1.5} depth={0.03} />
          </SceneFade>
        </Sequence>

        {/* ---- BRIDGE (16–22s): wide pull-back, no new image ---- */}
        <Sequence from={CUE.bridgeStart} durationInFrames={180} layout="none">
          <SceneFade out={172}>
            <SerifStatement x={540} y={950} w={840} at={CUE.bridgeStatement - CUE.bridgeStart} size={58} backing words={[{ t: 'Empires' }, { t: 'rose.' }, { t: 'Empires' }, { t: 'fell.', hl: true }]} />
          </SceneFade>
        </Sequence>

        {/* ---- GOLDEN AGE (22–32s) + NALANDA (32–42s): same manuscript, new chips ---- */}
        <Sequence from={CUE.goldenStart} durationInFrames={600} layout="none">
          <SceneFade out={592}>
            <Cutout src={asset('zero-manuscript.png')} x={GUPTA_PT.x} y={GUPTA_PT.y} w={520} at={CUE.manuscriptIn - CUE.goldenStart} enter="place" rotate={2} depth={0.08} sticker={6} shadow={3} />
            <SerifStatement x={660} y={1200} w={760} at={CUE.zeroStatement - CUE.goldenStart} size={50} backing words={[{ t: 'Zero.' }, { t: 'Still' }, { t: 'running' }, { t: 'the' }, { t: 'world.', hl: true }]} />
            <LabelChip x={GUPTA_PT.x + 40} y={GUPTA_PT.y - 300} at={CUE.zeroChip - CUE.goldenStart} text="The concept of zero" kicker="Gupta era · c. 500–700 CE" accent={VOX.yellow} kickerColor={VOX.inkSoft} size={28} rotate={-1.5} depth={0.03} />
            <Sequence from={CUE.nalandaStart - CUE.goldenStart} layout="none">
              <LabelChip x={GUPTA_PT.x - 60} y={GUPTA_PT.y + 300} at={CUE.nalandaChip - CUE.nalandaStart} text="World's first university" kicker="Nalanda" accent={VOX.red} size={28} rotate={1.2} depth={0.03} />
              <LabelChip x={GUPTA_PT.x + 220} y={GUPTA_PT.y + 380} at={CUE.nalandaStat - CUE.nalandaStart} text="10,000 students" kicker="At its peak" accent={VOX.teal} size={26} rotate={-1} depth={0.03} />
            </Sequence>
          </SceneFade>
        </Sequence>

        {/* ---- TRADE & WEALTH (42–52s) + 1700 PEAK (52–58s): map gold-tints, no new image ---- */}
        <Sequence from={CUE.tradeStart} durationInFrames={480} layout="none">
          <SceneFade out={472}>
            <LabelChip x={540} y={650} at={CUE.tradeChip - CUE.tradeStart} text="Silk. Spices. Gems." kicker="Centuries of trade" accent={VOX.yellow} kickerColor={VOX.inkSoft} size={30} rotate={-1.2} depth={0.03} />
            <Sequence from={CUE.peakStart - CUE.tradeStart} layout="none">
              <LabelChip x={540} y={1550} at={CUE.peakChip - CUE.peakStart} text="~1/4 of the world's GDP" kicker="1700" accent={VOX.red} size={38} rotate={-1} depth={0.03} />
            </Sequence>
          </SceneFade>
        </Sequence>

        {/* ---- COLONIAL DECLINE (58–70s): map darkens, no new image ---- */}
        <Sequence from={CUE.declineStart} durationInFrames={360} layout="none">
          <SceneFade out={352}>
            <LabelChip x={540} y={650} at={CUE.declineChip - CUE.declineStart} text="Under 4% by 1950" kicker="Two centuries of colonial rule" accent={VOX.inkSoft} size={32} rotate={1} depth={0.03} />
            <SerifStatement x={540} y={1500} w={880} at={CUE.declineStatement - CUE.declineStart} size={58} backing words={[{ t: 'Two' }, { t: 'centuries' }, { t: 'changed' }, { t: 'that.', hl: true }]} />
          </SceneFade>
        </Sequence>

        {/* ---- INDEPENDENCE (70–82s): charkha, the movement's non-partisan symbol ---- */}
        <Sequence from={CUE.indepStart} durationInFrames={360} layout="none">
          <SceneFade out={352}>
            <Cutout src={asset('charkha.png')} x={540} y={1120} w={460} at={CUE.charkhaIn - CUE.indepStart} enter="place" rotate={-2} depth={0.08} sticker={6} shadow={3} />
            <LabelChip x={540} y={700} at={CUE.indepChip - CUE.indepStart} text="A peaceful transfer of power" kicker="1947 · Independence" accent={VOX.teal} size={32} rotate={-1.2} depth={0.03} />
          </SceneFade>
        </Sequence>

        {/* ---- MODERN ECONOMY (82–92s): map returns to full color, skyline ---- */}
        <Sequence from={CUE.econStart} durationInFrames={300} layout="none">
          <SceneFade out={292}>
            <Cutout src={asset('modern-skyline.png')} x={540} y={1500} w={760} at={CUE.skylineIn - CUE.econStart} enter="rise" depth={0.1} sticker={0} shadow={2} />
            <LabelChip x={540} y={700} at={CUE.econChip - CUE.econStart} text="1.4 billion · fastest-growing" kicker="Today" accent={VOX.red} size={32} rotate={1.2} depth={0.03} />
          </SceneFade>
        </Sequence>

        {/* ---- MODERN SPACE (92–104s): rocket/moon ---- */}
        <Sequence from={CUE.spaceStart} durationInFrames={360} layout="none">
          <SceneFade out={352}>
            <Cutout src={asset('rocket-moon.png')} x={540} y={560} w={640} at={CUE.rocketIn - CUE.spaceStart} enter="place" rotate={-1.5} depth={0.1} sticker={6} shadow={3} />
            <LabelChip x={540} y={1000} at={CUE.spaceChip - CUE.spaceStart} text="Moon, south pole — first ever" kicker="2023" accent={VOX.yellow} kickerColor={VOX.inkSoft} size={30} rotate={-1} depth={0.03} />
          </SceneFade>
        </Sequence>

        {/* ---- TODAY / LOOP (104–120s): title + chip re-form ~= frame 0 ---- */}
        <Sequence from={CUE.loopStart} durationInFrames={480} layout="none">
          <Sequence from={CUE.loopTitle - CUE.loopStart} layout="none">
            <SerifStatement x={540} y={360} w={920} at={0} size={72} backing words={TITLE_WORDS} />
          </Sequence>
          <LabelChip x={540} y={1650} at={CUE.loopChip - CUE.loopStart} text="5,000+ years of history" kicker="Still being written" accent={VOX.red} size={32} rotate={-1.2} />
        </Sequence>
      </CollageBoard>
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};

export default Vox2India;
