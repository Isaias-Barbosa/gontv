const express = require('express');
const axios = require('axios');
const query = `query AnimeImport($id: Int, $idMal: Int) {
  Media(id: $id, idMal: $idMal, type: ANIME) {
    id idMal title { romaji english native } format status
    description(asHtml: false) coverImage { extraLarge large } bannerImage
    startDate { year month day } season seasonYear duration genres
    studios(isMain: true) { nodes { name } }
    staff(perPage: 25) { edges { role node { name { full } } } }
  }
}`;
function normalizeAnime(media, partial = false) {
  const date = media.startDate;
  const from = date?.year && date.month && date.day ? `${date.year}-${String(date.month).padStart(2,'0')}-${String(date.day).padStart(2,'0')}T00:00:00Z` : null;
  const statuses = { RELEASING: 'Currently Airing', FINISHED: 'Finished Airing', NOT_YET_RELEASED: 'Not yet aired', CANCELLED: 'Cancelled', HIATUS: 'On Hiatus' };
  const types = { MOVIE: 'Movie', OVA: 'OVA', SPECIAL: 'Special', TV: 'TV', TV_SHORT: 'TV', ONA: 'TV', MUSIC: 'Special' };
  const director = media.staff?.edges?.find(item => /^director$/i.test(item.role))?.node?.name?.full || '';
  return {
    anilist_id: media.id, mal_id: media.idMal,
    title: media.title.romaji || media.title.english || media.title.native,
    title_english: media.title.english, title_japanese: media.title.native,
    type: types[media.format] || 'TV', status: statuses[media.status] || '',
    synopsis: String(media.description || '').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#0?39;/g,"'"),
    images: { jpg: { large_image_url: media.coverImage?.extraLarge || media.coverImage?.large || '' } },
    bannerImage: media.bannerImage || '', aired: { from }, year: media.seasonYear || date?.year || null,
    premiered: media.season && media.seasonYear ? `${media.season.toLowerCase()} ${media.seasonYear}` : '',
    duration: media.duration ? `${media.duration} min por episódio` : '',
    genres: (media.genres || []).map(name => ({ name })), studios: media.studios?.nodes || [], director,
    warnings: partial ? ['Dados principais carregados. Alguns detalhes estão indisponíveis; revise os campos antes de salvar.'] : [],
  };
}
function createAniListRouter(post = (url, body, options) => axios.post(url, body, options)) {
  const router = express.Router();
  const handler = byMal => async (req, res) => {
    const id = Number(req.params.id);
    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) return res.status(400).json({ error: 'Informe um ID numérico válido.' });
    try {
      const response = await post('https://graphql.anilist.co', { query, variables: byMal ? { idMal: id } : { id } }, { timeout: 15000, headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });
      const payload = response.data;
      const media = payload?.data?.Media;
      const valid = media && (media.title?.romaji || media.title?.english || media.title?.native);
      if (valid && Number(byMal ? media.idMal : media.id) === id) return res.json(normalizeAnime(media, Boolean(payload.errors?.length)));
      if (payload?.errors?.some(error => Number(error.status) === 429)) { res.set('Retry-After', '60'); return res.status(429).json({ error: 'O AniList atingiu o limite de consultas. Aguarde um minuto e tente novamente.' }); }
      if ((media === null && !payload?.errors?.length) || payload?.errors?.some(error => Number(error.status) === 404)) return res.status(404).json({ error: byMal ? 'Nenhum anime do AniList corresponde a este ID do MyAnimeList.' : 'Anime não encontrado no AniList. Use o ID da página do AniList, que é diferente do ID do MAL.' });
      return res.status(502).json({ error: 'O AniList retornou dados incompletos. Tente novamente mais tarde.' });
    } catch (error) {
      if (error.response?.status === 404) return res.status(404).json({ error: 'Anime não encontrado no AniList. Confira se o ID pertence a um anime.' });
      if (error.response?.status === 429) { res.set('Retry-After', '60'); return res.status(429).json({ error: 'O AniList atingiu o limite de consultas. Aguarde um minuto e tente novamente.' }); }
      if (['ECONNABORTED','ETIMEDOUT'].includes(error.code)) return res.status(504).json({ error: 'O AniList demorou para responder. Tente novamente mais tarde ou use a outra fonte.' });
      return res.status(502).json({ error: 'Não foi possível consultar o AniList agora. Tente novamente mais tarde ou use a outra fonte.' });
    }
  };
  router.get('/anime/by-mal/:id', handler(true));
  router.get('/anime/:id', handler(false));
  return router;
}
module.exports = { createAniListRouter, normalizeAnime, query };
