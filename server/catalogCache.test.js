const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createCatalogCache } = require('./catalogCache');
test('cache deduplica consultas simultâneas, expira e invalida após gravação', async () => {
  let calls = 0, now = 0;
  const cache = createCatalogCache(async () => ({ version: ++calls }), { ttl: 30, now: () => now });
  const [first, second] = await Promise.all([cache.get(), cache.get()]);
  assert.equal(first, second); assert.equal(calls, 1);
  assert.equal((await cache.get()).version, 1);
  now = 31;
  assert.equal((await cache.get()).version, 2);
  cache.clear();
  assert.equal((await cache.get()).version, 3);
});
test('invalidação impede que leitura antiga repovoe o cache', async () => {
  const resolvers = [];
  const cache = createCatalogCache(() => new Promise(resolve => resolvers.push(resolve)));
  const old = cache.get(); await Promise.resolve();
  cache.clear();
  const fresh = cache.get(); await Promise.resolve();
  resolvers[1]({ version: 2 }); await fresh;
  resolvers[0]({ version: 1 }); await old;
  assert.equal((await cache.get()).version, 2);
});
test('falha não é armazenada e a próxima consulta pode recuperar', async () => {
  let fail = true;
  const cache = createCatalogCache(async () => { if (fail) throw Error('offline'); return { ok: true }; });
  await assert.rejects(cache.get(), /offline/);
  fail = false;
  assert.equal((await cache.get()).ok, true);
});
