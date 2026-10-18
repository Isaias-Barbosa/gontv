import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { apiRequest } from 'lib/api';
import { useAuth } from 'context/AuthContext';
import { useLocation } from 'react-router-dom';
import { readPublicSnapshot, storePublicSnapshot, loadPublicCatalog } from 'lib/publicCatalog';
const AnimeCatalogContext = createContext(null);
export function AnimeCatalogProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { pathname } = useLocation();
  const privateRoute = pathname.startsWith('/admin');
  const [snapshot] = useState(readPublicSnapshot);
  const [animes, setAnimes] = useState(snapshot?.animes || []);
  const [storage, setStorage] = useState('');
  const [pending, setLoading] = useState(true);
  const [loadedFor, setLoadedFor] = useState(snapshot ? null : undefined);
  const identity = privateRoute ? user?.id || null : null;
  const waitingForAuth = privateRoute && authLoading;
  const loading = waitingForAuth || loadedFor !== identity;
  const [error, setError] = useState('');
  const request = useRef(0);
  const refresh = useCallback(async () => {
    const id = ++request.current;
    setLoading(true); setError('');
    try {
      const payload = identity ? await apiRequest('/api/animes') : await loadPublicCatalog();
      if (!Array.isArray(payload.animes)) throw new Error('A API retornou um catálogo inválido.');
      if (id === request.current) { setAnimes(payload.animes); setStorage(payload.storage || 'local'); }
    } catch (err) { if (id === request.current) setError(err.message); }
    finally { if (id === request.current) { setLoadedFor(identity); setLoading(false); } }
  }, [identity]);
  useEffect(() => {
    if (!waitingForAuth) refresh();
    return () => { request.current += 1; };
  }, [refresh, privateRoute, waitingForAuth]);
  const save = useCallback(async nextAnimes => {
    const before = new Map(animes.map(anime => [String(anime.id), anime]));
    const after = new Map(nextAnimes.map(anime => [String(anime.id), anime]));
    const changes = [...new Set([...before.keys(), ...after.keys()])]
      .filter(id => before.get(id) !== after.get(id))
      .map(id => ({ before: before.get(id) || null, after: after.get(id) || null }));
    const payload = storage === 'postgres'
      ? await apiRequest('/api/animes/changes', { method: 'POST', body: JSON.stringify({ changes }) })
      : await apiRequest('/api/animes', { method: 'PUT', body: JSON.stringify({ animes: nextAnimes }) });
    if (!Array.isArray(payload.animes)) throw new Error('A API retornou uma resposta de gravação inválida.');
    storePublicSnapshot({ ...payload, animes: payload.animes.filter(anime => anime.visibility !== 'draft') });
    setAnimes(payload.animes); setStorage(payload.storage || 'local');
    return payload.animes;
  }, [animes, storage]);
  const value = useMemo(() => ({ animes, storage, loading, refreshing: pending, error, refresh, save }), [animes, storage, loading, pending, error, refresh, save]);
  return <AnimeCatalogContext.Provider value={value}>{children}</AnimeCatalogContext.Provider>;
}
export function useAnimeCatalog() {
  const context = useContext(AnimeCatalogContext);
  if (!context) throw new Error('useAnimeCatalog precisa ser usado dentro de AnimeCatalogProvider.');
  return context;
}
export function usePublicAnimes() {
  const { animes } = useAnimeCatalog();
  return useMemo(() => animes.filter(anime => anime.visibility !== 'draft'), [animes]);
}
