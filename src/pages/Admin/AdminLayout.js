import React, { useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { FiGrid, FiFilm, FiUsers, FiExternalLink, FiLogOut, FiMenu, FiX, FiPlay } from 'react-icons/fi';
import { useAuth } from 'context/AuthContext';
import './Admin.css';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const catalog = useAnimeCatalog();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  if (loading) return <div className="admin-login">Verificando sessão…</div>;
  if (!user) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  const exit = async () => { try { await logout(); } catch { setError('Não foi possível encerrar a sessão no servidor. O acesso local foi encerrado.'); } };
  return <div className="admin-shell">
    {open && <button className="admin-backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)} />}
    <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
      <Link to="/admin" className="admin-brand"><span className="admin-brand-icon"><FiPlay /></span>Gon.TV <span>STUDIO</span></Link>
      <button className="admin-mobile-close" onClick={() => setOpen(false)} aria-label="Fechar menu"><FiX /></button>
      <p className="admin-nav-label">GERENCIAMENTO</p>
      <nav aria-label="Navegação administrativa" onClick={() => setOpen(false)}>
        <NavLink end to="/admin"><FiGrid /> Visão geral</NavLink>
        <NavLink to="/admin/animes"><FiFilm /> Animes</NavLink>
        {user.role === 'admin' && <NavLink to="/admin/usuarios"><FiUsers /> Usuários</NavLink>}
      </nav>
      <div className="admin-sidebar-bottom"><Link to="/"><FiExternalLink /> Ver site</Link><span>Painel de administração</span></div>
    </aside>
    <div className="admin-workspace">
      <header className="admin-topbar">
        <div className="admin-topbar-title"><button className="admin-mobile-toggle" onClick={() => setOpen(true)} aria-label="Abrir menu"><FiMenu /></button><span>PAINEL DE CONTROLE</span></div>
        <div className="admin-account"><div className="admin-avatar">{user.name.slice(0, 1).toUpperCase()}</div><div><strong>{user.name}</strong><small>{user.role === 'admin' ? 'Administrador' : 'Editor'}</small></div><button onClick={exit} aria-label="Sair da conta" title="Sair"><FiLogOut /></button></div>
      </header>
      <main className="admin-main">{error && <p role="alert" className="admin-error">{error}</p>}{catalog.loading ? <p role="status" className="admin-loading">Carregando catálogo…</p> : catalog.error ? <div role="alert" className="admin-error">{catalog.error} <button onClick={catalog.refresh}>Tentar novamente</button></div> : <Outlet />}</main>
      <footer className="admin-footer">Gon.TV Studio <span>Seu catálogo, bem organizado.</span></footer>
    </div>
  </div>;
}
