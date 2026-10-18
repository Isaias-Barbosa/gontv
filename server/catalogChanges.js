const { isDeepStrictEqual } = require('node:util');
const failure = (status, message) => Object.assign(new Error(message), { status });
const plain = value => JSON.parse(JSON.stringify(value));
const validId = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;

function validateChanges(changes) {
  if (!Array.isArray(changes) || changes.length !== 1) throw failure(400, 'Envie uma alteração de anime por operação.');
  for (const change of changes) {
    if (!change || typeof change !== 'object') throw failure(400, 'Alteração inválida.');
    const { before, after } = change;
    if ((!before && !after) || (before && !validId(before.id)) || (after && !validId(after.id)) || (before && after && String(before.id) !== String(after.id))) throw failure(400, 'ID de anime inválido.');
    if (!after) continue;
    if (typeof after.title !== 'string' || !after.title.trim() || typeof after.slug !== 'string' || !after.slug.trim() || !Array.isArray(after.episodes)) throw failure(400, 'Informe título, slug e episódios válidos.');
    const ids = new Set(), slugs = new Set();
    for (const episode of after.episodes) {
      if (!episode || !validId(episode.id) || !episode.titleSlug || ids.has(String(episode.id)) || slugs.has(episode.titleSlug)) throw failure(400, 'Os episódios precisam de IDs e slugs únicos.');
      ids.add(String(episode.id)); slugs.add(episode.titleSlug);
    }
  }
}

async function applyCatalogChanges(pool, changes) {
  validateChanges(changes);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serialize short catalog writes, including concurrent attempts to create the same ID.
    await client.query('SELECT pg_advisory_xact_lock(19741018)');
    for (const { before, after } of changes) {
      const id = (before || after).id;
      const result = await client.query(`
        SELECT a.data, a.created_at, a.updated_at,
          COALESCE(json_agg(e.data ORDER BY e.episode_number NULLS LAST, e.id) FILTER (WHERE e.id IS NOT NULL), '[]') AS episodes
        FROM animes a LEFT JOIN episodes e ON e.anime_id = a.id WHERE a.id = $1 GROUP BY a.id
      `, [id]);
      const row = result.rows[0];
      const current = row ? plain({ ...row.data, episodes: row.episodes, createdAt: row.created_at, updatedAt: row.updated_at }) : null;
      if (!isDeepStrictEqual(current, before)) throw failure(409, 'Este anime foi alterado em outra sessão. Atualize a página antes de tentar novamente.');
      if (!after) {
        await client.query('DELETE FROM animes WHERE id = $1', [id]);
        continue;
      }
      const { episodes, createdAt, updatedAt, ...data } = after;
      await client.query(`
        INSERT INTO animes (id, slug, title, visibility, data, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5::jsonb, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, title = EXCLUDED.title,
          visibility = EXCLUDED.visibility, data = EXCLUDED.data, updated_at = NOW()
      `, [id, data.slug, data.title, data.visibility || 'draft', JSON.stringify(data)]);
      if (!before || !isDeepStrictEqual(before.episodes, episodes)) {
        // Synchronize only changed episode rows, in one round trip, retaining unchanged rows.
        await client.query(`
          WITH incoming AS (SELECT value AS data FROM jsonb_array_elements($2::jsonb)),
          removed AS (
            DELETE FROM episodes e WHERE e.anime_id = $1 AND NOT EXISTS (
              SELECT 1 FROM incoming i WHERE i.data->>'id' = e.data->>'id'
            )
          ), updated AS (
            UPDATE episodes e SET data = i.data,
              episode_number = COALESCE(i.data->>'number', i.data->>'episode')::numeric,
              title = i.data->>'title'
            FROM incoming i WHERE e.anime_id = $1 AND e.data->>'id' = i.data->>'id'
              AND e.data IS DISTINCT FROM i.data
          )
          INSERT INTO episodes (anime_id, episode_number, title, data)
          SELECT $1, COALESCE(i.data->>'number', i.data->>'episode')::numeric, i.data->>'title', i.data
          FROM incoming i WHERE NOT EXISTS (
            SELECT 1 FROM episodes e WHERE e.anime_id = $1 AND e.data->>'id' = i.data->>'id'
          )
        `, [id, JSON.stringify(episodes)]);
      }
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
module.exports = { applyCatalogChanges, validateChanges };
