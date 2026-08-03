# vox-2-india — "5,000 Years, Two Minutes" (History of India, expanded cut)

120s vertical (1080×1920) · voice: Fish Audio "Adrian" (steady documentary narrator) · no
burned captions — on-screen chips/statements carry the words, per vox-1's convention.

**Scope note:** "history of India" is a 5,000-year, hugely contested subject. This cut picks
ONE defensible, non-inflammatory thread — civilizational continuity + documented achievements
+ a sourced economic arc — and stays off religious/territorial/political-conflict ground
entirely (no partition, no communal framing, no living political figures). Every number is a
widely-cited estimate, sourced, and framed as such. The 1190s destruction of Nalanda's library
is a real, sourced event but is DELIBERATELY OMITTED — the beat stays on the achievement
(scale, reach) rather than the loss, to avoid dragging a religious-conflict framing into an
otherwise celebratory cut. That's a scope choice, not a factual claim either way.

## Facts (verified 2026-08-02, web — sources also listed in the original 40s cut)

- Indus Valley Civilization: mature urban phase ~2600–1900 BCE — covered sewers, standardized
  weights, gridded streets; script still undeciphered. [Live Science](https://www.livescience.com/archaeology/will-the-indus-valley-script-ever-be-deciphered)
- Zero/decimal system: Aryabhata (~500 CE) formalized place-value decimal notation;
  Brahmagupta (7th c. CE) first defined zero as a number with arithmetic rules.
  [Wikipedia — Brahmagupta](https://en.wikipedia.org/wiki/Brahmagupta)
- Nalanda: founded early 5th century CE (Gupta era); widely considered the world's first
  residential university; ~10,000 students, ~2,000 teachers at its peak, drawing scholars from
  across Asia; operated ~AD 427–1197. [Multiple tertiary sources, cross-checked]
- Angus Maddison's widely-cited estimate: India ~22–27% of world GDP in 1700 (on par with all
  of Europe combined) → ~3–4% by 1950. [Cato Institute](https://www.cato.org/policy-analysis/indian-nationalism-historical-fantasy-golden-hindu-period)
- Independence: 15 August 1947, following a movement built substantially on organized
  non-violent resistance (satyagraha) — commonly characterized as one of history's largest
  peaceful transfers of power. (Uncontested basic history; no individual named on-screen.)
- Today: ~1.4B people, world's most populous nation (surpassed China 2023); one of the
  world's fastest-growing major economies (Goldman Sachs/Morgan Stanley/OECD consensus).
  [Federal Reserve note, 2026](https://www.federalreserve.gov/econres/notes/feds-notes/india-and-the-global-economy-20260408.html)
- Chandrayaan-3: landed near the Moon's south pole 23 Aug 2023 — 4th country to land on the
  Moon, 1st ever near the south pole; ISRO's 2020 budget estimate was ~$75M, well inside
  typical big-budget-film territory. [CNBC](https://www.cnbc.com/2023/08/23/india-chandrayaan-3-moon-mission.html) ·
  [Space.com](https://www.space.com/india-chandrayaan-3-moon-landing-success)

## Beat sheet (~120s, 12 beats)

| t (s) | beat | on screen | VO |
|---|---|---|---|
| 0–6 | HOOK | Map of India places on paper, camera wide; title "THE WORLD'S OLDEST CIVILIZATION"; chip "5,000+ YEARS". Frame 0 fully composed. | "This is the story of the world's oldest continuous civilization." |
| 6–16 | INDUS VALLEY | Camera pushes toward the Indus region; ancient-seal/ruins cutout places; chip "INDUS VALLEY · c. 2600 BCE". | "Forty-six hundred years ago, its cities had covered sewers, standardized weights, and gridded streets — in a script no one has ever deciphered." |
| 16–22 | BRIDGE | Camera pulls back to full map; time-passing chip flickers through a few era names (no new image). | "Empires rose and fell for a thousand years. Then came a golden age." |
| 22–32 | GOLDEN AGE | Manuscript/astronomer cutout places; SerifStatement (backing) "Zero. Still running the world."; chip "GUPTA ERA · ZERO". | "Its mathematicians formalized the concept of zero and the decimal system — the foundation every computer on Earth still runs on." |
| 32–42 | NALANDA | SAME manuscript cutout, camera reframes/zooms to a different crop + new chip "NALANDA · WORLD'S FIRST UNIVERSITY"; stat chip "10,000 STUDENTS" (no new image). | "It built the world's first residential university. At its peak, Nalanda taught ten thousand students from across Asia." |
| 42–52 | TRADE & WEALTH | Map tints warm gold (same map layer, CSS only — no new image); chip "SILK · SPICES · GEMS". | "Centuries of trade in spices, textiles, and gems made it one of the richest regions on the planet." |
| 52–58 | 1700 PEAK | Map stays gold-tinted; big stat chip "1700 · ~1/4 OF WORLD GDP". | "By seventeen hundred, it produced roughly a quarter of the world's entire economy." |
| 58–70 | COLONIAL DECLINE | Map desaturates/darkens (same layer, CSS tint); chip "BY 1950 · UNDER 4%"; SerifStatement (backing). | "Then came two centuries of colonial rule. By nineteen fifty, that share had collapsed to under four percent." |
| 70–82 | INDEPENDENCE | Spinning-wheel (charkha) cutout places — the movement's iconic, non-partisan symbol; chip "1947 · INDEPENDENCE". | "In nineteen forty-seven, after decades of a movement built on non-violence, it won back its independence — one of the largest peaceful transfers of power in history." |
| 82–92 | MODERN ECONOMY | Map returns to full color; modern-skyline cutout places; stat chip "1.4B · FASTEST-GROWING". | "Today, it's home to one point four billion people — the most populous nation on Earth — and one of the fastest-growing major economies." |
| 92–104 | MODERN SPACE | Rocket/Moon cutout places; chip "2023 · MOON, SOUTH POLE". | "In twenty twenty-three, its space program landed near the Moon's south pole — the first country ever to do it — on a budget smaller than most blockbuster films." |
| 104–120 | TODAY / LOOP | Camera returns to hook framing; title re-forms; map + opening chip settle back to frame-0 state → last frame ≈ frame 0. Visual hold, minimal VO. | "Five thousand years of history — and it's still being written." |

**Outro:** no CTA — the loop (map + title back to frame-0 framing) is the ending, with a quiet
visual hold over the last ~10s rather than padding with more narration.

## Layers (media/projects/vox-2-india/layers/) — 6 generations total, cheapest tier

Budget pass (2026-08-02): merged NALANDA into GOLDEN AGE (same manuscript image, different
crop/chip) and dropped the dedicated TRADE & WEALTH image (reuses the tinted map, same trick
as 1700 PEAK/DECLINE) — 8 images down to 6. All generated `--model lite --size 1K`
(cheapest Gemini tier); bump a single image to `fast`/2K only if it renders visibly rough.

- `map.png` — clean outline map of India, no text/labels. REUSED across HOOK / BRIDGE /
  TRADE & WEALTH / 1700 PEAK / DECLINE / TODAY via CSS tint only (neutral → gold →
  desaturated → full color) — one generation, six beats.
- `indus-seal.png` — archival Indus Valley seal/ruins illustration (rembg cutout).
- `zero-manuscript.png` — ancient astronomer/manuscript with numerals (rembg cutout) — does
  double duty for GOLDEN AGE and NALANDA.
- `charkha.png` — spinning wheel, the independence movement's iconic object (rembg cutout) —
  deliberately an OBJECT, not a person, sidesteps any likeness question entirely.
- `modern-skyline.png` — generic modern skyline silhouette, no real specific landmark (rembg
  cutout).
- `rocket-moon.png` — rocket/lander + Moon illustration (rembg cutout).
- No new `paper.png` — `PaperBG` with no `src` + `Grain` gives the paper-world look for free.

## Production notes

- **No depiction of any real person, living or historical** — landscapes/artifacts/objects/
  maps/skyline only. Sidesteps every likeness/publicity-rights question.
- Cues estimated from beats.json windows first; retime to real word starts after gen_voice.py
  runs.
- Contrast rule (DESIGN.md, locked): every SerifStatement over map/photo layers uses
  `backing`; LabelChip light accents get dark `kickerColor`.
- SFX pass after voice: paper slides on entrances, soft thud on cutout `place`, whoosh per
  camera move, route-scribble on the Indus river pin, chime on the stat-chip payoffs (1700
  peak, moon landing). Sparse, editorial, mostly optional:true.
