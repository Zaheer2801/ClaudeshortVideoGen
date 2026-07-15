# claude-faceless-shorts-creator

**A faceless YouTube-Shorts factory you drive with [Claude Code](https://claude.com/claude-code).**
Every short is 100% generated: the visuals are a [Remotion](https://remotion.dev) composition
(pure TSX — no footage, no stock), the voice is ElevenLabs with word-exact synced captions, and
the sound design is drawn from a reusable, self-growing SFX/music library.

You say *"make a short about the Monty Hall problem"* — Claude scripts it, animates it, QA's it
frame-by-frame at phone scale, voices it, scores it, and hands you a finished vertical video.

## The 12 example shorts (more coming)

Each folder under `shorts/` is a complete, real production: script, beats contract, SFX cue
sheet — and the committed TSX composition renders the exact video.

| # | Niche | Title / hook |
|---|---|---|
| 1 | Chess | The 4-Move Checkmate — Punished |
| 2 | Math | The ×11 Trick |
| 3 | Algorithms | Bubble vs Quick: The Race |
| 4 | Dev tips | `git reflog` undoes any mistake |
| 5 | Probability | Monty Hall, Finally Intuitive |
| 6 | Excel | Excel Reads Your Mind (Flash Fill / Ctrl+E) |
| 7 | Kids story | Little Pip (AI-image storybook, ages 4–6) |
| 8 | Cybersecurity | The URL That Isn't PayPal |
| 9 | Music theory | The 4 Chords In Every Hit |
| 10 | Money math | The 1% Fee That Eats 24% Of Your Retirement |
| 11 | Geography | The Map Lied To You |
| 12 | Physics | Astronauts Aren't Weightless. They're Falling. |

Rendered videos aren't committed (they're fully reproducible from the repo); links to the
published versions will be added here as they go live.

## How it works

```
topic ──▶ script.md + beats.json      the beat grammar: HOOK (frame 0 = the thumbnail)
                │                      → SETUP → QUIZ → REVEAL → TWIST → seamless LOOP
                ▼
        ShortN<Name>.tsx               one Remotion composition, beats as <Sequence> scenes
                │                      over ONE persistent canvas (board/equation/terminal)
                ▼
        frame-by-frame QA              Claude renders PNGs at phone scale and READS them
                │
                ▼
        gen_voice.py                   ElevenLabs TTS per line → REAL per-word timestamps
                │                      → captions highlight on the exact spoken word
                ▼
        sfx-plan.json + mix_sfx.py     library-first sound design, audition mix, your ear
                │                      is the final gate (optional music bed: mix_music.py)
                ▼
        shorts/short-N/output/short-N-sfx.mp4
```

Three Claude Code **skills** encode the craft:

- **`/make-short`** — the end-to-end pipeline above, plus the hard-won lessons (hook grammar,
  no-CTA outros, caption safe areas, Sequence-local frame math, loop-into-intro endings).
- **`/vidtsx-2d-generator`** — the TSX authoring rules that keep Remotion renders from
  crashing (frame-based animation only, monotonic interpolate ranges, style presets).
- **`/suggest-sfx`** — taste-encoded sound design: function-first cues, layered hero moments,
  measured audibility (RMS-diff, not hope), and a library that compounds across videos.

`brand.md` is the style contract (palette, type, motion, SFX taste) — swap it for your own
brand and every future short follows it.

## Quickstart

Requirements: [Claude Code](https://claude.com/claude-code) · Node 18+ · Python 3.10+ (stdlib
only, nothing to pip-install) · `ffmpeg` on PATH · an [ElevenLabs](https://elevenlabs.io) key.

```bash
git clone https://github.com/hassancs91/claude-faceless-shorts-creator
cd claude-faceless-shorts-creator
cp .env.example .env          # add your ELEVENLABS_API_KEY
cd remotion && npm install && npm run gen && cd ..

claude                        # open the repo in Claude Code, then:
```

> **make a short about &lt;your topic&gt;**

…or rebuild an example: **"re-render short-5 and regenerate its voice"**.

To just explore the compositions visually: `cd remotion && npm run studio`.

## Repo layout

```
.claude/skills/   the three skills (this is where the "editor" lives)
tools/            Python: gen_voice, gen_sfx, gen_music, mix_sfx, mix_music, gen_chords, …
remotion/         the Remotion project — shared kits in src/lib/, one folder per short in src/shots/
media/library/    reusable assets: SFX clips + music beds (catalogued, loudness-normalized)
media/projects/   media generated for one specific short (e.g. short-7's story frames)
shorts/           the example productions: script.md, beats.json, sfx-plan.json each
brand.md          the style contract — make it yours
IDEAS.md          the niche/idea bank the factory picks from
```

## License

MIT — see [LICENSE](LICENSE). Bundled SFX/music clips were generated with ElevenLabs by the
repo author and are redistributed here; per-clip provenance is recorded in
`media/library/*/catalog.json`.
