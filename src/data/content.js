// All the words on the site live here, so updating a project never means touching layout code.

export const links = {
  github: 'https://github.com/lewis793',
  githubUni: 'https://github.com/LG9757',
  linkedin: 'https://www.linkedin.com/in/lewis-grice',
};

export const work = [
  {
    id: 'platform',
    short: 'The one place GoKarya’s consultants run client work: projects, calendar, meetings and tasks, with AI agents that draft the paperwork and people who approve it.',
    plate: 'platform',
    name: 'GoKarya’s delivery platform',
    role: 'Built from the first commit, September 2026',
    detail: [
      'Projects: boards, sprints, backlog, ideas with votes, dashboards, reports, time tracking and its own query language',
      'Calendar and meetings: transcripts, live transcription, prep and follow-ups',
      'Client workspaces where every requirement, decision and risk links back to the call or email it came from',
      'AI agents pick up queued tasks inside one client’s data and stop for a person to approve',
      '1,600+ commits, 160+ screens and 540 test files in two months',
    ],
    stack: ['Next.js', 'TypeScript', 'Postgres', 'Claude Agent SDK', 'Vercel'],
    links: [],
    note: 'Internal product, so there is no public link.',
  },
  {
    id: 'gokarya-site',
    short: "GoKarya’s marketing site, rebuilt around a WebGL particle hero that changes shape as you hover each industry.",
    plate: 'gokarya',
    name: 'gokarya.com',
    role: 'Owner of the site redesign',
    summary:
      "GoKarya's marketing site. I rebuilt it around a WebGL particle hero whose formation changes as you hover each industry in the headline, and gave it a written design system so every page stays consistent.",
    detail: [
      'three.js particle field that pauses off screen and respects reduced motion',
      'Fonts, colour and spacing recorded in a design file with a log of every decision',
      'Build step that writes per-page SEO metadata',
    ],
    stack: ['React', 'three.js', 'GSAP', 'Vite', 'Vercel'],
    links: [{ label: 'Visit gokarya.com', href: 'https://gokarya.com' }],
  },
];

export const projects = [
  {
    id: 'blocksmash',
    short: 'A block puzzle with an honest dealer: pieces are truly random and never rigged against you. It installs to your phone and plays offline.',
    plate: 'blocksmash',
    name: 'Block Smash',
    summary:
      'A block puzzle with an honest dealer: pieces are drawn at random without ever looking at your score. It installs to your phone and works offline.',
    detail: [
      'Daily puzzle that everyone plays with the same pieces, with hints and a solver',
      'Classic, Timed and Zen modes, seven themes, stats and music',
      'One HTML page and a service worker, with no framework',
    ],
    stack: ['JavaScript', 'HTML', 'CSS', 'PWA'],
    links: [
      { label: 'Play it', href: 'https://lewis793.github.io/blocksmash/' },
      { label: 'Code', href: 'https://github.com/lewis793/blocksmash' },
    ],
  },
  {
    id: 'whisper',
    short: "Hold a shortcut, speak, let go, and tidy text appears wherever you’re typing. It runs entirely on your own PC.",
    plate: 'whisper',
    name: 'Whisper',
    summary:
      'Push-to-talk dictation for Windows that runs entirely on your own PC. Hold a shortcut, speak, let go, and tidy text appears wherever your cursor is.',
    detail: [
      'Speech to text with whisper.cpp on the GPU through Vulkan',
      'A local language model cleans up the text, with its own test set (61 of 63 cases pass)',
      'Personal dictionary, snippets, per-app writing styles and searchable history',
    ],
    stack: ['Rust', 'Tauri', 'React', 'TypeScript', 'SQLite', 'llama.cpp'],
    links: [{ label: 'Code', href: 'https://github.com/lewis793/whisper' }],
  },
  {
    id: 'eidolon',
    short: 'A private AI that runs on your own machine and is learning to write like you.',
    plate: 'eidolon',
    name: 'Eidolon',
    summary:
      'A private AI that runs on your own machine and, over time, learns to write like you. Today it chats with any local model and downloads new ones from Hugging Face.',
    detail: [
      'Starts and supervises a llama.cpp server, and stops it cleanly on quit',
      'Resumable model downloads, checked against Hugging Face’s SHA-256',
      'Next on the roadmap: a knowledge base over your notes, then memory',
    ],
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

export const toolkit = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Java', 'SQL', 'Haskell'] },
  { group: 'Building products', items: ['React', 'Next.js', 'Node', 'Electron', 'Tauri', 'Postgres', 'SQLite'] },
  { group: 'AI and data', items: ['Claude API and Agent SDK', 'llama.cpp', 'PyTorch', 'TensorFlow', 'XGBoost', 'pandas'] },
  { group: 'Shipping', items: ['Git and GitHub', 'Vercel', 'Google Cloud Run', 'Supabase', 'Claude Code'] },
];
