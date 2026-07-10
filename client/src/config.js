// In production (Vercel), the API lives on a different domain entirely, so
// the URL is baked in at build time via VITE_API_BASE_URL. In local/LAN dev
// there's no build step, so fall back to whatever host the page was loaded
// from (localhost on this machine, or the machine's LAN IP from a phone).
export const API_URL =
  import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000`;
