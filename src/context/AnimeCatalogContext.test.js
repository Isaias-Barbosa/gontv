import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { storePublicSnapshot } from 'lib/publicCatalog';
import { AnimeCatalogProvider, useAnimeCatalog } from './AnimeCatalogContext';
import { apiRequest } from 'lib/api';
import { useAuth } from './AuthContext';
jest.mock('lib/api');
jest.mock('./AuthContext');
const user = { id: 1 };
beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });
const first = { id: 1, title: 'Primeiro', episodes: [] };
const second = { id: 2, title: 'Segundo', episodes: [] };
function Consumer() {
  const { animes, loading, save } = useAnimeCatalog();
  return <><p>{loading ? 'Carregando' : animes[0]?.title}</p><button onClick={() => save(animes.map(a => a.id === 1 ? { ...a, title: 'Editado' } : a))}>Salvar</button></>;
}
test('envia somente o anime alterado com sua versão anterior para PostgreSQL', async () => {
  useAuth.mockReturnValue({ user, loading: false });
  apiRequest.mockResolvedValueOnce({ animes: [first, second], storage: 'postgres' }).mockResolvedValueOnce({ animes: [{ ...first, title: 'Editado' }, second], storage: 'postgres' });
  render(<MemoryRouter initialEntries={['/admin/animes']}><AnimeCatalogProvider><Consumer /></AnimeCatalogProvider></MemoryRouter>);
  await screen.findByText('Primeiro');
  fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await screen.findByText('Editado');
  const [path, options] = apiRequest.mock.calls[1];
  expect(path).toBe('/api/animes/changes');
  expect(JSON.parse(options.body)).toEqual({ changes: [{ before: first, after: { ...first, title: 'Editado' } }] });
});

test('home carrega o catálogo público sem esperar pela sessão', async () => {
  useAuth.mockReturnValue({ user: null, loading: true });
  apiRequest.mockResolvedValueOnce({ animes: [first], storage: 'postgres' });
  render(<MemoryRouter><AnimeCatalogProvider><Consumer /></AnimeCatalogProvider></MemoryRouter>);
  expect(await screen.findByText('Primeiro')).toBeInTheDocument();
  expect(apiRequest).toHaveBeenCalledTimes(1);
  expect(apiRequest).toHaveBeenCalledWith('/api/animes/public', { anonymous: true });
});
test('retorno ao site mostra cache imediatamente e atualiza em segundo plano', async () => {
  useAuth.mockReturnValue({ user: null, loading: false });
  storePublicSnapshot({ animes: [first, { ...second, visibility: 'draft' }], storage: 'postgres' });
  let resolve;
  apiRequest.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  render(<MemoryRouter><AnimeCatalogProvider><Consumer /></AnimeCatalogProvider></MemoryRouter>);
  expect(screen.getByText('Primeiro')).toBeInTheDocument();
  expect(screen.queryByText('Carregando')).not.toBeInTheDocument();
  expect(localStorage.getItem(localStorage.key(0))).not.toContain('Segundo');
  await act(async () => resolve({ animes: [{ ...first, title: 'Atualizado' }], storage: 'postgres' }));
  expect(screen.getByText('Atualizado')).toBeInTheDocument();
});
test('painel aguarda sua consulta autenticada mesmo com cache público', async () => {
  useAuth.mockReturnValue({ user, loading: false });
  storePublicSnapshot({ animes: [first], storage: 'postgres' });
  let resolve;
  apiRequest.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  render(<MemoryRouter initialEntries={['/admin/animes']}><AnimeCatalogProvider><Consumer /></AnimeCatalogProvider></MemoryRouter>);
  expect(screen.getByText('Carregando')).toBeInTheDocument();
  expect(apiRequest).toHaveBeenCalledWith('/api/animes');
  await act(async () => resolve({ animes: [first], storage: 'postgres' }));
  expect(screen.getByText('Primeiro')).toBeInTheDocument();
});
