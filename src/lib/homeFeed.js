import { normalizeAnimeText, sortAnimes } from './animeList';
const timestamp = value => {
  const parsed = Date.parse(typeof value === 'string' ? value.replace(' ', 'T') : '');
  return Number.isFinite(parsed) ? parsed : 0;
};
export function getRecentAnimes(animes, category, limit = 10) {
  return sortAnimes(animes.filter(anime => {
    if (anime.visibility === 'draft') return false;
    if (category === 'films') return anime.Type === 'Filme';
    return anime.Type !== 'Filme' && normalizeAnimeText(anime.language) === category;
  })).slice(0, limit);
}
export function getRecentEpisodes(animes) {
  return animes.filter(anime => anime.visibility !== 'draft').flatMap(anime =>
    (anime.episodes || []).map((episode, index) => ({ anime, episode, index }))
  ).sort((a, b) => {
    const time = item => Math.max(timestamp(item.episode.dataCreateEpisode || item.episode.createdAt), item.episode.lancamento ? timestamp(item.episode.releaseHighlightedAt) : 0);
    return time(b) - time(a) || (Number(b.anime.id) || 0) - (Number(a.anime.id) || 0) || (Number(b.episode.id) || 0) - (Number(a.episode.id) || 0) || b.index - a.index;
  });
}
export function episodeDates(form, current, now = new Date().toISOString()) {
  return {
    dataCreateEpisode: current ? current.dataCreateEpisode || current.createdAt || null : now,
    releaseHighlightedAt: form.lancamento ? (!current?.lancamento ? now : current.releaseHighlightedAt || null) : null,
  };
}
