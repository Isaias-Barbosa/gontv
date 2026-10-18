import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Pagination from '@mui/material/Pagination';
import CardAnime from 'components/CardAnime';
import { usePublicAnimes } from 'context/AnimeCatalogContext';
import { filterAnimes, sortAnimes } from 'lib/animeList';
import './Animes.css';
const initialFilters = { search: '', genre: '', type: '', language: '', order: 'newest' };
const pageSize = 36;
export default function Animes() {
  const animes = usePublicAnimes();
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const genres = useMemo(() => [...new Set(animes.flatMap(anime => anime.genres || []))].sort((a,b) => a.localeCompare(b, 'pt-BR')), [animes]);
  const types = useMemo(() => [...new Set(animes.map(anime => anime.Type).filter(Boolean))].sort(), [animes]);
  const languages = useMemo(() => [...new Set(animes.map(anime => anime.language).filter(Boolean))].sort(), [animes]);
  const filtered = useMemo(() => sortAnimes(filterAnimes(animes, filters), filters.order), [animes, filters]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const update = (key, value) => { setFilters(previous => ({ ...previous, [key]: value })); setPage(1); };
  const reset = () => { setFilters(initialFilters); setPage(1); };
  return <div className="bg-black-dark"><main className="anime-catalog-page">
    <Helmet><title>Gon.TV - Catálogo de animes</title></Helmet>
    <header className="anime-catalog-heading"><div><h1>Animes</h1><p>Explore o catálogo e encontre seu próximo anime.</p></div><span aria-live="polite">{filtered.length} {filtered.length === 1 ? 'anime encontrado' : 'animes encontrados'}</span></header>
    <div className="anime-catalog-filters" role="search" aria-label="Filtros do catálogo">
      <label className="anime-title-search">Buscar anime<input type="search" value={filters.search} onChange={event => update('search', event.target.value)} placeholder="Título ou nome alternativo" /></label>
      <label>Gênero<select value={filters.genre} onChange={event => update('genre', event.target.value)}><option value="">Todos os gêneros</option>{genres.map(genre => <option key={genre}>{genre}</option>)}</select></label>
      <label>Tipo<select value={filters.type} onChange={event => update('type', event.target.value)}><option value="">Todos os tipos</option>{types.map(type => <option key={type}>{type}</option>)}</select></label>
      <label>Idioma<select value={filters.language} onChange={event => update('language', event.target.value)}><option value="">Todos os idiomas</option>{languages.map(language => <option key={language}>{language}</option>)}</select></label>
      <label>Ordenar por<select value={filters.order} onChange={event => update('order', event.target.value)}><option value="newest">Mais recentes</option><option value="oldest">Mais antigos</option><option value="title">Título: A–Z</option></select></label>
      <button type="button" onClick={reset}>Limpar filtros</button>
    </div>
    {visible.length ? <div className="anime-catalog-grid">{visible.map(anime => <CardAnime key={anime.id} anime={anime} />)}</div> : <div className="anime-catalog-empty"><h2>Nenhum anime encontrado.</h2><p>Tente outros filtros ou procure por outro título.</p><button onClick={reset}>Limpar filtros</button></div>}
    {pages > 1 && <div className="anime-catalog-pagination"><Pagination count={pages} page={currentPage} onChange={(event, value) => setPage(value)} sx={{ '& .MuiPaginationItem-root': { color: 'white' }, '& .Mui-selected': { backgroundColor: '#14664e !important' } }} /></div>}
  </main></div>;
}
