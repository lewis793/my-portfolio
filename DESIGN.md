# Design: Lewis Grice portfolio

The reference for how the site looks. Changing it is normal; add a line to the Decisions Log when you do.

## Idea
The site is a quiet, neutral frame, and the work carries the colour. Each project gets a **plate**: a small drawing of the real thing in that project's own palette (Block Smash's brick toy set, Eidolon's obsidian and marble, Whisper's dictation bar, the GoKarya violet void, the GoKarya platform's review inbox). Plates live in `src/components/Plates.jsx` and are decorative (`aria-hidden`). The text beside them carries the meaning.

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
- **Familjen Grotesk** (variable 400 to 700, self-hosted via Fontsource) for headings and the hero, mostly at 600 with tight tracking. Chosen over Bricolage Grotesque, which design guides now list as an AI-default face alongside Fraunces, Newsreader, Instrument Serif and Space Grotesk.
- **Public Sans** (variable) for body text and UI. 17px body, 16px on phones.
- No monospace labels, no all-caps eyebrows, no italics for emphasis.

## Layout
- 1180px column, left-aligned. Sections are separated by a hairline and generous space.
- Hero: a large headline, with the copy set to the right of the headline's left edge on wide screens.
- Work: wide plate beside the text, alternating sides. Projects: three cards. University: three plain columns under a heavy rule. Toolkit: a definition list.
- Corners: 14px on plates, pill buttons, 10px on inputs.

## Motion
The site is meant to show off front-end craft, so motion is a feature, not a garnish. It lives in `src/lib/motion.js` (GSAP, ScrollTrigger, SplitText, Lenis) and `src/motion.css`.

- **Scroll:** Lenis smooth scroll drives ScrollTrigger; in-page links go through `scrollToTarget`. A progress bar runs along the top.
- **Hero:** one statement, no subtitle, beside a mini desktop (`Desktop.jsx`) with a menu bar, a live UK clock and an icon per project. Icons open that project's live drawing in a window that grows out of the icon; windows drag by the title bar, raise on click and close. Three open one after another on load. Hovering or focusing a project's words in the statement opens or raises its window (delegated listener in `Hero.jsx`, since SplitText rebuilds the headline's DOM). On phones the icons become a dock above the windows.
- **Work viewer** (`Showcase.jsx`, `src/casestudy.css`): one section holds every project. A tab row grouped by GoKarya and Personal (sliding indicator, arrow keys) selects a project; below it, the write-up (what it is, the hard part, where it's at) sits beside a live demo in the project's own colours (`src/components/demos/`): the platform inbox, the gokarya.com particles with industry buttons, a playable Block Smash, hold-to-dictate Whisper and an Eidolon chat. Demos lazy-load on first view and stay mounted, so a game survives switching tabs. Hero links and the command menu select a project with a `showproject` event. The small looping drawings (`Plates.jsx`) live only in the hero desktop.
- **Chrome:** magnetic buttons, a gliding nav pill, a theme toggle with a View Transition circle, a Ctrl/⌘K command palette, and film grain.
- **Lower page:** headings reveal line by line, counters count up, and a sent message bursts into blocks. The Tools section (`Tools.jsx`) shows tools as chips sized by how many projects used them, above a row of project tokens in each project's colour. Hovering a tool draws curved lines to the projects that used it; hovering a project draws lines up to its tools. Tapping a tool pins it (phones). Built from each project's stack.
- **Reduced motion:** no smooth scroll, no splits or loops; plates show their finished state and counters show final values.

## Voice
Plain, first person, specific. Say what a thing does and what is true about it (numbers from the repos), not adjectives. No em dashes.

## Decisions Log
| Date | Decision | Why |
|---|---|---|
| 2026-11-26 | Full redesign: neutral frame + per-project plates; logo grid and screenshot cards removed | The old site was a template (gradient name, icon nav, logo tooltips). Drawings of the real products say more than logos. |
| 2026-11-26 | Hosting moved to `lewis793.github.io/my-portfolio` | Lewis's current GitHub account. Older uni repos stay on LG9757 and are linked from the footer. |
| 2026-11-26 | Gestures left off the site | Lewis's call. |
| 2026-11-26 | Full motion layer added (GSAP + Lenis, living plates, block-field hero, kinetic type, palette, cursor) | Lewis: the site should show off web design. Every effect is tied to the content (the blocks are Block Smash's, the plates show what each product does). |
| 2026-11-26 | Less text: one-sentence summaries, tag chips, details behind "How it's built"; Work two-up, Projects bento, University as rows | Lewis: too much text and every section looked the same. Facts are kept, just not shown by default. |
| 2026-11-26 | Hero becomes one statement beside a particle field that draws each project; block field removed | Lewis: the headline-then-subtitle layout didn't work, and the blocks only related to Block Smash. |
| 2026-11-26 | Mini desktop replaces the particle field | Lewis: the particles were too close to the gokarya.com hero; he wanted something of his own. The desktop reuses his projects' own drawings. |
| 2026-11-26 | Custom cursor removed; native pointer everywhere | Lewis: the big labelled circle covered what you were pointing at. |
| 2026-11-26 | Projects become pinned case studies with interactive demos; cards, bento and "How it's built" removed | Lewis: the projects section needed work. The hero desktop already shows the small drawings, so this section goes deeper: why each project is interesting, and something you can actually use. |
| 2026-11-26 | Pinned chapters folded into one tabbed Work viewer; Projects merged into Work | Lewis: too much scrolling to get past the projects. The viewer is about a screen tall and keeps every demo. |
| 2026-11-26 | Toolkit marquee replaced by a tools-by-project grid | Lewis: the giant scrolling outlined words looked like AI slop. The grid says something true: where each tool was actually used. |
| 2026-11-26 | Tools grid redrawn as chips and project tokens joined by lines on hover | Lewis: the idea was right but the grid read like a spreadsheet. |
| 2026-11-26 | Tools section centred | Lewis: didn't like it aligned to the left. Centred, the chips and lines read as a tree down to the projects. |
| 2026-11-26 | Contact becomes a compact strip: heading and links on one line, form on one row, message box grows as you type | Lewis: the contact section was too big. |
| 2026-11-26 | Footer name shrunk from wall-sized to a 22px heading on one row with the footer notes | Lewis: the name was too big. |
| 2026-11-26 | Display font Bricolage Grotesque replaced by Familjen Grotesk | Lewis didn't like the hero font. Research (Visio Design, Oct 2026) lists Bricolage among the faces AI tools default to; Lewis picked Familjen from a side-by-side of recommended alternatives. The hero letters now swell by weight only (600 to 700). |
