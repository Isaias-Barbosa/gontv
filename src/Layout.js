import Menu from 'components/Menu';
import Rodape from 'components/Rodape';
import React from 'react';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
export default function Layout({ children }) {
  const { animes, loading, error, refresh } = useAnimeCatalog();
  return <><Menu />{loading ? <div role="status" className="min-h-screen bg-black-dark p-8 text-center text-white">Carregando catálogo…</div> : error && !animes.length ? <div role="alert" className="min-h-screen bg-black-dark p-8 text-center text-white"><p>{error}</p><button onClick={refresh} className="mt-4 rounded bg-emerald-600 px-4 py-2">Tentar novamente</button></div> : <>{error && <p role="status" className="bg-black-dark p-3 text-center text-amber-200">Exibindo o catálogo salvo. Não foi possível atualizar agora. <button onClick={refresh} className="underline">Tentar novamente</button></p>}{children}</>}<Rodape /></>;
}
