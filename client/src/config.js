// Uses whatever host the page was loaded from (localhost on this machine,
// or the machine's LAN IP when opened from another device like a phone)
// so the API URL doesn't need to be hardcoded to one or the other.
export const API_URL = `http://${window.location.hostname}:5000`;
