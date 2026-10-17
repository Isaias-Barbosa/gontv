import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';

export default function EpisodeManager() {
  const { animeId } = useParams();
  const { animes, save } = useAnimeCatalog();
  const [error, setError] = useState('');
  const anime = animes.find((item) => String(item.id) === animeId);
  if (!anime) return <p className="text-red-300">Anime não encontrado.</p>;

  const deleteEpisode = async (episode) => {
    if (!window.confirm(`Excluir "${episode.titleEpisodio}"?`)) return;
    setError('');
    try {
      await save(animes.map((item) => item.id === anime.id
        ? { ...item, episodes: item.episodes.filter((current) => current.id !== episode.id) }
        : item
      ));
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin/animes" className="text-sm text-emerald-300 hover:underline">← Catálogo</Link>
          <h1 className="mt-3 text-3xl font-bold">Episódios: {anime.title}</h1>
        </div>
        {error && <p role="alert" className="mb-4 rounded bg-red-950 p-3 text-red-200">{error}</p>}
        <Link to={`/admin/animes/${anime.id}/episodes/new`} className="rounded bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500">Novo episódio</Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-900 text-slate-300"><tr><th className="p-3">Episódio</th><th className="p-3">Idioma</th><th className="p-3">Vídeos</th><th className="p-3">Ações</th></tr></thead>
          <tbody>
            {anime.episodes.map((episode) => (
              <tr key={episode.id} className="border-t border-slate-800">
                <td className="p-3">{episode.titleEpisodio}</td><td className="p-3">{episode.languageEpisode}</td><td className="p-3">{episode.videoUrl?.length || 0}</td>
                <td className="p-3"><div className="flex gap-3"><Link to={`/admin/animes/${anime.id}/episodes/${episode.id}/edit`} className="text-emerald-300 hover:underline">Editar</Link><button onClick={() => deleteEpisode(episode)} className="text-red-300 hover:underline">Excluir</button></div></td>
              </tr>
            ))}
            {anime.episodes.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-slate-400">Ainda não há episódios cadastrados.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
