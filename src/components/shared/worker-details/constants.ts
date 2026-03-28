/** Small transparent PNG placeholder when photo cannot be loaded (e.g. CORS). */
export const PLACEHOLDER_PHOTO_DATAURL =
  'data:image/svg+xml;base64,' +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" fill="#e2e8f0"/><text x="50" y="65" text-anchor="middle" fill="#64748b" font-size="11" font-family="sans-serif">No photo</text></svg>',
  );

export const WORKER_PHOTO_PROXY_PATH = '/worker/photo-proxy';
