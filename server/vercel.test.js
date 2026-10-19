const test = require('node:test');
const assert = require('node:assert/strict');

// Never load real database credentials or connect to external services here.
process.env.DATABASE_URL = '';
process.env.VERCEL = '1';
process.env.FRONTEND_URL = 'https://gontv.vercel.app';
const app = require('../api/index');

test('Vercel entry serves health, rejects media relaying and requires persistent storage', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: 'ok' });
    const media = await fetch(`${base}/api/media/discord?url=https://cdn.discordapp.com/attachments/1/2/a.mkv`, { headers: { Range: 'bytes=0-99' } });
    assert.equal(media.status, 410);
    assert.match(media.headers.get('content-type'), /json/);
    const catalog = await fetch(`${base}/api/animes/public`);
    assert.equal(catalog.status, 503);
    assert.match((await catalog.json()).error, /DATABASE_URL/);
    const write = await fetch(`${base}/api/animes`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Origin: process.env.FRONTEND_URL }, body: JSON.stringify({ animes: [] }) });
    assert.equal(write.status, 503);
    assert.equal(write.headers.get('access-control-allow-origin'), process.env.FRONTEND_URL);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
