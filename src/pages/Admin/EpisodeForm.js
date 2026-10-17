import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';

const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const emptyEpisode = {
  titleEpisodio: '', titleSlug: '', thumbnail: '', duration: '', languageEpisode: 'legendado',
  lancamento: false, videoUrl: [{ resolution: 'FHD', url: '' }, { resolution: 'HD', url: '' }, { resolution: 'SD', url: '' }],
};

export default function EpisodeForm() {
  const { animeId, episodeId } = useParams();
  const navigate = useNavigate();
  const { animes, save } = useAnimeCatalog();
  const anime = animes.find((item) => String(item.id) === animeId);
  const current = anime?.episodes.find((item) => String(item.id) === episodeId);
  const [form, setForm] = useState(() => current ? { ...emptyEpisode, ...current, videoUrl: current.videoUrl || emptyEpisode.videoUrl } : emptyEpisode);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!anime) return <p className="text-red-300">Anime não encontrado.</p>;
  if (episodeId && !current) return <p className="text-red-300">Episódio não encontrado.</p>;

  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const updateVideo = (index, key, value) => setForm((previous) => ({
    ...previous,
    videoUrl: previous.videoUrl.map((video, videoIndex) => videoIndex === index ? { ...video, [key]: value } : video),
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const titleSlug = form.titleSlug.trim();
    if (anime.episodes.some((episode) => episode.titleSlug === titleSlug && String(episode.id) !== episodeId)) {
      setError('Já existe um episódio com esse slug neste anime.');
      setSaving(false);
      return;
    }
    const episode = {
      ...form,
      id: current ? current.id : Math.max(0, ...anime.episodes.map((item) => Number(item.id) || 0)) + 1,
      titleSlug,
      dataCreateEpisode: current?.dataCreateEpisode || new Date().toISOString(),
      videoUrl: form.videoUrl.filter((video) => video.url.trim()).map((video) => ({ ...video, url: video.url.trim() })),
    };
    const episodes = current
      ? anime.episodes.map((item) => item.id === current.id ? episode : item)
      : [...anime.episodes, episode];
    try {
      await save(animes.map((item) => item.id === anime.id ? { ...item, episodes } : item));
      navigate(`/admin/animes/${anime.id}/episodes`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-3xl">
      <div className="mb-6">
        <Link to={`/admin/animes/${anime.id}/episodes`} className="text-sm text-emerald-300 hover:underline">← Episódios de {anime.title}</Link>
        <h1 className="mt-3 text-3xl font-bold">{current ? 'Editar episódio' : 'Cadastrar episódio'}</h1>
        <p className="mt-1 text-slate-400">Cadastre URLs de vídeo para estudo; não há upload de arquivos.</p>
      </div>
      {error && <p role="alert" className="mb-4 rounded bg-red-950 p-3 text-red-200">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2">
        <label><span className="mb-1 block text-sm text-slate-300">Título</span><input required value={form.titleEpisodio} onChange={(event) => setForm((previous) => ({ ...previous, titleEpisodio: event.target.value, titleSlug: current && previous.titleSlug !== slugify(current.titleEpisodio) ? previous.titleSlug : slugify(event.target.value) }))} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
        <label><span className="mb-1 block text-sm text-slate-300">Slug</span><input required value={form.titleSlug} onChange={(event) => update('titleSlug', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
        <label><span className="mb-1 block text-sm text-slate-300">URL da miniatura</span><input value={form.thumbnail || ''} onChange={(event) => update('thumbnail', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
        <label><span className="mb-1 block text-sm text-slate-300">Duração</span><input value={form.duration || ''} onChange={(event) => update('duration', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
        <label><span className="mb-1 block text-sm text-slate-300">Idioma</span><select value={form.languageEpisode || 'legendado'} onChange={(event) => update('languageEpisode', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="legendado">Legendado</option><option value="dublado">Dublado</option></select></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.lancamento)} onChange={(event) => update('lancamento', event.target.checked)} />Marcar como lançamento</label>
        <div className="space-y-3 sm:col-span-2">
          <h2 className="font-semibold">URLs de vídeo por resolução</h2>
          {form.videoUrl.map((video, index) => (
            <label key={video.resolution} className="grid gap-2 sm:grid-cols-[90px_1fr] sm:items-center">
              <span className="text-sm text-slate-300">{video.resolution}</span>
              <input type="url" value={video.url} onChange={(event) => updateVideo(index, 'url', event.target.value)} placeholder="https://..." className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
            </label>
          ))}
        </div>
        <div className="sm:col-span-2"><button disabled={saving} className="rounded bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 disabled:opacity-50">{saving ? 'Salvando...' : 'Salvar episódio'}</button></div>
      </form>
    </section>
  );
}
