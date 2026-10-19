const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { Readable } = require('node:stream');
const { createMediaRouter, validateDiscordUrl } = require('./media');
const valid = 'https://media.discordapp.com/attachments/123/456/episode.mkv?ex=abc&hm=example';
test('relay aceita somente anexos MKV HTTPS em hosts exatos do Discord', () => {
  assert.equal(validateDiscordUrl(valid), valid);
  for (const url of ['http://cdn.discordapp.com/attachments/1/2/a.mkv', 'https://cdn.discordapp.com.attacker.test/attachments/1/2/a.mkv', 'https://127.0.0.1/a.mkv', 'https://cdn.discordapp.com:444/attachments/1/2/a.mkv', 'https://user@cdn.discordapp.com/attachments/1/2/a.mkv', 'https://cdn.discordapp.com/attachments/1/2/a.html']) assert.throws(() => validateDiscordUrl(url));
});
test('relay transmite bytes e Range e recusa redirecionamentos e URLs arbitrárias', async () => {
  const requests = [];
  const app = express();
  app.use('/api/media', createMediaRouter(async (url, options) => {
    requests.push({ url, options });
    return { status: url.includes('redirect') ? 302 : 206, headers: { 'content-length': '4', 'content-range': 'bytes 0-3/100' }, data: Readable.from([Buffer.from('test')]) };
  }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port + '/api/media/discord?url=';
  try {
    const response = await fetch(base + encodeURIComponent(valid), { headers: { Range: 'bytes=0-3' } });
    assert.equal(response.status, 206); assert.equal(await response.text(), 'test');
    assert.equal(response.headers.get('content-range'), 'bytes 0-3/100');
    assert.equal(requests[0].options.headers.Range, 'bytes=0-3');
    assert.equal(requests[0].options.maxRedirects, 0);
    assert.equal((await fetch(base + encodeURIComponent('https://localhost/a.mkv'))).status, 400);
    assert.equal(requests.length, 1);
    assert.equal((await fetch(base + encodeURIComponent(valid), { headers: { Range: 'bytes=1-2,4-5' } })).status, 400);
    assert.equal((await fetch(base + encodeURIComponent(valid + '&redirect=true'))).status, 502);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
