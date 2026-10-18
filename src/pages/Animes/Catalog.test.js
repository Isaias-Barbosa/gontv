import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Banner from 'components/Banner';
import Animes from './index';
import AnimeManager from 'pages/Admin/AnimeManager';
import { usePublicAnimes, useAnimeCatalog } from 'context/AnimeCatalogContext';
import { filterAnimes, sortAnimes } from 'lib/animeList';
jest.mock('context/AnimeCatalogContext');
jest.mock('react-responsive-carousel', () => ({ Carousel: ({ children }) => <div data-testid="banner">{children}</div> }));
const fixtures = [
  { id: 1, title: 'Antigo', slug: 'slug-personalizado', Type: 'TV', language: 'Legendado', genres: ['Drama'], top: true, visibility: 'published', episodes: [], createdAt: '2025-01-01' },
  { id: 2, title: 'Ação', slug: 'acao', Type: 'Filme', language: 'Dublado', genres: ['Ação'], top: true, visibility: 'published', episodes: [], createdAt: '2026-01-01' },
  { id: 3, title: 'Terceiro', slug: 'terceiro', Type: 'TV', language: 'Legendado', genres: ['Drama'], top: true, visibility: 'published', episodes: [], createdAt: '2026-02-01' },
  { id: 4, title: 'Novo destaque', slug: 'novo', Type: 'TV', language: 'Legendado', genres: ['Ação'], top: true, visibility: 'published', episodes: [], createdAt: '2026-10-17' },
];
beforeEach(() => {
  usePublicAnimes.mockReturnValue(fixtures);
  useAnimeCatalog.mockReturnValue({ animes: fixtures, save: jest.fn() });
});
test('banner inclui o quarto destaque publicado e coloca o mais recente primeiro', () => {
  usePublicAnimes.mockReturnValue([...fixtures, { ...fixtures[3], id: 5, title: 'Rascunho', visibility: 'draft' }]);
  render(<MemoryRouter><Banner /></MemoryRouter>);
  expect(screen.getAllByRole('heading', { level: 2 }).map(item => item.textContent)).toEqual(['Novo destaque', 'Terceiro', 'Ação', 'Antigo']);
  expect(screen.queryByText('Rascunho')).not.toBeInTheDocument();
  expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', '/animes/novo');
});
test('catálogo usa criação decrescente e preserva o slug salvo no card', () => {
  render(<MemoryRouter><Animes /></MemoryRouter>);
  expect(screen.getAllByRole('heading', { level: 3 }).map(item => item.textContent)).toEqual(['Novo destaque', 'Terceiro', 'Ação', 'Antigo']);
  expect(screen.getAllByRole('link').map(item => item.getAttribute('href'))).toContain('/animes/slug-personalizado');
});
test('filtros combinam busca sem acentos, gênero e idioma e podem ser limpos', () => {
  render(<MemoryRouter><Animes /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Buscar anime'), { target: { value: 'acao' } });
  fireEvent.change(screen.getByLabelText('Gênero'), { target: { value: 'Ação' } });
  fireEvent.change(screen.getByLabelText('Idioma'), { target: { value: 'Dublado' } });
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
  fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'TV' } });
  expect(screen.getByText('Nenhum anime encontrado.')).toBeInTheDocument();
  fireEvent.click(within(screen.getByRole('search')).getByRole('button', { name: 'Limpar filtros' }));
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
  fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'oldest' } });
  expect(screen.getAllByRole('heading', { level: 3 })[0]).toHaveTextContent('Antigo');
});
test('mudança de filtro volta para a primeira página', () => {
  usePublicAnimes.mockReturnValue(Array.from({ length: 37 }, (_, index) => ({...fixtures[0], id: index + 1, slug: `anime-${index}`, title: `Anime ${index + 1}`, createdAt: null, genres: index === 0 ? ['Drama'] : ['Ação'] })));
  render(<MemoryRouter><Animes /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
  fireEvent.change(screen.getByLabelText('Gênero'), { target: { value: 'Ação' } });
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(36);
});
test('painel administrativo ordena por criação e filtra rascunhos', () => {
  useAnimeCatalog.mockReturnValue({ animes: [...fixtures, { ...fixtures[0], id: 5, title: 'Rascunho', visibility: 'draft', createdAt: '2026-10-18' }], save: jest.fn() });
  render(<MemoryRouter><AnimeManager /></MemoryRouter>);
  const rows = screen.getAllByRole('row');
  expect(rows[1]).toHaveTextContent('Rascunho');
  fireEvent.change(screen.getByLabelText('Publicação'), { target: { value: 'draft' } });
  expect(screen.getAllByRole('row')).toHaveLength(2);
});
test('datas desconhecidas usam ID sem alterar o catálogo original', () => {
  const input = [{ id: 100, title: 'Legado' }, { id: 2, title: 'Novo', createdAt: '2026-10-17' }, { id: 99, title: 'Outro legado', createdAt: 'invalida' }];
  expect(sortAnimes(input).map(item => item.id)).toEqual([2, 100, 99]);
  expect(input.map(item => item.id)).toEqual([100, 2, 99]);
  expect(filterAnimes(fixtures, { type: 'Filme' })).toHaveLength(1);
});
