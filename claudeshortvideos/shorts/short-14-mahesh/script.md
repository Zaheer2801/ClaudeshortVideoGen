# short-14 · Biography — "Mahesh Babu: four to Varanasi"

**Niche: actor career timeline (biography).** Canvas = ONE persistent vertical
**TimelineRail** (new, local to this shot — not a shared niche lib, just a milestone
rail + dot component). No photo/likeness of Mahesh Babu is generated or used — the video
is 100% typographic/graphic (title cards, stat chips, a lit-up timeline), both because
image models won't reliably render a real named celebrity's likeness and to stay clear
of publicity-rights territory. Every fact below is sourced (see citations) — no invented
box-office numbers, awards, or dates.

## The promise

The career arc: he started as a 4-year-old child actor, and forty-eight years later is
headlining a globe-trotting epic with RRR's director.

## Verified facts (sourced 2026-08-02)

- Born 9 Aug 1975; debuted as a child artist at age 4 in *Needa* (1979), ~9 films as a
  child actor. [IMDb bio](https://www.imdb.com/name/nm1121870/bio/)
- Lead debut: *Rajakumarudu* (1999) — Nandi Award for Best Male Debut.
  [Wikipedia filmography](https://en.wikipedia.org/wiki/Mahesh_Babu_filmography)
- *Pokiri* (2006) — Filmfare Critics Award Best Actor Telugu; became the highest-grossing
  Telugu film at the time (record held until 2011). [Wikipedia filmography](https://en.wikipedia.org/wiki/Mahesh_Babu_filmography)
- *Dookudu* (2011) — first Telugu film to gross over ₹100 crore worldwide.
  [Wikipedia filmography](https://en.wikipedia.org/wiki/Mahesh_Babu_filmography)
- *Sarileru Neekevvaru* (2020) — his highest-grossing film to date.
  [Wikipedia filmography](https://en.wikipedia.org/wiki/Mahesh_Babu_filmography)
- Career total: 9 Nandi Awards, 5 Filmfare Awards South, 4 SIIMA Awards; Forbes India
  Celebrity 100 list every year 2012–2025; one of Indian cinema's highest-paid actors.
  [Wikipedia filmography](https://en.wikipedia.org/wiki/Mahesh_Babu_filmography)
- Upcoming: *Varanasi* (production title SSMB29) — his first film with director SS
  Rajamouli (RRR), co-starring Priyanka Chopra Jonas; a time-travel action epic; releasing
  worldwide 7 April 2027. [Sacnilk](https://sacnilk.com/news/Its_Official_Mahesh_Babus_SSMB29_With_SS_Rajamouli_Titled_Varanasi) ·
  [Pinkvilla](https://www.pinkvilla.com/entertainment/south/ssmb29-mahesh-babu-ss-rajamoulis-jungle-adventure-locks-release-date-to-hit-theaters-on-march-25-2027-report-1398444)

## Beat sheet (~36s)

| # | t (s) | On screen | VO |
|---|-------|-----------|----|
| HOOK | 0.0–3.4 | Frame 0 FULLY composed: timeline rail fully lit, all 6 dots glowing, title **FOUR YEARS OLD / TO GLOBAL EPIC** | "He was four years old on his very first film." |
| SETUP | 3.5–6.9 | Rail dissolves to just dot 1 (1979) glowing; dot 2 (1999) lights, StatChip "LEAD DEBUT · Best Debut award" | "Two decades later, his first lead role won Best Debut." |
| TURN | 7.1–9.6 | Kicker flips to **THE RECORD-BREAKERS** (gold) | "Then came the record-breakers." |
| REVEAL 1 | 9.8–13.2 | Dot 3 (2006) lights, StatChip "POKIRI · Telugu's #1 grosser" | "Pokiri became Telugu cinema's highest grosser of its time." |
| REVEAL 2 | 13.4–16.4 | Dot 4 (2011) lights, StatChip "DOOKUDU · ₹100 Cr milestone" | "Five years later, Dookudu broke the hundred-crore barrier." |
| REVEAL 3 | 16.6–20.0 | Dot 5 (2020) lights, StatChip "SARILERU NEEKEVVARU · his biggest hit yet" | "By twenty-twenty, Sarileru Neekevvaru was his biggest hit yet." |
| REVEAL 4 | 20.2–24.3 | Rail dims; 3 StatChips burst in stacked: 9 NANDI · 5 FILMFARE · FORBES 100 | "Nine Nandi Awards, five Filmfare Awards — one of India's highest earners." |
| TWIST | 24.5–28.6 | Dot 6 (2027, pulsing — upcoming) lights gold, StatChip "VARANASI · with RRR's director" | "Now he's teaming with RRR's director for an epic time-travel saga." |
| PAYOFF/CLOSE | 28.8–32.2 | Full rail glows top to bottom; title re-forms | "From a four-year-old extra to cinema's next big epic." |
| LOOP | 32.2–36.0 | Dissolves back to the fully-lit rail + title (grow) → last frame == frame 0 | (no VO — visual loop only) |

**Outro:** no CTA. Ends on the payoff line while the frame dissolves back into the hook
(fully-lit rail + title), so the replay is seamless.

## Production notes

- **Persistent canvas:** one `TimelineRail` (local component, this shot only) mounted
  frame 0 → loop: a vertical line + 6 dots, each with a year label; a `StatChip` from the
  shared kit appears next to each dot as it lights. No new shared niche lib.
- **No likeness:** zero images/video of Mahesh Babu generated or sourced — typography +
  graphic dots only, consistent with `IDEAS.md`'s TSX-fit rule (photographic proof/real
  faces are NOT what this track renders) and to stay clear of publicity-rights issues.
- Voice = real ElevenLabs (Liam) word times via `gen_voice.py`. This file's `vo` array
  has ESTIMATED start/end only; real times land after Stage 4 runs.
