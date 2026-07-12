# Jimmy's 2026 Reset

A personal growth and accountability app. Built for one user: Jimmy.

## What this is

Three layers, deliberately separated:

1. **The daily engine** (`Today`) — a simple checklist. Direction comes from the year goals, but this is the loop that actually moves things.
2. **The reading path** (`Path`) — a 40-week, 10-book curriculum, Jul 2026 → Apr 2027.
3. **The reflection loop** (`Trends`, evening reflection, seal ritual) — feedback.

## Design principles — do not violate these

These were learned the hard way over many iterations. Changing them breaks the app's purpose.

- **Daily tasks must be simple enough to complete on the hardest days.** If they're too ambitious, anxiety convinces Jimmy he's already failed. An earlier "Core 6" version with journaling attached to every item was *too heavy* and was reverted. Do not re-add complexity to the daily list.
- **The app opens in focus mode: only what's NEXT.** The hub shows the ensō, one suggested next box, and nothing else above the fold. The full list, reflection, and ratings each live one tap deeper. Never show a wall of checkboxes by default.
- **"The One Rule" is the anti-overwhelm device.** When anxiety hits, the app asks one question: *what's the next box I can check?* and names a single box — it IS the hub's next-step button. Never remove this.
- **The streak counts SEALED days, not completed checklists.** Answering the seal question honestly — even "Not today" — seals the day and keeps the streak. Gating the streak on a perfect list would create the exact rumination trap the app exists to break.
- **Ratings are optional.** Two rating systems exist on purpose: the daily 1–10s (6 metrics, quick, feed Trends) and the monthly scorecard (10 metrics, slower, on Path). Merging them adds friction that kills consistency.
- **Trend weekly, not daily.** Trends shows weekly averages. Never surface a daily score as a judgment.
- **Tone: calm, non-judgmental, no gamification.** No fire emojis, no streaks-lost shaming, no "you failed." The aesthetic is washi paper + sumi ink + moss green (Japanese minimal). The ensō ring is the signature.

## Personal context

- Kids: **Ana** (12) and **Adriel** (8). The relationship item adapts via a "do you have the kids today?" toggle — Jimmy sees *"be fully present"* OR *"send a loving text,"* never both.
- **Karen** is an ex/estranged partner. Several goals and mistakes-to-avoid reference not seeking reassurance from her. Handle this content with care and without editorializing.
- The reading path is emotionally heavy (attachment, trauma, healing). Keep copy supportive and plain.

## Architecture (ensō redesign, Jul 2026)

Hub-and-spoke, not tabs. The home screen is the ensō (brush circle = the day,
filling as boxes are checked); everything else is a single-purpose "moment"
one tap deeper, each with a Back-to-Today. Sealing is a full-screen ceremony
(SealMoment): the honest question, then the circle closes and the vermilion
済 stamp lands.

```
src/
  App.jsx              state owner, screen router, save/load, derived stats
  lib/
    storage.js         localStorage (key: reset2026-v2), export/import
    dates.js           START/END, calendar-day math, day shape
    theme.js           color tokens
  data/
    daily.js           GROUPS, REFLECT, RATINGS, SEAL_Q, ONE_RULE
    path.js            PATH (40 weeks), SCORE (monthly scorecard)
    goals.js           YEAR milestones, TRACKERS
    voice.js           all non-task copy: guidance notes, whys, captions
  components/
    Enso.jsx           the brush ring (pct/sealed/drawing); /?enso dev gallery
    Home.jsx           the hub: greeting, ensō, One Rule next step, seal, menu
    SealMoment.jsx     full-screen seal ceremony
    Icons.jsx          hand-drawn line icons (no icon library)
    ui.jsx             Screen chrome, Check, Row, SecHead, Scale (dots)
    Trends.jsx         weekly dot grid   Path.jsx  Log.jsx  Year.jsx (dot calendar)
    screens/
      List.jsx  Reflect.jsx  Rate.jsx  Guidance.jsx  Why.jsx  Settings.jsx
```

All state lives in `App.jsx` and flows down. Components are presentational +
local UI state only. The localStorage schema is unchanged from the tab-era app
— the redesign was UI-only, no data migration.

Fonts are self-hosted via `@fontsource` (Playfair Display for ceremony/serif,
Inter for UI) — imported in `main.jsx`, no CDN.

## Key mechanics

- **Dates:** `daysBetween` compares calendar days (`setHours(0,0,0,0)`), not raw ms. A naive diff made the app show "Day 2" on day one.
- **Auto-completing goals:** Logging a book/recipe/concept fills the matching 2026 milestone. The "90% of scheduled workouts" goal is computed from daily `checks.workout` vs. an adjustable weekly target (defaults 4/wk), and only auto-checks at ≥90% with ≥8 workouts so it can't falsely go green in week one.
- **Persistence:** debounced ~450ms to localStorage. Data is device-local; Backup & restore exports/imports JSON.

## Scope note

The daily engine runs Jul 10 – Dec 31 2026. The reading path intentionally runs longer (into Apr 2027) because one book a month is the pace Jimmy can actually absorb. Don't "fix" this mismatch.

## Ideas not yet built

- Month-by-month history view for Path progress
- Reminder/nudge to back up periodically
- Optional: PWA / installable to home screen
