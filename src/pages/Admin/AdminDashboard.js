import React from 'react';
import { Link } from 'react-router-dom';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';

export default function AdminDashboard() {
  const { animes, storage } = useAnimeCatalog();
  const published = animes.filter((anime) => anime.visibility !== 'draft').length;
  const drafts = animes.length - published;
  const episodeCount = animes.reduce((count, anime) => count + anime.episodes.length, 0);

  const metrics = [
    { label: 'Animes publicados', value: published },
    { label: 'Rascunhos', value: drafts },
    { label: 'Episódios cadastrados', value: episodeCount },
  ];

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de conteúdo</h1>
          <p className="mt-2 text-slate-400">Área de estudo para organizar o catálogo e os episódios demonstrativos.</p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
          Armazenamento: {storage === 'jsonbin' ? 'Jsonbin' : 'local'}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/animes/new" className="rounded bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500">Cadastrar anime</Link>
        <Link to="/admin/animes" className="rounded border border-slate-700 px-4 py-2 font-semibold hover:bg-slate-800">Gerenciar catálogo</Link>
      </div>
      <p className="mt-8 max-w-3xl rounded border border-amber-700/50 bg-amber-950/30 p-4 text-sm text-amber-100">
        Esta dashboard é uma interface de estudo e ainda não tem autenticação. Não exponha a API em produção sem adicionar controle de acesso.
        Os campos de vídeo guardam URLs de demonstração; não há upload ou hospedagem de arquivos de vídeo.
      </p>
    </section>
  );
}
