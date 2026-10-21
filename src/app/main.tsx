import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initI18n } from '@/shared/i18n';
import { App } from './App';
import './styles/index.css';

void initI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

// Register the service worker (offline support) in production builds only.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
}
