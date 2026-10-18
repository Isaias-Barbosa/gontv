const express = require('express');
const axios = require('axios');
function validateDiscordUrl(value) {
  if (typeof value !== 'string' || value.length > 4096) throw new Error('Link de mídia inválido.');
  const url = new URL(value);
  if (url.protocol !== 'https:' || !['cdn.discordapp.com', 'media.discordapp.net'].includes(url.hostname) || url.port || url.username || url.password || !/^\/attachments\/\d+\/\d+\/[^/]+\.(mkv|webm)$/i.test(url.pathname)) throw new Error('Use um link HTTPS direto de MKV dos anexos do Discord.');
  url.hash = '';
  return url.href;
}
function createMediaRouter(open = (url, options) => axios.get(url, options)) {
  const router = express.Router();
  router.get('/discord', async (req, res) => {
    let url;
    try { url = validateDiscordUrl(req.query.url); }
    catch { return res.status(400).json({ error: 'Use um link HTTPS direto de MKV dos anexos do Discord.' }); }
    const range = req.get('Range');
    if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range)) return res.status(400).json({ error: 'Intervalo de leitura inválido.' });
    const controller = new AbortController();
    res.once('close', () => controller.abort());
    try {
      const upstream = await open(url, {
        responseType: 'stream', signal: controller.signal, timeout: 20000,
        maxRedirects: 0, validateStatus: () => true,
        headers: { ...(range ? { Range: range } : {}), 'Accept-Encoding': 'identity' },
      });
      if (![200, 206].includes(upstream.status)) {
        upstream.data.destroy();
        if (upstream.status === 416) return res.status(416).end();
        return res.status(502).json({ error: 'O Discord não disponibilizou o arquivo. Confira se o link ainda é válido.' });
      }
      if (res.destroyed) { upstream.data.destroy(); return; }
      res.status(upstream.status);
      res.set({ 'Content-Type': 'video/x-matroska', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' });
      for (const header of ['content-length', 'content-range']) if (upstream.headers[header]) res.set(header, upstream.headers[header]);
      upstream.data.on('error', () => { if (!res.destroyed) res.destroy(); });
      upstream.data.pipe(res);
    } catch (error) {
      if (controller.signal.aborted || res.destroyed) return;
      res.status(502).json({ error: 'Não foi possível ler o arquivo do Discord. Tente novamente ou atualize o link.' });
    }
  });
  return router;
}
module.exports = { createMediaRouter, validateDiscordUrl };
