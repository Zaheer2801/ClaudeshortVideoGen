# short-13 · Meta — "how this video built itself"

**Niche: meta / behind-the-scenes.** Canvas = ONE persistent dark terminal (GitHub-ink, from
`lib/terminal.tsx` — reused as-is, no new niche lib). The whole video is a single terminal
session that opens on the FINISHED output, rewinds to an empty prompt, then replays the real
pipeline this repo actually runs to build a short: script/beats → TSX render → ElevenLabs voice
with word-exact captions → SFX mix. Every command shown is a real command from this repo's own
`CLAUDE.md` / `make-short` skill — technically accurate, not a dramatization.

## The promise

This is a video about how it, itself, was made — no camera, no actors, no footage, entirely
code + AI voice, built end to end by an agentic pipeline.

## The pipeline (ground truth — matches .claude/skills/make-short/SKILL.md)

1. `script.md` + `beats.json` authored (the words you're hearing right now)
2. `npm run gen && node scripts/render-all.mjs` — the TSX composition renders, frame by frame
3. `python tools/gen_voice.py --beats beats.json --emit-ts vo.gen.ts` — ElevenLabs voice,
   real per-word timestamps, captions locked to the exact spoken word
4. `python tools/mix_sfx.py sfx-plan.json` — library SFX layered on the beat
5. Output: `output/short-13-sfx.mp4` — done

## Beat sheet (~38s)

| # | t (s) | On screen | VO |
|---|-------|-----------|----|
| HOOK | 0.0–3.4 | Frame 0 FULLY composed: terminal already shows green `✓ short-13-pipeline.mp4 ready`; title **HOW THIS VIDEO / BUILT ITSELF** over it | "You're watching a video that built itself." |
| SETUP | 3.4–7.0 | Terminal dissolves the checkmark; dim comment lines list constraints | "No camera. No actors. Not one frame of footage." |
| SETUP | 7.0–10.2 | Hold; kicker **THE QUESTION** | "So how does an AI actually make this?" |
| TURN | 10.2–12.6 | Prompt clears to an empty blinking cursor; kicker flips to **THE PIPELINE** (teal) | "Let's rewind and watch it happen." |
| REVEAL 1 | 12.6–16.2 | Types `# 1. write script.md + beats.json` → `beats.json` output line prints | "First, a script and a beat sheet get written." |
| REVEAL 2 | 16.2–19.4 | Types `node scripts/render-all.mjs Short13Pipeline` → progress line fills | "Then the animation renders itself, frame by frame." |
| REVEAL 3 | 19.4–22.6 | Types `python tools/gen_voice.py --emit-ts vo.gen.ts` → `✓ voice.wav word-timed` | "A real voice reads it, word for word." |
| REVEAL 4 | 22.6–25.4 | Gold highlight bar lands on the word-timed output line | "Captions snap to the exact spoken word." |
| REVEAL 5 | 25.4–28.2 | Types `python tools/mix_sfx.py sfx-plan.json` → `✓ sfx mixed −15.5 LUFS` | "Sound effects land right on the beat." |
| PAYOFF | 28.2–30.6 | Types `ls output/` → `short-13-sfx.mp4` prints, green flash + **DONE** stamp | "And the finished video renders — done." |
| TWIST | 30.6–34.5 | Dim comment: `# every short in this repo: same 5 steps` | "Every short in this library is built exactly like this." |
| LOOP | 34.5–38.0 | Terminal dissolves back to the frozen `✓ ready` state + title (grow) → last frame == frame 0 | "One prompt in. A finished video out." |

**Outro:** no CTA. Ends on the payoff line while the frame dissolves back into the hook
(finished-checkmark terminal + title), so the replay is seamless.

## Production notes

- **Persistent canvas:** one `TerminalWindow` mounted frame 0 → loop, reused verbatim from
  `lib/terminal.tsx` (same component `short-4-git` uses) — zero new niche lib.
- **Sequence-frame check:** main terminal mounted `from={0}` so line `at` frames == global
  frames; hook-title and loop overlay are separate Sequences (must convert to local frames).
- Voice = real ElevenLabs (Liam) word times via `gen_voice.py` — this file's own `vo` array
  below has ESTIMATED start/end only; real times land after Stage 4 runs.
