# CLAUDE.md — claude-faceless-shorts-creator

A **faceless-shorts factory** driven by Claude Code: fully-synthetic vertical shorts
(1080×1920 @30, ~40s) where *everything is code* — no footage, no stock. One short = one
Remotion composition fed by a `beats.json` contract, with ElevenLabs voice (word-exact
captions) and library-first SFX/music layered on after render.

**The pipeline entry point is the `/make-short` skill.** It defers raw TSX crash rules to
`/vidtsx-2d-generator` and sound taste to `/suggest-sfx` + `brand.md` §7.

## Layout

```
tools/            Python tools (stdlib-only, Python 3.10+): gen_voice, gen_sfx, gen_music,
                  mix_sfx, mix_music, gen_chords, gen_clip, gen_image
remotion/         the Remotion project — src/lib/ (shared + niche kits), src/shots/short-N/
media/            Remotion's public root: library/ (reusable: sfx, music, logos)
                  + projects/<proj>/ (media generated for ONE short)
shorts/           one folder per short: script.md, beats.json, sfx-plan.json
                  (+ gitignored voice/ and output/)
brand.md          the style contract every skill reads (palette, motion, safe areas, SFX taste)
IDEAS.md          the idea bank + niche ranking — read when picking a topic, grow it
.claude/skills/   make-short, vidtsx-2d-generator, suggest-sfx
```

## Conventions (hard rules)

- **Run everything from the repo root.** Tools resolve engine paths (media/library, catalogs)
  against their own location, but project paths (`shorts/...`) against the CWD.
- **Python:** any Python 3.10+ works — the tools are stdlib-only, no pip installs needed.
  `ffmpeg`/`ffprobe` and `node`/`npx` must be on PATH.
- **API keys** live in `.env` at the repo root (copy `.env.example`). Never commit `.env`.
- **Registry is generated:** after adding/renaming a shot, `cd remotion && npm run gen`
  (frames.mjs/render-all.mjs do NOT run it themselves).
- **Media rules:** `media/library/` is for CROSS-SHORT reusable assets only (a logo, an SFX
  clip, a music bed — each with a catalog). Anything generated FOR ONE short (story frames,
  screenshots) goes in `media/projects/<proj>/`, referenced as `staticFile('projects/<proj>/x')`.
  Reuse before you generate — check the catalogs first.
- **`shorts/*/voice/` and `shorts/*/output/` are gitignored** (regenerable: cached TTS and
  rendered videos). Everything needed to rebuild them is committed.
- **QA is not optional:** render frames at phone scale and READ them before any full render
  (see /make-short Stage 3).
