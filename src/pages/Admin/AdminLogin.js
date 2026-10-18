import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiArrowLeft, FiLock, FiPlay } from 'react-icons/fi';
import { useAuth } from 'context/AuthContext';
import './Admin.css';
export default function AdminLogin() {
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  if (loading) return <div className="admin-login">Verificando sessão…</div>;
  if (user) return <Navigate to="/admin" replace />;
  const submit = async event => {
    event.preventDefault(); setError(''); setSubmitting(true);
    try {
      await login(email, password);
      const target = location.state?.from;
      navigate(target?.startsWith('/admin/') && target !== '/admin/login' ? target : '/admin', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };
  return <div className="admin-login">
    <Helmet><title>Entrar no painel · Gon.TV</title></Helmet>
    <div className="admin-login-card">
      <Link className="admin-brand" to="/"><span className="admin-brand-icon"><FiPlay /></span>Gon.TV <span>STUDIO</span></Link>
      <div className="admin-login-lock"><FiLock /></div>
      <h1>Bem-vindo de volta.</h1><p>Entre com sua conta para gerenciar o Gon.TV.</p>
      <form onSubmit={submit}>
        <label>E-mail<input autoFocus type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" /></label>
        <label>Senha<input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-button" disabled={submitting}>{submitting ? 'Entrando…' : 'Entrar no painel'}</button>
      </form>
      <p className="admin-login-note">Acesso da equipe. Solicite sua conta a um administrador.</p>
      <Link to="/" className="admin-back"><FiArrowLeft /> Voltar ao site</Link>
    </div>
  </div>;
}
