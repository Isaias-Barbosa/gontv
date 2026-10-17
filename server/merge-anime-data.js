const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const curatedPath = path.join(projectRoot, 'src', 'json', 'animes.json');
const jikanPath = path.join(projectRoot, 'data', 'animes.json');
const outputPath = path.join(projectRoot, 'data', 'catalog.json');

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function isMissing(value) {
  return value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0);
}

function fillMissing(target, key, value) {
  if (isMissing(target[key]) && !isMissing(value)) {
    target[key] = value;
  }
}

function airingStatus(status) {
  if (status === 'Currently Airing') return 'Em Lançamento';
  if (status === 'Finished Airing') return 'Finalizado';
  if (status === 'Not yet aired') return 'Em breve';
  return status || '';
}

function portugueseWeekday(day) {
  const weekdays = {
    Mondays: 'Segunda-Feira',
    Tuesdays: 'Terça-Feira',
    Wednesdays: 'Quarta-Feira',
    Thursdays: 'Quinta-Feira',
    Fridays: 'Sexta-Feira',
    Saturdays: 'Sábado',
    Sundays: 'Domingo',
  };
  return weekdays[day] || '';
}

function mapJikanFields(anime, record) {
  const data = record.data || {};
  const image = data.images && data.images.jpg;
  const title = data.title_english || data.title_japanese || data.title;
  const externalIds = { ...(anime.externalIds || {}) };

  if (data.mal_id) externalIds.malId = data.mal_id;
  if (data.url) externalIds.malUrl = data.url;
  anime.externalIds = externalIds;

  fillMissing(anime, 'title', data.title);
  fillMissing(anime, 'slug', record.slug || normalize(data.title));
  fillMissing(anime, 'subtitule', title);
  fillMissing(anime, 'subtitle', title);
  fillMissing(anime, 'Type', data.type);
  fillMissing(anime, 'coverImage', image && (image.large_image_url || image.image_url));
  fillMissing(anime, 'background', data.background);
  fillMissing(anime, 'year', data.year && String(data.year));
  fillMissing(anime, 'Status', airingStatus(data.status));
  fillMissing(anime, 'episodeDuration', data.duration);
  fillMissing(anime, 'genres', (data.genres || []).map((genre) => genre.name));
  fillMissing(anime, 'synopsis', data.synopsis);
  fillMissing(anime, 'date', portugueseWeekday(data.broadcast && data.broadcast.day));
  fillMissing(anime, 'studio', (data.studios || []).map((studio) => studio.name).join(', '));
  fillMissing(anime, 'episodes', []);
  fillMissing(anime, 'visibility', 'published');
}

function createDraft(record, id) {
  const anime = { id, episodes: [], visibility: 'draft' };
  mapJikanFields(anime, record);
  anime.date = anime.date || portugueseWeekday(record.data && record.data.broadcast && record.data.broadcast.day);
  anime.genres = anime.genres || [];
  anime.top = false;
  anime.status = '';
  anime.language = 'Legendado';
  anime.Fansub = '';
  anime.resoAnime = '';
  anime.director = '';
  anime.Premiered = '';
  return anime;
}

function mergeAnimeData(curated, jikanRecords) {
  const result = curated.map((anime) => ({ ...anime }));
  const bySlug = new Map();
  const byTitle = new Map();

  for (const anime of result) {
    const slugKey = normalize(anime.slug);
    const titleKey = normalize(anime.title);
    if (slugKey && !bySlug.has(slugKey)) bySlug.set(slugKey, anime);
    if (titleKey && !byTitle.has(titleKey)) byTitle.set(titleKey, anime);
    fillMissing(anime, 'visibility', 'published');
  }

  let nextId = result.reduce((max, anime) => Math.max(max, Number(anime.id) || 0), 0) + 1;
  let matchedCount = 0;

  for (const record of jikanRecords) {
    const data = record.data || {};
    const match = bySlug.get(normalize(record.slug)) || byTitle.get(normalize(data.title));

    if (match) {
      mapJikanFields(match, record);
      matchedCount += 1;
      continue;
    }

    const draft = createDraft(record, nextId);
    nextId += 1;
    const slugKey = normalize(draft.slug);
    if (slugKey && bySlug.has(slugKey)) {
      throw new Error(`Slug duplicado durante a importação: ${draft.slug}`);
    }
    result.push(draft);
    if (slugKey) bySlug.set(slugKey, draft);
  }

  const ids = new Set();
  const slugs = new Set();
  for (const anime of result) {
    if (!anime.title || !anime.slug) {
      throw new Error(`Anime sem título ou slug: ${JSON.stringify(anime)}`);
    }
    if (ids.has(String(anime.id))) {
      throw new Error(`ID duplicado no catálogo: ${anime.id}`);
    }
    if (slugs.has(anime.slug)) {
      throw new Error(`Slug duplicado no catálogo: ${anime.slug}`);
    }
    ids.add(String(anime.id));
    slugs.add(anime.slug);
  }

  return { animes: result, matchedCount };
}

function buildCatalog() {
  const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
  const imported = JSON.parse(fs.readFileSync(jikanPath, 'utf8')).animes;

  if (!Array.isArray(curated) || !Array.isArray(imported)) {
    throw new Error('Os arquivos de origem precisam conter listas de animes válidas.');
  }

  const { animes, matchedCount } = mergeAnimeData(curated, imported);
  fs.writeFileSync(outputPath, `${JSON.stringify({ animes }, null, 2)}\n`, 'utf8');
  return { curatedCount: curated.length, importedCount: imported.length, matchedCount, totalCount: animes.length };
}

if (require.main === module) {
  try {
    const summary = buildCatalog();
    console.log(`Catálogo criado em data/catalog.json: ${JSON.stringify(summary)}`);
  } catch (error) {
    console.error('Falha ao gerar o catálogo unificado:', error.message);
    process.exitCode = 1;
  }
}

module.exports = { buildCatalog, mergeAnimeData, normalize };
