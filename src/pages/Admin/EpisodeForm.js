import { episodeDates } from 'lib/homeFeed';
import React, { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
import { createSubtitleWorker } from 'lib/createSubtitleWorker';
import { subtitleSourceUrl } from 'lib/videoSources';
import { parseSrtOrVtt } from 'lib/subtitleParsers';
import { FiZap, FiUpload, FiTrash2, FiCheckCircle, FiFileText } from 'react-icons/fi';

const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const emptyEpisode = {
  titleEpisodio: '', titleSlug: '', thumbnail: '', duration: '', languageEpisode: 'legendado',
  lancamento: false, videoUrl: [{ resolution: 'FHD', url: '' }, { resolution: 'HD', url: '' }, { resolution: 'SD', url: '' }],
  subtitles: [],
};

export default function EpisodeForm() {
  const { animeId, episodeId } = useParams();
  const navigate = useNavigate();
  const { animes, save } = useAnimeCatalog();
  const anime = animes.find((item) => String(item.id) === animeId);
  const current = anime?.episodes.find((item) => String(item.id) === episodeId);
  const [form, setForm] = useState(() => current ? { ...emptyEpisode, ...current, videoUrl: current.videoUrl || emptyEpisode.videoUrl, subtitles: current.subtitles || [] } : emptyEpisode);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Subtitle extraction state
  const [extracting, setExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState('');
  const [extractError, setExtractError] = useState('');
  const [extractProgress, setExtractProgress] = useState({ read: 0, total: 0 });
  const workerRef = useRef(null);
  const fileInputRef = useRef(null);

  if (!anime) return <p className="text-red-300">Anime não encontrado.</p>;
  if (episodeId && !current) return <p className="text-red-300">Episódio não encontrado.</p>;

  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const updateVideo = (index, key, value) => setForm((previous) => ({
    ...previous,
    videoUrl: previous.videoUrl.map((video, videoIndex) => videoIndex === index ? { ...video, [key]: value } : video),
  }));

  const handleExtractFromMkv = () => {
    const mkvUrl = form.videoUrl.find(v => /\.mkv(\?.*)?$/i.test(v.url.trim()))?.url?.trim();
    if (!mkvUrl) {
      setExtractError('Informe uma URL de arquivo .mkv em uma das resoluções acima para extrair.');
      return;
    }

    setExtracting(true);
    setExtractError('');
    setExtractStatus('Conectando ao MKV para escanear legendas...');
    setExtractProgress({ read: 0, total: 0 });

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    let worker;
    try {
      worker = createSubtitleWorker();
      workerRef.current = worker;
    } catch {
      setExtractError('Não foi possível iniciar o leitor de legendas no navegador.');
      setExtracting(false);
      return;
    }

    const collectedCues = [];
    let detectedTrack = null;

    worker.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'track') {
        detectedTrack = data.track;
        setExtractStatus(`Faixa identificada: ${data.track.name || data.track.language}`);
      }
      if (data.type === 'cues') {
        for (const item of data.cues) {
          collectedCues.push({ start: item.start, end: item.end, text: item.text });
        }
        setExtractStatus(`Extraindo falas... ${collectedCues.length} falas encontradas.`);
      }
      if (data.type === 'progress') {
        setExtractProgress({ read: data.read, total: data.total });
      }
      if (data.type === 'done') {
        setExtracting(false);
        worker.terminate();
        workerRef.current = null;
        if (collectedCues.length === 0) {
          setExtractError('Nenhuma legenda em português brasileiro foi encontrada no arquivo MKV.');
        } else {
          const newSubtitle = {
            language: detectedTrack?.language || 'pt-BR',
            label: detectedTrack?.name || 'Português (Brasil)',
            cueCount: collectedCues.length,
            cues: collectedCues,
          };
          setForm(prev => ({
            ...prev,
            subtitles: [newSubtitle]
          }));
          setExtractStatus(`Sucesso! ${collectedCues.length} falas extraídas. Salve o episódio para gravar no Neon.`);
        }
      }
      if (data.type === 'error' || data.type === 'stopped') {
        setExtracting(false);
        worker.terminate();
        workerRef.current = null;
        setExtractError(data.message || 'Erro ao ler legendas do MKV. Verifique se o link ainda é válido.');
      }
    };

    worker.onerror = () => {
      setExtracting(false);
      worker.terminate();
      workerRef.current = null;
      setExtractError('Falha ao processar o arquivo MKV.');
    };

    worker.postMessage({ type: 'start', url: subtitleSourceUrl(mkvUrl) });
  };

  const handleImportFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const cues = parseSrtOrVtt(text);
        if (cues.length === 0) {
          setExtractError('Não foi possível identificar falas ou tempos válidos no arquivo.');
          return;
        }
        const newSubtitle = {
          language: 'pt-BR',
          label: 'Português (Brasil)',
          cueCount: cues.length,
          cues,
        };
        setForm(prev => ({
          ...prev,
          subtitles: [newSubtitle]
        }));
        setExtractError('');
        setExtractStatus(`Arquivo ${file.name} importado: ${cues.length} falas prontas para salvar no Neon.`);
      } catch {
        setExtractError('Erro ao ler arquivo de legenda local.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleRemoveSubtitles = () => {
    setForm(prev => ({ ...prev, subtitles: [] }));
    setExtractStatus('Legenda removida.');
    setExtractError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
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
      ...episodeDates(form, current),
      videoUrl: form.videoUrl.filter((video) => video.url.trim()).map((video) => ({ ...video, url: video.url.trim() })),
      subtitles: form.subtitles || [],
    };
    const episodes = current
      ? anime.episodes.map((item) => item.id === current.id ? episode : item)
      : [...anime.episodes, episode];
    try {
      await save(animes.map((item) => item.id === anime.id ? { ...item, episodes } : item));
      navigate(`/admin/animes/${anime.id}/episodes`, { state: { success: current ? 'Episódio atualizado com sucesso.' : 'Episódio cadastrado com sucesso.' } });
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
        <p className="mt-1 text-slate-400">Cadastre URLs de vídeo e grave legendas no banco Neon para carregamento instantâneo.</p>
      </div>
      {error && <p role="alert" className="mb-4 rounded bg-red-950 p-3 text-red-200">{error}</p>}
      {saving && <p role="status" className="mb-4 rounded bg-sky-950 p-3 text-sky-200">Salvando episódio… Aguarde a confirmação.</p>}
      <form aria-label="Episódio" onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2">
        <label><span className="mb-1 block text-sm text-slate-300">Título</span><input required value={form.titleEpisodio} onChange={(event) => setForm((previous) => ({ ...previous, titleEpisodio: event.target.value, titleSlug: current && previous.titleSlug !== slugify(current.titleEpisodio) ? previous.titleSlug : slugify(event.target.value) }))} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
        <label><span className="mb-1 block text-sm text-slate-300">Slug</span><input required value={form.titleSlug} onChange={(event) => update('titleSlug', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
        <label><span className="mb-1 block text-sm text-slate-300">URL da miniatura</span><input value={form.thumbnail || ''} onChange={(event) => update('thumbnail', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
        <label><span className="mb-1 block text-sm text-slate-300">Duração</span><input value={form.duration || ''} onChange={(event) => update('duration', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
        <label><span className="mb-1 block text-sm text-slate-300">Idioma</span><select value={form.languageEpisode || 'legendado'} onChange={(event) => update('languageEpisode', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"><option value="legendado">Legendado</option><option value="dublado">Dublado</option></select></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.lancamento)} onChange={(event) => update('lancamento', event.target.checked)} />Marcar como lançamento</label>
        <p className="text-sm text-slate-400 sm:col-span-2">Ao marcar e salvar um episódio antigo, ele volta ao início dos lançamentos. Editar sem alterar essa opção mantém a ordem atual.</p>

        {/* Video URLs */}
        <div className="space-y-3 sm:col-span-2">
          <h2 className="font-semibold">URLs de vídeo por resolução</h2>
          <p className="text-sm text-slate-400">MP4, WebM ou MKV: use o link direto do arquivo.</p>
          {form.videoUrl.map((video, index) => (
            <label key={video.resolution} className="grid gap-2 sm:grid-cols-[90px_1fr] sm:items-center">
              <span className="text-sm text-slate-300">{video.resolution}</span>
              <input type="url" value={video.url} onChange={(event) => updateVideo(index, 'url', event.target.value)} placeholder="https://..." className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
            </label>
          ))}
        </div>

        {/* Subtitles Storage in Neon */}
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-4 sm:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-emerald-400">
                <FiFileText /> Legendas Salvas no Neon
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                As falas salvas no banco são carregadas em milissegundos sem reescanear o arquivo MKV na reprodução.
              </p>
            </div>
          </div>

          {/* Current saved status */}
          <div className="mt-3">
            {form.subtitles && form.subtitles.length > 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-emerald-600/40 bg-emerald-950/30 p-3 text-sm text-emerald-300">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="shrink-0 text-lg text-emerald-400" />
                  <span>
                    <strong>{form.subtitles[0].label || 'Português (Brasil)'}</strong>: {form.subtitles[0].cues?.length || form.subtitles[0].cueCount || 0} falas salvas.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveSubtitles}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                >
                  <FiTrash2 /> Remover
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Nenhuma legenda salva no banco para este episódio ainda. Extraia do link MKV ou envie um arquivo .srt/.vtt abaixo:
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={extracting}
              onClick={handleExtractFromMkv}
              className="flex items-center gap-2 rounded bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
            >
              <FiZap />
              {extracting ? 'Extraindo do MKV...' : 'Extrair Legenda do Link MKV'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".srt,.vtt,text/vtt"
              className="hidden"
              onChange={handleImportFile}
            />
            <button
              type="button"
              disabled={extracting}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              <FiUpload />
              Importar arquivo .srt / .vtt local
            </button>

            {extracting && (
              <button
                type="button"
                onClick={() => {
                  workerRef.current?.terminate();
                  workerRef.current = null;
                  setExtracting(false);
                  setExtractStatus('Extração cancelada.');
                }}
                className="rounded border border-red-700 px-3 py-2 text-xs text-red-300 hover:bg-red-950"
              >
                Cancelar
              </button>
            )}
          </div>

          {/* Extraction status & progress */}
          {extractStatus && (
            <p className="mt-3 text-xs text-sky-300">{extractStatus}</p>
          )}
          {extractProgress.total > 0 && extracting && (
            <div className="mt-2">
              <progress
                className="w-full h-2 rounded overflow-hidden"
                value={extractProgress.read}
                max={extractProgress.total}
              />
              <span className="text-[10px] text-slate-400">
                {(extractProgress.read / 1048576).toFixed(1)} MB / {(extractProgress.total / 1048576).toFixed(1)} MB lidos
              </span>
            </div>
          )}
          {extractError && (
            <p className="mt-2 text-xs text-red-300">{extractError}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <button disabled={saving} className="rounded bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar episódio'}
          </button>
        </div>
      </form>
    </section>
  );
}
