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

## Tabs

- **Today** — the daily list. Opens showing only what's left.
- **Trends** — weekly averages of the daily 1–10 ratings.
- **Path** — the 40-week reading curriculum (Jul 2026 → Apr 2027).
- **Log** — books, recipes, coding concepts. Fills the 2026 milestones automatically.
- **2026** — year goals, momentum by month, workout adherence.

See `CLAUDE.md` for design principles before changing anything.
