import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AnimeCatalogContext = createContext(null);
const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001';

export function AnimeCatalogProvider({ children }) {
  const [animes, setAnimes] = useState([]);
  const [storage, setStorage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/animes`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível carregar o catálogo.');
      }
      if (!Array.isArray(payload.animes)) {
        throw new Error('A API retornou um catálogo inválido.');
      }
      setAnimes(payload.animes);
      setStorage(payload.storage || 'local');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (nextAnimes) => {
    const response = await fetch(`${apiBaseUrl}/api/animes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animes: nextAnimes }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Não foi possível salvar o catálogo.');
    }
    if (!Array.isArray(payload.animes)) {
      throw new Error('A API retornou uma resposta de gravação inválida.');
    }
    setAnimes(payload.animes);
    setStorage(payload.storage || 'local');
    return payload.animes;
  }, []);

  const value = useMemo(
    () => ({ animes, storage, loading, error, refresh, save }),
    [animes, storage, loading, error, refresh, save]
  );

  if (loading) {
    return <div className="min-h-screen bg-black-dark flex items-center justify-center text-white">Carregando catálogo...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black-dark flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
        <h1 className="text-2xl font-bold">Não foi possível carregar o catálogo</h1>
        <p>{error}</p>
        <p>Confirme se a API está em execução com <code>npm run start-server</code>.</p>
        <button className="rounded bg-emerald-600 px-4 py-2 font-semibold" onClick={refresh}>Tentar novamente</button>
      </div>
    );
  }

  return <AnimeCatalogContext.Provider value={value}>{children}</AnimeCatalogContext.Provider>;
}

export function useAnimeCatalog() {
  const context = useContext(AnimeCatalogContext);
  if (!context) throw new Error('useAnimeCatalog precisa ser usado dentro de AnimeCatalogProvider.');
  return context;
}

export function usePublicAnimes() {
  const { animes } = useAnimeCatalog();
  return useMemo(() => animes.filter((anime) => anime.visibility !== 'draft'), [animes]);
}
