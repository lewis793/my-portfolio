import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/familjen-grotesk';
import '@fontsource-variable/public-sans';
import App from './App.jsx';
import { restoreTheme } from './lib/theme.js';

restoreTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
