import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const navClass = ({ isActive }) =>
  `rounded px-3 py-2 text-sm font-semibold ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`;

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/admin" className="text-xl font-bold">Gon.TV <span className="text-emerald-400">Admin</span></Link>
          <nav className="flex flex-wrap gap-2" aria-label="Navegação administrativa">
            <NavLink to="/admin" end className={navClass}>Visão geral</NavLink>
            <NavLink to="/admin/animes" className={navClass}>Animes</NavLink>
            <Link to="/" className="rounded px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">Voltar ao site</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
