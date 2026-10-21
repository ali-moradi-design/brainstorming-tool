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
