import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
import { normalizeAnimeText, sortAnimes } from 'lib/animeList';

export default function AnimeManager() {
  const { animes, save } = useAnimeCatalog();
  const [search, setSearch] = useState('');
  const location = useLocation();
  const [notice, setNotice] = useState(location.state?.success || '');
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [publication, setPublication] = useState('');
  const [order, setOrder] = useState('newest');
  const filtered = sortAnimes(animes.filter(anime =>
    normalizeAnimeText(`${anime.title} ${anime.slug}`).includes(normalizeAnimeText(search.trim())) &&
    (!publication || (publication === 'draft' ? anime.visibility === 'draft' : anime.visibility !== 'draft'))
  ), order);

  const toggleVisibility = async (anime) => {
    if (savingId !== null) return;
    setError('');
    setNotice('');
    setSavingId(anime.id);
    const updated = animes.map((item) =>
      item.id === anime.id ? { ...item, visibility: item.visibility === 'draft' ? 'published' : 'draft' } : item
    );
    try {
      await save(updated);
      setNotice('Publicação atualizada com sucesso.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingId(null);
    }
  };

  const deleteAnime = async (anime) => {
    if (savingId !== null) return;
    if (!window.confirm(`Excluir "${anime.title}" e todos os seus episódios?`)) return;
    setSavingId(anime.id);
    setError('');
    setNotice('');
    try {
      await save(animes.filter((item) => item.id !== anime.id));
      setNotice('Anime e seus episódios excluídos com sucesso.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Animes</h1>
          <p className="mt-1 text-slate-400">Gerencie os dados do catálogo e o estado de publicação.</p>
        </div>
        <Link to="/admin/animes/new" className="rounded bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500">Novo anime</Link>
      </div>
      <div className="mb-5 flex flex-wrap gap-3">
        <label className="min-w-[200px] flex-1"><span className="mb-1 block text-sm text-slate-400">Buscar anime</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Título ou slug" className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white" /></label>
        <label><span className="mb-1 block text-sm text-slate-400">Publicação</span><select value={publication} onChange={event => setPublication(event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2"><option value="">Todas</option><option value="published">Publicados</option><option value="draft">Rascunhos</option></select></label>
        <label><span className="mb-1 block text-sm text-slate-400">Ordenar por</span><select value={order} onChange={event => setOrder(event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2"><option value="newest">Mais recentes</option><option value="oldest">Mais antigos</option><option value="title">Título: A–Z</option></select></label>
      </div>
      {error && <p role="alert" className="mb-4 rounded bg-red-950 p-3 text-red-200">{error}</p>}
      {savingId !== null && <p role="status" className="mb-4 rounded bg-sky-950 p-3 text-sky-200">Processando alteração… Aguarde a confirmação.</p>}
      {notice && <p role="status" className="mb-4 flex items-center justify-between gap-3 rounded bg-emerald-950 p-3 text-emerald-200">{notice}<button type="button" aria-label="Fechar confirmação" onClick={() => setNotice('')}>×</button></p>}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr><th className="p-3">Anime</th><th className="p-3">Episódios</th><th className="p-3">Estado</th><th className="p-3">Ações</th></tr>
          </thead>
          <tbody>
            {filtered.map((anime) => (
              <tr key={anime.id} className="border-t border-slate-800">
                <td className="p-3"><strong>{anime.title}</strong><span className="mt-1 block text-slate-500">{anime.slug}</span></td>
                <td className="p-3">{anime.episodes.length}</td>
                <td className="p-3">{anime.visibility === 'draft' ? 'Rascunho' : 'Publicado'}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/admin/animes/${anime.id}/edit`} className="text-emerald-300 hover:underline">Editar</Link>
                    <Link to={`/admin/animes/${anime.id}/episodes`} className="text-sky-300 hover:underline">Episódios</Link>
                    <button disabled={savingId !== null} onClick={() => toggleVisibility(anime)} className="text-amber-300 hover:underline disabled:opacity-50">
                      {anime.visibility === 'draft' ? 'Publicar' : 'Tornar rascunho'}
                    </button>
                    <button disabled={savingId !== null} onClick={() => deleteAnime(anime)} className="text-red-300 hover:underline">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-slate-400">Nenhum anime encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
