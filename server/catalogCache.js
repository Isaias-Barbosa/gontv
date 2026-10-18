function createCatalogCache(load, { ttl = 30000, now = Date.now } = {}) {
  let cached, expires = 0, pending, version = 0;
  return {
    get() {
      if (cached && now() < expires) return Promise.resolve(cached);
      if (pending) return pending;
      const revision = version;
      const task = Promise.resolve().then(load).then(payload => {
        if (revision === version) { cached = payload; expires = now() + ttl; }
        return payload;
      }).finally(() => { if (pending === task) pending = null; });
      pending = task;
      return task;
    },
    clear() { version += 1; cached = null; expires = 0; pending = null; },
  };
}
module.exports = { createCatalogCache };
