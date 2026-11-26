// All the words on the site live here, so updating a project never means touching layout code.

export const links = {
  github: 'https://github.com/lewis793',
  githubUni: 'https://github.com/LG9757',
  linkedin: 'https://www.linkedin.com/in/lewis-grice',
};

// Each project is a case study: three steps that change as you scroll, beside an interactive demo.
const STEPS = ['What it is', 'Hard part', 'Now'];
const steps = (...texts) => texts.map((text, i) => ({ label: STEPS[i], text }));

export const work = [
  {
    id: 'platform',
    demo: 'platform',
    name: 'Delivery platform',
    kicker: 'GoKarya, New York, since September 2026',
    steps: steps(
      'Where GoKarya’s consultants run client work: projects, calendar, meetings and every decision.',
      'AI drafts from calls and emails, but nothing counts until a person approves it.',
      '1,600+ commits, 160+ screens and 540 test files in two months.',
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
      'GoKarya’s marketing site, rebuilt around a particle hero.',
      '36,000 WebGL particles that reshape for each industry and pause when off screen.',
      'Live, with a design system and a log of every design decision.',
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
      'A block puzzle for your phone that works offline.',
      'Lots of puzzles rig the pieces. This dealer is truly random and never looks at your score.',
      'Daily puzzle with a solver, three more modes and seven themes, in one HTML page.',
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
    inProgress: true,
    kicker: 'Personal project',
    steps: steps(
      'Hold a key, speak, let go, and tidy text appears wherever you’re typing.',
      'All on your own PC: speech to text on the GPU, then a local model cleans it up.',
      '61 of 63 cleanup tests pass.',
    ),
    hint: 'Hold the button, or hold Space, to dictate',
    stack: ['Rust', 'Tauri', 'React', 'TypeScript', 'SQLite', 'llama.cpp'],
    links: [{ label: 'Code', href: 'https://github.com/lewis793/whisper' }],
  },
  {
    id: 'eidolon',
    demo: 'eidolon',
    name: 'Eidolon',
    inProgress: true,
    kicker: 'Personal project',
    steps: steps(
      'A private AI that runs on your own machine.',
      'It runs and looks after a local llama.cpp server; model downloads resume and are checked.',
      'Chat works. Next: a knowledge base over your notes, then memory.',
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
