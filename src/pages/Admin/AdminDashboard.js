import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiFilm, FiPlayCircle, FiUsers, FiFileText, FiPlus, FiArrowUpRight, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { apiRequest } from 'lib/api';
import { useAuth } from 'context/AuthContext';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
const date = value => value ? new Date(value).toLocaleDateString('pt-BR') : 'Cadastro anterior';
export default function AdminDashboard() {
  const { user } = useAuth();
  const { animes } = useAnimeCatalog();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true; setError('');
    apiRequest('/api/admin/dashboard').then(result => { if (active) setData(result); }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [retry, animes]);
  const metrics = data ? [
    { label: 'Total de animes', value: data.totalAnimes, caption: `${data.published} publicados no site`, icon: FiFilm, color: 'green' },
    { label: 'Episódios', value: data.episodes, caption: 'Disponíveis no catálogo', icon: FiPlayCircle, color: 'blue' },
    { label: 'Rascunhos', value: data.drafts, caption: 'Aguardando publicação', icon: FiFileText, color: 'amber' },
    { label: 'Usuários', value: data.users, caption: 'Contas da equipe', icon: FiUsers, color: 'purple' },
  ] : [];
  return <section>
    <Helmet><title>Visão geral · Gon.TV Studio</title></Helmet>
    <div className="admin-page-heading"><div><p className="admin-eyebrow">VISÃO GERAL</p><h1>Olá, {user.name.split(' ')[0]} <span className="admin-heading-dot">.</span></h1><p>Acompanhe seu catálogo e continue de onde parou.</p></div><Link className="admin-button" to="/admin/animes/new"><FiPlus /> Novo anime</Link></div>
    {error && <div className="admin-error" role="alert">{error} <button onClick={() => setRetry(value => value + 1)}><FiRefreshCw /> Tentar novamente</button></div>}
    {!data && !error && <p role="status" className="admin-loading">Carregando os indicadores…</p>}
    {data && <>
      <div className="admin-metrics">{metrics.map(({ label, value, caption, icon: Icon, color }) => <article key={label} className="admin-metric"><div className="admin-metric-top"><span>{label}</span><span className={`admin-metric-icon ${color}`}><Icon /></span></div><strong>{value.toLocaleString('pt-BR')}</strong><p>{caption}</p></article>)}</div>
      <div className="admin-table-panel"><div className="admin-panel-heading"><div><h2>Últimos animes cadastrados</h2><p>As adições mais recentes ao seu catálogo.</p></div><Link to="/admin/animes">Ver todos <FiArrowRight /></Link></div>
        <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>ANIME</th><th>STATUS</th><th>EPISÓDIOS</th><th>CADASTRO</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>
          {data.recentAnimes.map(anime => <tr key={anime.id}><td><div className="admin-anime-cell">{anime.coverImage ? <img src={anime.coverImage} alt="" /> : <span className="admin-cover-placeholder"><FiFilm /></span>}<div><strong>{anime.title}</strong><small>{[anime.Type, anime.year].filter(Boolean).join(' · ') || 'Anime'}</small></div></div></td><td><span className={`admin-badge ${anime.visibility === 'draft' ? 'draft' : 'published'}`}><i />{anime.visibility === 'draft' ? 'Rascunho' : 'Publicado'}</span></td><td>{anime.episodes.length} <span className="admin-muted">episódios</span></td><td className="admin-muted">{date(anime.createdAt)}</td><td><Link className="admin-edit-link" to={`/admin/animes/${anime.id}/edit`} aria-label={`Editar ${anime.title}`}><FiArrowUpRight /></Link></td></tr>)}
          {!data.recentAnimes.length && <tr><td colSpan="5" className="admin-empty">Seu catálogo começa aqui. Cadastre o primeiro anime.</td></tr>}
        </tbody></table></div>
      </div>
      <div className="admin-tip"><span className="admin-metric-icon green"><FiFilm /></span><div><strong>Seu próximo lançamento começa aqui.</strong><p>Cadastre animes, organize episódios e publique quando estiver pronto.</p></div><Link to="/admin/animes">Gerenciar catálogo <FiArrowRight /></Link></div>
    </>}
  </section>;
}
