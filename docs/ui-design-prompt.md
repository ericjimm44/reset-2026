# UI Design Prompt — Jimmy's 2026 Reset

Copy everything below the line into your design tool (Claude, v0, a designer brief, etc.).

---

Design the UI for **"2026 Reset"** — a private, single-user personal growth and accountability app. One person uses it every day, often on his phone, sometimes on his hardest days. The design's job is to lower anxiety, never to impress.

## The user and the emotional brief

The user is rebuilding his life over a 175-day daily practice plus a 40-week reading path. When anxiety hits, his instinct is to feel he's already failed. The UI must be the counterweight:

- **Calm over clever.** No gamification, no fire emojis, no confetti, no red badges, no "streak lost" shaming. Progress is acknowledged quietly.
- **One thing at a time.** The default view answers a single question: *what's the next box I can check?* Everything else stays folded away until asked for.
- **Honesty is rewarded, not perfection.** The day ends with a "seal" ritual — answering one reflective question honestly (even "Not today") seals the day and keeps the streak. The seal moment should feel ceremonial and gentle, like pressing a hanko stamp, not like submitting a form.

## Aesthetic direction: washi paper + sumi ink + moss

Japanese-minimal, tactile, papery. Think a well-made paper journal, not a dashboard.

**Existing palette (keep or refine, don't replace the mood):**

| Token | Hex | Role |
|---|---|---|
| washi | `#E9E5DB` | page background (warm paper) |
| card | `#F3F0E8` | card surfaces |
| ink | `#262521` | primary text (sumi ink) |
| sub | `#726E62` | secondary text |
| faint | `#9A9484` | tertiary/labels |
| line | `#D8D2C4` | hairline borders |
| moss | `#6C7A4F` | primary accent — completion, growth |
| moss-deep | `#525E3A` | accent emphasis |
| indigo | `#3C5470` | "The One Rule" / guidance accent |
| seal | `#9C4B3C` | vermilion — the seal ritual, sparing warnings |

**Typography:** a serif (currently Georgia) for headlines, day counts, stat numbers, and reflective questions in italic; a quiet sans for everything else. Heavy use of small, letterspaced, uppercase eyebrow labels. Feel free to propose better font pairings that keep the ink-on-paper feel.

**Signature motif:** the **ensō** (hand-drawn zen circle) — used as a progress ring and as the app's identity mark. Keep it. Imperfect, brushy, never a sterile geometric donut.

## Structure — five tabs, mobile-first (~420px column, works on desktop)

1. **Today** (home) — header with wordmark, "Day N of 175" eyebrow, greeting. Then:
   - "The One Rule" card (indigo accent): one sentence of guidance plus a single suggested next checkbox. This is the anti-overwhelm device — give it presence without alarm.
   - A yes/no toggle ("do you have the kids today?") that swaps one relationship task.
   - **Focus-mode task list**: only unchecked items visible, grouped under whisper-quiet category labels (MIND / BODY / HOME / GROWTH / RELATIONSHIPS). Checked items vanish; a "show everything" link reveals them. ~14 items max.
   - Collapsed sections for Evening Reflection (a few short journal fields) and optional 1–10 ratings (6 metrics, tappable dot scale).
   - The **seal ritual**: a centered serif question in italics, Yes / "Not today" pill buttons, and a full-width ink-black SEAL TODAY button. Sealed state turns quiet moss.
   - Small stat strip (days sealed, best streak, 2026 goals %) and a closing italic mantra line.
2. **Trends** — weekly averages of the 6 daily ratings. Small multiples or soft line charts. Never display a daily score as a judgment; weekly only, muted colors, no red-for-low.
3. **Path** — a 40-week reading curriculum (10 books, ~1/month, Jul 2026 → Apr 2027). Week-by-week cards with book, focus, and practice. Include a monthly 10-metric scorecard. The content is emotionally heavy (attachment, healing) — keep the frame plain and supportive.
4. **Log** — simple lists: books finished, recipes learned, coding concepts. Add-and-delete rows, no friction.
5. **2026** — year milestones with auto-completed checkmarks, month-by-month momentum, workout adherence (target ~90%). Progress bars are thin, moss-colored, and honest.

## Hard constraints

- Default state of Today = only what's LEFT. Never a wall of checkboxes.
- The One Rule card and the seal ritual must survive any redesign.
- Ratings and reflection are optional and collapsed by default.
- Trends are weekly, never daily judgments.
- Light theme is the identity; if you add dark mode, it's "night ink" (warm dark paper), not tech-black.
- Respect `prefers-reduced-motion`. Any motion is slow, subtle, paper-like (soft fades, gentle settles — no bounces).
- Touch targets ≥ 44px; the whole daily loop must be operable one-handed.

## Deliverables

High-fidelity mobile mockups of all five tabs (Today in three states: fresh morning, partially done, sealed evening), the seal interaction moment, a refined color/type token sheet, and the ensō progress ring in 0%, 60%, and 100% states.
