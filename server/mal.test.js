const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { createMalRouter } = require('./mal');
const anime = { mal_id: 60636, title: 'Anime de teste', synopsis: 'Sinopse', genres: [{ name: 'Action' }] };
const failure = (status, code) => Object.assign(new Error('upstream failure'), { response: { status }, code });
async function requestWith(get, id, check) {
  const app = express(); app.use('/api/mal', createMalRouter(get));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try { const response = await fetch(`http://127.0.0.1:${server.address().port}/api/mal/anime/${id}`); await check(response, await response.json()); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
test('importa anime pelo endpoint básico e encontra diretor sem confundir Sound Director', async () => {
  const calls = [];
  await requestWith(async (url, options) => {
    calls.push({ url, options });
    return { data: { data: url.endsWith('/staff') ? [{ positions: ['Sound Director'], person: { name: 'Som' } }, { positions: ['Director'], person: { name: 'Diretor' } }] : anime } };
  }, '60636', async (response, body) => {
    assert.equal(response.status, 200); assert.equal(body.title, anime.title); assert.equal(body.director, 'Diretor');
    assert.deepEqual(body.warnings, []); assert.equal(calls[0].url, 'https://api.jikan.moe/v4/anime/60636'); assert.equal(calls[1].options.timeout, 5000);
  });
});
for (const status of [404, 429, 503]) test(`falha ${status} da equipe não vira erro do anime`, async () => {
  await requestWith(async url => { if (url.endsWith('/staff')) throw failure(status); return { data: { data: anime } }; }, '60636', async (response, body) => {
    assert.equal(response.status, 200); assert.equal(body.mal_id, 60636); assert.equal(body.director, ''); assert.ok(body.warnings.length);
  });
});
for (const [upstream, code, expected] of [[404, null, 404], [429, null, 429], [503, null, 502], [null, 'ECONNABORTED', 504]]) test(`erro principal ${upstream || code} retorna ${expected}`, async () => {
  let calls = 0;
  await requestWith(async () => { calls++; throw failure(upstream, code); }, '60636', async (response, body) => {
    assert.equal(response.status, expected); assert.equal(calls, 1); assert.ok(body.error);
    if (expected === 429) assert.equal(response.headers.get('retry-after'), '60');
  });
});
test('ID inválido não consulta Jikan e resposta de outro ID não preenche o formulário', async () => {
  await requestWith(async () => { throw new Error('must not call'); }, 'abc', async response => assert.equal(response.status, 400));
  await requestWith(async () => ({ data: { data: { ...anime, mal_id: 1 } } }), '60636', async response => assert.equal(response.status, 502));
});
