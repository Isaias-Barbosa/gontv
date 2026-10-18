const axios = require('axios');
const express = require('express');
const jikanBaseUrl = 'https://api.jikan.moe/v4';
function createMalRouter(get = (url, options) => axios.get(url, options)) {
  const router = express.Router();
  router.get('/anime/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'Informe um ID numérico válido do MyAnimeList.' });
    let anime;
    try {
      // All fields used by the form are in the basic endpoint; /full is unnecessary.
      const response = await get(`${jikanBaseUrl}/anime/${id}`, { timeout: 15000 });
      anime = response.data?.data;
      if (!anime?.title || Number(anime.mal_id) !== id) return res.status(502).json({ error: 'A consulta retornou dados incompletos. Tente novamente mais tarde.' });
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) return res.status(404).json({ error: 'Este ID não foi encontrado pelo serviço de consulta do MyAnimeList. Confira o ID na página do anime ou tente novamente mais tarde.' });
      if (status === 429) { res.set('Retry-After', '60'); return res.status(429).json({ error: 'O serviço atingiu o limite de consultas. Aguarde um minuto e tente novamente.' }); }
      if (['ECONNABORTED', 'ETIMEDOUT'].includes(error.code)) return res.status(504).json({ error: 'A consulta ao MyAnimeList demorou para responder. Tente novamente.' });
      return res.status(502).json({ error: 'O serviço de consulta do MyAnimeList está indisponível. Tente novamente mais tarde.' });
    }
    let director = '';
    const warnings = [];
    try {
      const response = await get(`${jikanBaseUrl}/anime/${id}/staff`, { timeout: 5000 });
      const staff = response.data?.data;
      if (Array.isArray(staff)) director = staff.find(item => item.positions?.some(position => /^director$/i.test(position)))?.person?.name || '';
      if (!director) warnings.push('Dados carregados. O diretor não foi informado; você pode preenchê-lo manualmente.');
    } catch {
      // Staff is enrichment only. A missing staff page must never turn a valid anime into a 404.
      warnings.push('Dados carregados. Não foi possível consultar o diretor; você pode preenchê-lo manualmente.');
    }
    return res.json({ ...anime, director, warnings });
  });
  return router;
}
module.exports = { createMalRouter };
