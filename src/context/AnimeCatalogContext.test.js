import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnimeCatalogProvider, useAnimeCatalog } from './AnimeCatalogContext';
import { apiRequest } from 'lib/api';
import { useAuth } from './AuthContext';
jest.mock('lib/api');
jest.mock('./AuthContext');
const user = { id: 1 };
const first = { id: 1, title: 'Primeiro', episodes: [] };
const second = { id: 2, title: 'Segundo', episodes: [] };
function Consumer() {
  const { animes, loading, save } = useAnimeCatalog();
  return <><p>{loading ? 'Carregando' : animes[0]?.title}</p><button onClick={() => save(animes.map(a => a.id === 1 ? { ...a, title: 'Editado' } : a))}>Salvar</button></>;
}
test('envia somente o anime alterado com sua versão anterior para PostgreSQL', async () => {
  useAuth.mockReturnValue({ user, loading: false });
  apiRequest.mockResolvedValueOnce({ animes: [first, second], storage: 'postgres' }).mockResolvedValueOnce({ animes: [{ ...first, title: 'Editado' }, second], storage: 'postgres' });
  render(<AnimeCatalogProvider><Consumer /></AnimeCatalogProvider>);
  await screen.findByText('Primeiro');
  fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await screen.findByText('Editado');
  const [path, options] = apiRequest.mock.calls[1];
  expect(path).toBe('/api/animes/changes');
  expect(JSON.parse(options.body)).toEqual({ changes: [{ before: first, after: { ...first, title: 'Editado' } }] });
});
