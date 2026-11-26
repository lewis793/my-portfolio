// All the words on the site live here, so updating a project never means touching layout code.

export const links = {
  github: 'https://github.com/lewis793',
  githubUni: 'https://github.com/LG9757',
  linkedin: 'https://www.linkedin.com/in/lewis-grice',
};

// Each project is a case study: three steps that change as you scroll, beside an interactive demo.
const STEPS = ['What it is', 'The hard part', 'Where it’s at'];
const steps = (...texts) => texts.map((text, i) => ({ label: STEPS[i], text }));

export const work = [
  {
    id: 'platform',
    demo: 'platform',
    name: 'Delivery platform',
    kicker: 'GoKarya, since September 2026',
    steps: steps(
      'The one place GoKarya’s consultants run client work: projects, calendar, meetings and tasks, plus every requirement, decision and risk.',
      'AI drafts the paperwork from calls and emails, but nothing counts until a person approves it, and every fact links back to where it came from.',
      'Built from the first commit: 1,600+ commits, 160+ screens and 540 test files in two months.',
    ),
    hint: 'Approve a draft, or hover one to see its source',
    stack: ['Next.js', 'TypeScript', 'Postgres', 'Claude Agent SDK', 'Vercel'],
    uses: ['React', 'Node', 'Supabase', 'Cloud Run'],
    links: [],
    note: 'Internal product, so there is no public link.',
  },
  {
    id: 'gokarya-site',
    demo: 'gokarya',
    name: 'gokarya.com',
    kicker: 'GoKarya, site redesign',
    steps: steps(
      'GoKarya’s marketing site, rebuilt around a particle hero that takes the shape of each industry it serves.',
      '36,000 WebGL particles that morph on hover, pause when off screen and stay still for anyone who prefers reduced motion.',
      'Live, with a written design system and a log of every design decision so each page stays consistent.',
    ),
    hint: 'Pick an industry, then move your cursor through the field',
    stack: ['React', 'three.js', 'GSAP', 'Vite', 'Vercel'],
    uses: ['JavaScript'],
    links: [{ label: 'Visit gokarya.com', href: 'https://gokarya.com' }],
  },
];

export const projects = [
  {
    id: 'blocksmash',
    demo: 'blocksmash',
    name: 'Block Smash',
    kicker: 'Personal project',
    steps: steps(
      'A block puzzle you install on your phone and play offline.',
      'Lots of block puzzles quietly rig which pieces you get. This dealer is truly random and never looks at your score; it only re-deals when a piece can’t fit anywhere.',
      'A daily puzzle with hints and a solver, Timed and Zen modes and seven themes, all in one HTML page and a service worker.',
    ),
    hint: 'Pick a piece, then tap the board to place it',
    stack: ['JavaScript', 'HTML', 'CSS', 'PWA'],
    links: [
      { label: 'Play the full game', href: 'https://lewis793.github.io/blocksmash/' },
      { label: 'Code', href: 'https://github.com/lewis793/blocksmash' },
    ],
  },
  {
    id: 'whisper',
    demo: 'whisper',
    name: 'Whisper',
    kicker: 'Personal project',
    steps: steps(
      'Hold a shortcut, speak, let go, and tidy text appears wherever you’re typing.',
      'It all runs on your own PC: whisper.cpp turns speech into text on the GPU, then a local language model takes out the ums and fixes the punctuation.',
      'The cleanup has its own test set, and 61 of 63 cases pass.',
    ),
    hint: 'Hold the button, or hold Space, to dictate',
    stack: ['Rust', 'Tauri', 'React', 'TypeScript', 'SQLite', 'llama.cpp'],
    links: [{ label: 'Code', href: 'https://github.com/lewis793/whisper' }],
  },
  {
    id: 'eidolon',
    demo: 'eidolon',
    name: 'Eidolon',
    kicker: 'Personal project',
    steps: steps(
      'A private AI that runs on your own machine, with nothing sent anywhere.',
      'It starts and looks after a local llama.cpp server, and downloads models from Hugging Face in a way that resumes and checks every file.',
      'Chat and model downloads work today. Next comes a knowledge base over your notes, then memory, so it learns to write like you.',
    ),
    hint: 'Pick something to ask',
    stack: ['Electron', 'TypeScript', 'React', 'llama.cpp'],
    links: [{ label: 'Code', href: 'https://github.com/lewis793/project-eidolon' }],
  },
];

export const university = [
  {
    id: 'dissertation',
    short: 'Adam, Muon and Sophia compared on RNN, GRU and LSTM language models, with significance tests.',
    name: 'Dissertation: comparing optimisers for language models',
    summary:
      'Trained RNN, GRU and LSTM language models on WikiText-2 and Penn Treebank with Adam, Muon and Sophia, then tested whether the differences between optimisers were significant.',
    stack: ['Python', 'PyTorch', 'Jupyter'],
    href: 'https://github.com/LG9757/diss',
  },
  {
    id: 'f1',
    short: 'Predicts lap times per tyre compound from practice data, then picks the fastest pit strategy.',
    name: 'F1 strategy model',
    summary:
      'Predicts lap times for each tyre compound from practice data, allowing for fuel load, tyre age, driver and team, then picks the pit strategy with the shortest race time. 46 races from 2023 and 2024.',
    stack: ['Python', 'XGBoost', 'pandas', 'scikit-learn'],
    href: 'https://github.com/LG9757/f1-strategy-model',
  },
  {
    id: 'one-guard',
    short: 'A group-built finance learning platform with lessons that unlock as you go.',
    name: 'One Guard (group project)',
    summary:
      'A finance learning platform with sign-in, a learner dashboard, lessons that unlock as you progress, and a paid course flow.',
    stack: ['React', 'Vite', 'Node'],
    href: 'https://github.com/LG9757/entr',
  },
];

// The tools grid is built from each project's stack, so it only shows what I've actually used.
// Small tags (HTML, CSS, Vite, PWA, Jupyter) stay on the project cards but not in the grid.
// `uses` adds tools a project relies on that aren't worth a tag on its card.
export const toolGroups = [
  { label: 'Languages', tools: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Java', 'Haskell'] },
  { label: 'Frameworks', tools: ['React', 'Next.js', 'Node', 'Electron', 'Tauri', 'three.js', 'GSAP'] },
  { label: 'AI and data', tools: ['Claude Agent SDK', 'llama.cpp', 'PyTorch', 'TensorFlow', 'XGBoost', 'pandas', 'scikit-learn'] },
  { label: 'Data and hosting', tools: ['Postgres', 'Supabase', 'SQLite', 'Vercel', 'Cloud Run'] },
];

// Coursework from the degree that isn't a project of its own.
export const coursework = {
  id: 'coursework',
  short: 'Coursework',
  stack: ['Java', 'Haskell', 'TensorFlow', 'Python'],
  note: 'Object-oriented programming in Java, a role-playing game in Haskell, and rainfall and image-compression models in TensorFlow',
};
