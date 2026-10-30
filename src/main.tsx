import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register service worker for iPad PWA and offline caching
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.debug('Service Worker registered successfully with scope:', reg.scope);
      })
      .catch((err) => {
        console.debug('Service Worker registration skipped or failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
