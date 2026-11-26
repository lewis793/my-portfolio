# Design: Lewis Grice portfolio

The reference for how the site looks. Changing it is normal; add a line to the Decisions Log when you do.

## Idea
The site is a quiet, neutral frame, and the work carries the colour. Each project gets a **plate**: a small drawing of the real thing in that project's own palette (Block Smash's brick toy set, Eidolon's obsidian and marble, Whisper's dictation bar, the GoKarya violet void, a Nexus review inbox). Plates live in `src/components/Plates.jsx` and are decorative (`aria-hidden`). The text beside them carries the meaning.

## Audience and job
Recruiters, engineers and anyone who meets me at GoKarya or Bath. In thirty seconds it should show that I ship real software, and give a quick way to get in touch.

## Colour
| Token | Light | Dark | Role |
|---|---|---|---|
| `--ground` | `#eef0ec` chalk | `#15191b` | Page |
| `--surface` | `#f8f9f6` | `#1c2124` | Inputs, outline buttons |
| `--ink` | `#1e2326` graphite | `#e6e9e4` | Text |
| `--muted` | `#545c60` | `#a3aba7` | Secondary text (AA on ground) |
| `--line` | `#cfd4cd` | `#2f3639` | Hairlines between sections |
| `--accent` | `#2448c9` signal blue | `#8fa8ff` | Primary button, focus ring. Used rarely |

The shell avoids violet so it never reads as a GoKarya page. Dark mode follows the system setting.

## Type
- **Bricolage Grotesque** (variable, self-hosted via Fontsource) for headings, weight 650, narrowed to `wdth 88` in the hero, tight tracking.
- **Public Sans** (variable) for body text and UI. 17px body, 16px on phones.
- No monospace labels, no all-caps eyebrows, no italics for emphasis.

## Layout
- 1180px column, left-aligned. Sections are separated by a hairline and generous space.
- Hero: a large headline, with the copy set to the right of the headline's left edge on wide screens.
- Work: wide plate beside the text, alternating sides. Projects: three cards. University: three plain columns under a heavy rule. Toolkit: a definition list.
- Corners: 14px on plates, pill buttons, 10px on inputs.

## Motion
Only the Whisper plate moves (the waveform and caret), because that is what the app does. Everything respects `prefers-reduced-motion`.

## Voice
Plain, first person, specific. Say what a thing does and what is true about it (numbers from the repos), not adjectives. No em dashes.

## Decisions Log
| Date | Decision | Why |
|---|---|---|
| 2026-11-26 | Full redesign: neutral frame + per-project plates; logo grid and screenshot cards removed | The old site was a template (gradient name, icon nav, logo tooltips). Drawings of the real products say more than logos. |
| 2026-11-26 | Hosting moved to `lewis793.github.io/my-portfolio` | Lewis's current GitHub account. Older uni repos stay on LG9757 and are linked from the footer. |
| 2026-11-26 | Gestures left off the site | Lewis's call. |
