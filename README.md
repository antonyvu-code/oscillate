# OSCILLATE

Independent electronic label + 24-hour radio — a **concept study in single-saturated-accent**.

The whole page carries exactly **one** saturated colour (`--signal`). Everything readable
stays warm-neutral (near-black → off-white); the signal is spent only on *alive* moments:
the live dot, the waveform, the cut letter in the wordmark, hover states, the focus ring,
and the currently-live row of the schedule. Because there is only one accent, the eye reads
it as **state** ("this is on air"), not decoration.

Built for the 2026-07-13 webdesign-digest finding: the two-colour SOTD trend is splitting
into a *neutral* branch and a *single-saturated-accent* branch (cold, e.g. Vectr `#3932DC`,
vs hot). The **HOT / COLD** switch in the status bar swaps the accent live — the only thing
that changes across the whole system is that second colour.

## Stack
- Vite (vanilla JS, no framework)
- Canvas 2D waveform that reads `--signal` from CSS at draw time
- System font pairing: monospace as the "broadcast" connective tissue + a heavy grotesque wordmark (no webfonts, no silent fallbacks)
- Committed dark, `prefers-reduced-motion` respected, WCAG-checked (signal ≈ 5.5:1 on ground)

## Run
```bash
npm install
npm run dev      # http://localhost:5620
npm run build
```

## Accessibility notes
- The signal is never used for running text; body/nav/times stay off-white or muted.
- `#FF4A1C` (hot) and `#2F6BFF` (cold) both clear 3:1 on `#0C0A09`, so even the large accent
  glyphs pass AA large-text.
- Reduced motion freezes the waveform, stops the ticker and the live pulse.
