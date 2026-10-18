export const normalizeAnimeText = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const createdTime = anime => {
  const time = Date.parse(anime.createdAt || '');
  return Number.isFinite(time) ? time : 0;
};
export function sortAnimes(animes, order = 'newest') {
  return [...animes].sort((a, b) => {
    if (order === 'title') return String(a.title || '').localeCompare(String(b.title || ''), 'pt-BR', { sensitivity: 'base', numeric: true });
    const difference = createdTime(b) - createdTime(a) || (Number(b.id) || 0) - (Number(a.id) || 0);
    return order === 'oldest' ? -difference : difference;
  });
}
export function filterAnimes(animes, { search = '', genre = '', type = '', language = '' } = {}) {
  const query = normalizeAnimeText(search.trim());
  return animes.filter(anime =>
    (!query || normalizeAnimeText(`${anime.title} ${anime.subtitle || anime.subtitule || ''} ${anime.slug || ''}`).includes(query)) &&
    (!genre || (anime.genres || []).includes(genre)) &&
    (!type || anime.Type === type) &&
    (!language || anime.language === language)
  );
}
