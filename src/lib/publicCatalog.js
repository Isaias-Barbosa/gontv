import { apiRequest, apiBaseUrl } from './api';
const key = `gontv.public-catalog.v1:${apiBaseUrl}`;
const maxAge = 5 * 60 * 1000;
let pending;
export function readPublicSnapshot() {
  try {
    const cached = JSON.parse(localStorage.getItem(key));
    if (!cached || Date.now() - cached.savedAt > maxAge || !Array.isArray(cached.animes)) return null;
    return { ...cached, animes: cached.animes.filter(anime => anime.visibility !== 'draft') };
  } catch { return null; }
}
export function storePublicSnapshot(payload) {
  try {
    localStorage.setItem(key, JSON.stringify({ animes: payload.animes.filter(anime => anime.visibility !== 'draft'), storage: payload.storage, savedAt: Date.now() }));
  } catch { /* Storage may be unavailable or full; network loading still works. */ }
}
export function loadPublicCatalog() {
  if (!pending) {
    pending = apiRequest('/api/animes/public', { anonymous: true }).then(payload => {
      if (!Array.isArray(payload.animes) || payload.animes.some(anime => anime.visibility === 'draft')) throw new Error('A API retornou um catálogo público inválido.');
      storePublicSnapshot(payload);
      return payload;
    }).finally(() => { pending = null; });
  }
  return pending;
}
