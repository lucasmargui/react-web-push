// config.js
export const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const URL = isLocalhost
  ? import.meta.env.VITE_API_URL        // Dev (Vite)
  : window._env_.VITE_API_URL;          // Produção (Docker/Nginx)
