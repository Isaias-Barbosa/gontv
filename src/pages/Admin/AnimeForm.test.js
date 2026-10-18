import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AnimeForm from './AnimeForm';
import { useAnimeCatalog } from 'context/AnimeCatalogContext';
import { apiRequest } from 'lib/api';
jest.mock('context/AnimeCatalogContext');
jest.mock('lib/api', () => ({ apiRequest: jest.fn() }));
beforeEach(() => useAnimeCatalog.mockReturnValue({ animes: [], save: jest.fn() }));
test('importação preenche campos mesmo quando o diretor está indisponível', async () => {
  apiRequest.mockResolvedValue({ mal_id: 60636, title: 'Anime de teste', type: 'TV', director: '', genres: [], themes: [], warnings: ['Dados carregados. Preencha o diretor manualmente.'] });
  render(<MemoryRouter><AnimeForm /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('ID do MyAnimeList'), { target: { value: '60636' } });
  fireEvent.click(screen.getByRole('button', { name: 'Buscar MAL' }));
  expect(await screen.findByDisplayValue('Anime de teste')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Preencha o diretor manualmente');
  expect(apiRequest).toHaveBeenCalledWith('/api/mal/anime/60636');
});
test('falha na consulta mantém os dados já digitados', async () => {
  apiRequest.mockRejectedValue(new Error('O serviço está indisponível.'));
  render(<MemoryRouter><AnimeForm /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Cadastro manual' } });
  fireEvent.change(screen.getByLabelText('ID do MyAnimeList'), { target: { value: '60636' } });
  fireEvent.click(screen.getByRole('button', { name: 'Buscar MAL' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('O serviço está indisponível.');
  expect(screen.getByLabelText('Título')).toHaveValue('Cadastro manual');
});
