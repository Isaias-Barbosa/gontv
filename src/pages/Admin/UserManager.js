import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiPlus, FiSearch, FiX, FiUsers, FiEdit2 } from 'react-icons/fi';
import { useAuth } from 'context/AuthContext';
import { apiRequest } from 'lib/api';
const emptyForm = { name: '', email: '', password: '', role: 'editor', active: true };
export default function UserManager() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const modalRef = useRef(null);
  const busy = useRef(false);
  busy.current = saving;
  useEffect(() => {
    if (!editing) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = event => {
      if (event.key === 'Escape' && !busy.current) setEditing(null);
      if (event.key === 'Tab') {
        const elements = modalRef.current?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled)');
        if (!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [editing]);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const data = await apiRequest('/api/admin/users'); setUsers(data.users); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { if (user.role === 'admin') load(); }, [load, user.role]);
  if (user.role !== 'admin') return <Navigate to="/admin" replace />;
  const open = current => { setEditing(current || {}); setForm(current ? { ...current, password: '' } : emptyForm); setFormError(''); setMessage(''); };
  const close = () => { if (!saving) setEditing(null); };
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const submit = async event => {
    event.preventDefault(); setSaving(true); setFormError('');
    const existing = Boolean(editing.id);
    try {
      const data = await apiRequest(existing ? `/api/admin/users/${editing.id}` : '/api/admin/users', {method:existing ? 'PATCH' : 'POST', body:JSON.stringify(form)});
      setUsers(previous => existing ? previous.map(item => item.id === data.user.id ? data.user : item) : [data.user, ...previous]);
      setEditing(null); setMessage(existing ? 'Acesso atualizado com sucesso.' : 'Usuário criado com sucesso.');
      if (existing && String(editing.id) === String(user.id) && form.password) window.dispatchEvent(new Event('gontv:session-expired'));
    } catch (err) { setFormError(err.message); }
    finally { setSaving(false); }
  };
  const filtered = users.filter(item => `${item.name} ${item.email}`.toLowerCase().includes(search.toLowerCase()));
  const self = String(editing?.id) === String(user.id);
  return <section>
    <Helmet><title>Usuários · Gon.TV Studio</title></Helmet>
    <div className="admin-page-heading"><div><p className="admin-eyebrow">EQUIPE</p><h1>Usuários<span className="admin-heading-dot">.</span></h1><p>Gerencie as pessoas que fazem parte do seu painel.</p></div><button className="admin-button" onClick={() => open(null)}><FiPlus /> Novo usuário</button></div>
    {message && <p role="status" className="admin-success">{message}</p>}
    {error && <p role="alert" className="admin-error">{error} <button onClick={load}>Tentar novamente</button></p>}
    <div className="admin-table-panel"><div className="admin-panel-heading"><div><h2>Contas da equipe <span className="admin-count">{users.length}</span></h2><p>Administradores gerenciam acessos. Editores cuidam do catálogo.</p></div><label className="admin-search"><FiSearch /><span className="sr-only">Buscar usuário</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar nome ou e-mail" /></label></div>
    <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>USUÁRIO</th><th>PERFIL</th><th>STATUS</th><th>CADASTRO</th><th>AÇÕES</th></tr></thead><tbody>
      {loading ? <tr><td colSpan="5" className="admin-empty">Carregando usuários…</td></tr> : filtered.map(item => <tr key={item.id}><td><div className="admin-anime-cell"><span className="admin-avatar">{item.name.slice(0,1).toUpperCase()}</span><div><strong>{item.name}{String(item.id) === String(user.id) && <span className="admin-you"> você</span>}</strong><small>{item.email}</small></div></div></td><td>{item.role === 'admin' ? 'Administrador' : 'Editor'}</td><td><span className={`admin-badge ${item.active ? 'published' : 'inactive'}`}><i />{item.active ? 'Ativo' : 'Inativo'}</span></td><td className="admin-muted">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td><td><button className="admin-edit-link" onClick={() => open(item)} aria-label={`Editar acesso de ${item.name}`}><FiEdit2 /></button></td></tr>)}
      {!loading && !filtered.length && <tr><td colSpan="5" className="admin-empty"><FiUsers /> Nenhum usuário encontrado.</td></tr>}
    </tbody></table></div></div>
    {editing && <div className="admin-modal-backdrop"><section ref={modalRef} className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="user-dialog-title"><div className="admin-panel-heading"><div><h2 id="user-dialog-title">{editing.id ? 'Editar acesso' : 'Novo usuário'}</h2><p>{editing.id ? 'Atualize o perfil ou redefina a senha.' : 'Crie um acesso para a sua equipe.'}</p></div><button onClick={close} disabled={saving} aria-label="Fechar formulário"><FiX /></button></div>
      <form onSubmit={submit} className="admin-user-form">
        <label>Nome<input autoFocus required maxLength={100} disabled={Boolean(editing.id)} value={form.name} onChange={e => update('name',e.target.value)} autoComplete="name" /></label>
        <label>E-mail<input required type="email" maxLength={254} disabled={Boolean(editing.id)} value={form.email} onChange={e => update('email',e.target.value)} autoComplete="off" /></label>
        <label>{editing.id ? 'Nova senha (opcional)' : 'Senha'}<input required={!editing.id} type="password" minLength={12} value={form.password} onChange={e => update('password',e.target.value)} autoComplete="new-password" /><small>Mínimo de 12 caracteres. Ao redefinir, as sessões são encerradas.</small></label>
        <label>Perfil<select value={form.role} disabled={self} onChange={e => update('role',e.target.value)}><option value="editor">Editor</option><option value="admin">Administrador</option></select></label>
        {editing.id && <label className="admin-checkbox"><input type="checkbox" checked={form.active} disabled={self} onChange={e => update('active',e.target.checked)} /> Conta ativa</label>}
        {formError && <p role="alert" className="admin-error">{formError}</p>}
        <div className="admin-form-actions"><button type="button" className="admin-button secondary" disabled={saving} onClick={close}>Cancelar</button><button className="admin-button" disabled={saving}>{saving ? 'Salvando…' : editing.id ? 'Salvar alterações' : 'Criar usuário'}</button></div>
      </form>
    </section></div>}
  </section>;
}
