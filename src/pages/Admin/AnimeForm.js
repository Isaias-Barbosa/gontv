import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
import { apiRequest } from 'lib/api';

const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const emptyAnime = {
  title: '', slug: '', subtitle: '', subtitule: '', Type: 'TV', date: '', coverImage: '', background: '',
  studio: '', director: '', year: '', Status: 'Em Lançamento', status: '', episodeDuration: '',
  genres: [], Premiered: '', Fansub: '', language: 'Legendado', resoAnime: '', top: false,
  synopsis: '', episodes: [], visibility: 'draft',
};

const fields = [
  ['title', 'Título'], ['slug', 'Slug'], ['subtitle', 'Título alternativo'], ['Type', 'Tipo'],
  ['coverImage', 'URL da capa'], ['background', 'URL do fundo'], ['year', 'Ano'], ['studio', 'Estúdio'],
  ['director', 'Diretor'], ['episodeDuration', 'Duração do episódio'], ['date', 'Dia de lançamento'],
  ['Premiered', 'Temporada'], ['Fansub', 'Fansub'], ['resoAnime', 'Resolução'], ['synopsis', 'Sinopse'],
];

export default function AnimeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { animes, save } = useAnimeCatalog();
  const current = animes.find((anime) => String(anime.id) === id);
  const [form, setForm] = useState(() => current ? {
    ...emptyAnime,
    ...current,
    genres: current.genres || [],
  } : emptyAnime);
  const [genresInput, setGenresInput] = useState((current?.genres || []).join(', '));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [malId, setMalId] = useState('');
  const [anilistId, setAnilistId] = useState('');
  const [importSource, setImportSource] = useState('mal');
  const [malLoading, setMalLoading] = useState(false);
  const [malError, setMalError] = useState('');
  const [malNotice, setMalNotice] = useState('');

  if (id && !current) {
    return <p className="text-red-300">Anime não encontrado.</p>;
  }

  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const handleTitleChange = (value) => {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug: current && previous.slug !== slugify(current.title) ? previous.slug : slugify(value),
    }));
  };
  const importAnime = async (source = 'mal') => {
    const providerName = source === 'mal' ? 'MyAnimeList' : 'AniList';
    const lookupId = (source === 'anilist' ? anilistId : malId).trim();
    setMalError(''); setMalNotice('');
    if (!/^\d+$/.test(lookupId)) {
      setMalError(`Informe um ID numérico válido do ${source === 'anilist' ? 'AniList' : 'MyAnimeList'}.`);
      return;
    }
    setImportSource(source);
    setMalLoading(true);
    try {
      const path = source === 'mal' ? `/api/mal/anime/${lookupId}` : source === 'anilist-mal' ? `/api/anilist/anime/by-mal/${lookupId}` : `/api/anilist/anime/${lookupId}`;
      const data = await apiRequest(path);
      const airedFrom = data.aired?.from ? new Date(data.aired.from) : null;
      const releaseDay = airedFrom && !Number.isNaN(airedFrom.getTime())
        ? airedFrom.toLocaleDateString('pt-BR', { weekday: 'long', timeZone: 'UTC' })
        : '';
      const genres = [...(data.genres || []), ...(data.themes || [])].map((item) => item.name);
      setForm((previous) => ({
        ...previous,
        title: data.title || previous.title,
        malId: data.mal_id || previous.malId,
        anilistId: data.anilist_id || previous.anilistId,
        slug: slugify(data.title || previous.title),
        subtitle: data.title_english || data.title_japanese || previous.subtitle,
        subtitule: data.title_english || data.title_japanese || previous.subtitule,
        Type: data.type === 'Movie' ? 'Filme' : data.type === 'OVA' ? 'OVA' : data.type === 'Special' ? 'Especial' : 'TV',
        date: releaseDay || previous.date,
        coverImage: data.images?.jpg?.large_image_url || data.images?.jpg?.image_url || previous.coverImage,
        background: data.bannerImage || data.images?.jpg?.large_image_url || previous.background,
        studio: data.studios?.[0]?.name || previous.studio,
        director: data.director || previous.director,
        year: data.year ? String(data.year) : airedFrom ? String(airedFrom.getFullYear()) : previous.year,
        Status: ({ 'Currently Airing': 'Em Lançamento', 'Not yet aired': 'Em breve', 'Finished Airing': 'Finalizado', 'On Hiatus': 'Em pausa', Cancelled: 'Cancelado' })[data.status] || previous.Status,
        status: data.status || previous.status,
        episodeDuration: data.duration || previous.episodeDuration,
        genres: genres.length ? genres : previous.genres,
        Premiered: data.premiered || previous.Premiered,
        synopsis: data.synopsis || previous.synopsis,
      }));
      if (genres.length) setGenresInput(genres.join(', '));
      setMalNotice(`${providerName}: ${data.warnings?.join(' ') || 'Dados carregados. Revise os campos antes de salvar.'}`);
    } catch (fetchError) {
      setMalError(fetchError.message);
    } finally {
      setMalLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    const slug = form.slug.trim();
    const duplicate = animes.some((anime) => anime.slug === slug && String(anime.id) !== id);
    if (duplicate) {
      setError('Já existe um anime com esse slug.');
      setSaving(false);
      return;
    }

    const anime = {
      ...form,
      id: current ? current.id : Math.max(0, ...animes.map((item) => Number(item.id) || 0)) + 1,
      slug,
      subtitule: form.subtitle,
      genres: genresInput.split(',').map((genre) => genre.trim()).filter(Boolean),
      episodes: current ? current.episodes : [],
      visibility: form.visibility || 'draft',
    };
    const nextAnimes = current
      ? animes.map((item) => item.id === current.id ? anime : item)
      : [...animes, anime];

    try {
      await save(nextAnimes);
      navigate('/admin/animes');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-4xl">
      <div className="mb-6">
        <Link to="/admin/animes" className="text-sm text-emerald-300 hover:underline">← Voltar aos animes</Link>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <h1 className="text-3xl font-bold">{current ? 'Editar anime' : 'Cadastrar anime'}</h1>
      {!current && <div className="flex w-full flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <input value={malId} disabled={malLoading} onChange={event => setMalId(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); importAnime('mal'); } }} inputMode="numeric" placeholder="ID do MyAnimeList" aria-label="ID do MyAnimeList" className="w-44 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
          <button type="button" onClick={() => importAnime('mal')} disabled={malLoading} className="rounded bg-sky-600 px-3 py-2 text-sm font-semibold hover:bg-sky-500 disabled:opacity-50">{malLoading && importSource === 'mal' ? 'Buscando...' : 'Buscar MAL'}</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <input value={anilistId} disabled={malLoading} onChange={event => setAnilistId(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); importAnime('anilist'); } }} inputMode="numeric" placeholder="ID do AniList" aria-label="ID do AniList" className="w-44 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
          <button type="button" onClick={() => importAnime('anilist')} disabled={malLoading} className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50">{malLoading && importSource === 'anilist' ? 'Buscando...' : 'Buscar AniList'}</button>
        </div>
        <p className="text-xs text-slate-400">Os IDs são diferentes. No AniList, copie o número da URL da página do anime.</p>
      </div>}
    </div>
    {malError && <p role="alert" className="mt-2 text-sm text-red-300">{malError}</p>}
    {malError && importSource === 'mal' && /^\d+$/.test(malId.trim()) && <button type="button" disabled={malLoading} onClick={() => importAnime('anilist-mal')} className="mt-2 rounded border border-indigo-500 px-3 py-2 text-sm text-indigo-200 disabled:opacity-50">Tentar este ID MAL no AniList</button>}
    {malNotice && <p role="status" className="mt-2 text-sm text-emerald-300">{malNotice}</p>}
      </div>
      {error && <p role="alert" className="mb-4 rounded bg-red-950 p-3 text-red-200">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <label key={key} className={key === 'synopsis' ? 'sm:col-span-2' : ''}>
            <span className="mb-1 block text-sm text-slate-300">{label}</span>
            {key === 'synopsis' ? (
              <textarea required rows="5" value={form[key] || ''} onChange={(event) => update(key, event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
            ) : key === 'Type' ? (
              <select value={form[key] || 'TV'} onChange={(event) => update(key, event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
                <option>TV</option><option>Filme</option><option>OVA</option><option>Especial</option>
              </select>
            ) : (
              <input required={key === 'title' || key === 'slug'} value={form[key] || ''} onChange={(event) => key === 'title' ? handleTitleChange(event.target.value) : update(key, event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
            )}
          </label>
        ))}
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm text-slate-300">Gêneros (separados por vírgula)</span>
          <input value={genresInput} onChange={(event) => setGenresInput(event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label>
          <span className="mb-1 block text-sm text-slate-300">Idioma</span>
          <select value={form.language || 'Legendado'} onChange={(event) => update('language', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option>Legendado</option><option>Dublado</option>
          </select>
        </label>
        <label>
          <span className="mb-1 block text-sm text-slate-300">Publicação</span>
          <select value={form.visibility || 'draft'} onChange={(event) => update('visibility', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="draft">Rascunho</option><option value="published">Publicado</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(form.top)} onChange={(event) => update('top', event.target.checked)} />
          Destacar no banner
        </label>
        <p className="text-sm text-slate-400 sm:col-span-2">O destaque aparece na home quando o anime estiver publicado. Usamos a imagem de fundo ou, se não houver, a capa.</p>
        <div className="sm:col-span-2">
          <button disabled={saving || malLoading} className="rounded bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar anime'}
          </button>
        </div>
      </form>
    </section>
  );
}
