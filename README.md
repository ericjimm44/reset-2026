# Jimmy's 2026 Reset

Personal growth app. Daily checklist, 40-week reading path, weekly trends, 2026 milestones.

## Run it

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the build locally
```

## Data

Everything is stored in your browser's localStorage under `reset2026-v2`. It never leaves your device.

Use **Backup & restore** (bottom of the app) to copy your data out as JSON — paste it back to recover or move to another device/browser.

## Screens

The app is hub-and-spoke: the home screen is the ensō — a brush circle
that fills as the day fills — plus one suggested next step. Everything
else is one tap deeper:

- **Today's list** — the full checklist, grouped by area.
- **Evening reflection** / **Rate your day** — optional, always.
- **Guidance** / **Why this** — a daily note; the five whys.
- **Trends** — weekly dot grid of the daily 1–10 ratings.
- **Path** — the 40-week reading curriculum (Jul 2026 → Apr 2027).
- **Log** — books, recipes, coding concepts. Fills the 2026 milestones automatically.
- **2026** — the 175-day dot calendar + year goals and workout adherence.
- **Settings** — backup & restore, reset.

Sealing the day is a full-screen moment: answer the one question
honestly (either answer counts), the circle closes, the seal lands.

Dev extra: open `/?enso` for a gallery of the ensō's states.

See `CLAUDE.md` for design principles before changing anything.
