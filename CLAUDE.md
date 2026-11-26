# CLAUDE.md: Lewis Grice portfolio

Vite + React 19, one page. `npm run dev`, `npm run build`, `npm run lint`, `npm run deploy` (builds, then pushes `dist/` to the `gh-pages` branch; live at https://lewis793.github.io/my-portfolio/).

- **Copy lives in `src/data/content.js`.** Adding a project means adding an entry there and, if it gets a plate, a drawing in `src/components/Plates.jsx`.
- **DESIGN.md** holds the tokens, type and principles. Departures are fine; log them in its Decisions Log.
- Claims on the site must be true to the repos (commit counts, test results, features). Check before writing.
- GoKarya work: no client names, no internal screenshots, no repo links. Nexus is described in general terms only.
- The contact form posts to EmailJS with public keys (`src/components/Contact.jsx`).
- `vite.config.js` `base` must match the repo name for GitHub Pages.
