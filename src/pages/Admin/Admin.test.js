import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import UserManager from './UserManager';
import { useAuth } from 'context/AuthContext';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
import { apiRequest } from 'lib/api';
jest.mock('context/AuthContext');
jest.mock('context/AnimeCatalogContext');
jest.mock('lib/api', () => ({ apiRequest: jest.fn() }));
const admin = { id: '1', name: 'Isaias Teste', email: 'admin@example.com', role: 'admin' };
const anime = { id: 3, title: 'Anime recente', Type: 'TV', visibility: 'published', episodes: [], createdAt: '2026-10-17T12:00:00Z' };
beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ user: admin, loading: false, logout: jest.fn(), login: jest.fn() });
  useAnimeCatalog.mockReturnValue({ animes: [anime], loading: false, error: '' });
});
test('visitante é encaminhado para o login ao abrir uma rota administrativa', async () => {
  useAuth.mockReturnValue({ user: null, loading: false });
  render(<MemoryRouter initialEntries={['/admin/animes']}><Routes><Route path="/admin" element={<AdminLayout />}><Route path="animes" element={<p>Catálogo privado</p>} /></Route><Route path="/admin/login" element={<p>Login administrativo</p>} /></Routes></MemoryRouter>);
  expect(await screen.findByText('Login administrativo')).toBeInTheDocument();
  expect(screen.queryByText('Catálogo privado')).not.toBeInTheDocument();
});
test('editor vê Animes mas não o gerenciamento de usuários', () => {
  useAuth.mockReturnValue({ user: { ...admin, role: 'editor' }, loading: false });
  render(<MemoryRouter><AdminLayout /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Animes' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Usuários' })).not.toBeInTheDocument();
});
test('home apresenta indicadores reais e tabela de animes recentes', async () => {
  apiRequest.mockResolvedValue({ totalAnimes: 79, published: 78, drafts: 1, episodes: 300, users: 2, recentAnimes: [anime] });
  render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
  expect(await screen.findByText('Anime recente')).toBeInTheDocument();
  expect(screen.getByText('79')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Editar Anime recente' })).toHaveAttribute('href', '/admin/animes/3/edit');
});
test('login exibe falha de credenciais sem conceder acesso', async () => {
  const login = jest.fn().mockRejectedValue(new Error('E-mail ou senha inválidos.'));
  useAuth.mockReturnValue({ user: null, loading: false, login });
  render(<MemoryRouter><AdminLogin /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'admin@example.com' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-incorreta-123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar no painel' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha inválidos.');
  expect(login).toHaveBeenCalledWith('admin@example.com', 'senha-incorreta-123');
});
test('administrador cria usuário e a nova conta aparece na tabela', async () => {
  apiRequest.mockImplementation((path, options) => options?.method === 'POST'
    ? Promise.resolve({ user: { id: '2', name: 'Nova Pessoa', email: 'nova@example.com', role: 'editor', active: true, createdAt: '2026-10-17T12:00:00Z' } })
    : Promise.resolve({ users: [] }));
  render(<MemoryRouter><UserManager /></MemoryRouter>);
  await screen.findByText(/Nenhum usuário encontrado/);
  fireEvent.click(screen.getByRole('button', { name: 'Novo usuário' }));
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Nova Pessoa' } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'nova@example.com' } });
  fireEvent.change(screen.getByLabelText(/^Senha/), { target: { value: 'uma-senha-segura-123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Criar usuário' }));
  expect(await screen.findByText('Nova Pessoa')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});
