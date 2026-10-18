import Menu from 'components/Menu';
import Rodape from 'components/Rodape';
import React from 'react';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
export default function Layout({ children }) {
  const { loading, error, refresh } = useAnimeCatalog();
  return <><Menu />{loading ? <div role="status" className="min-h-screen bg-black-dark p-8 text-center text-white">Carregando catálogo…</div> : error ? <div role="alert" className="min-h-screen bg-black-dark p-8 text-center text-white"><p>{error}</p><button onClick={refresh} className="mt-4 rounded bg-emerald-600 px-4 py-2">Tentar novamente</button></div> : children}<Rodape /></>;
}
