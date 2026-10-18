import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import EpisodeForm from 'pages/Admin/EpisodeForm';
import { usePublicAnimes, useAnimeCatalog } from 'context/AnimeCatalogContext';
import { episodeDates, getRecentAnimes, getRecentEpisodes } from './homeFeed';
jest.mock('context/AnimeCatalogContext');
jest.mock('react-slick', () => ({ children }) => <div>{children}</div>);
jest.mock('components/Banner', () => () => null);
jest.mock('components/PopularAnime', () => () => null);
jest.mock('components/Calendar', () => () => null);
const oldEpisode = { id: 1, titleEpisodio: 'Ep antigo', titleSlug: 'ep-antigo', languageEpisode: 'legendado', dataCreateEpisode: '2020-01-01T00:00:00Z', lancamento: false, videoUrl: [] };
const anime = (id, title, language, Type, createdAt, episodes = []) => ({ id, title, language, Type, createdAt, episodes, slug: `anime-${id}`, visibility: 'published', date: '' });
const fixtures = [
  anime(1, 'Leg antigo', 'Legendado', 'TV', '2020-01-01', [oldEpisode, { ...oldEpisode, id: 2, titleSlug: 'ep-novo', titleEpisodio: 'Ep novo', dataCreateEpisode: '2026-10-17T00:00:00Z' }]),
  anime(2, 'Leg novo', 'Legendado', 'TV', '2026-10-17', [{ ...oldEpisode, titleSlug: 'ep-recente', dataCreateEpisode: '2026-10-18T00:00:00Z' }]),
  anime(3, 'Dub antigo', 'Dublado', 'TV', '2020-01-01'), anime(4, 'Dub novo', 'Dublado', 'TV', '2026-10-17'),
  anime(5, 'Filme antigo', 'Legendado', 'Filme', '2020-01-01'), anime(6, 'Filme novo', 'Dublado', 'Filme', '2026-10-17'),
];
afterEach(() => jest.useRealTimers());
test('carrosséis filtram a categoria e ordenam pelo cadastro, sem misturar filmes', () => {
  expect(getRecentAnimes(fixtures, 'legendado').map(a => a.id)).toEqual([2, 1]);
  expect(getRecentAnimes(fixtures, 'dublado').map(a => a.id)).toEqual([4, 3]);
  expect(getRecentAnimes(fixtures, 'films').map(a => a.id)).toEqual([6, 5]);
});
test('lançamentos listam cada episódio por sua criação, sem depender da ordem do anime ou do array', () => {
  expect(getRecentEpisodes(fixtures).map(item => item.episode.titleSlug)).toEqual(['ep-recente', 'ep-novo', 'ep-antigo']);
  expect(fixtures[0].episodes[0]).toBe(oldEpisode);
});
test('marcar um episódio antigo traz ao topo sem mudar a data de criação', () => {
  const now = '2026-10-18T12:00:00Z';
  const promoted = { ...oldEpisode, lancamento: true, ...episodeDates({ lancamento: true }, oldEpisode, now) };
  expect(promoted.dataCreateEpisode).toBe(oldEpisode.dataCreateEpisode);
  expect(getRecentEpisodes([{ ...fixtures[0], episodes: [promoted, fixtures[0].episodes[1]] }, fixtures[1]])[0].episode).toBe(promoted);
  expect(episodeDates(promoted, promoted, '2026-10-19T00:00:00Z').releaseHighlightedAt).toBe(now);
  expect(episodeDates({ lancamento: false }, promoted).releaseHighlightedAt).toBeNull();
});
test('episódio novo aparece mesmo sem a marca de lançamento e editar legado não inventa data', () => {
  const dates = episodeDates({ lancamento: false }, undefined, '2026-10-18T12:00:00Z');
  expect(dates).toEqual({ dataCreateEpisode: '2026-10-18T12:00:00Z', releaseHighlightedAt: null });
  expect(episodeDates({ lancamento: false }, { id: 1 }).dataCreateEpisode).toBeNull();
  const markedLegacy = { ...oldEpisode, lancamento: true };
  expect(getRecentEpisodes([{ ...fixtures[0], episodes: [markedLegacy, fixtures[0].episodes[1]] }])[0].episode.titleSlug).toBe('ep-novo');
  expect(getRecentEpisodes([{ ...fixtures[0], visibility: 'draft' }])).toHaveLength(0);
});
test('home exibe as três seções recentes e os links de cada episódio correto', () => {
  jest.useFakeTimers();
  usePublicAnimes.mockReturnValue(fixtures);
  render(<MemoryRouter><Home /></MemoryRouter>);
  act(() => jest.advanceTimersByTime(2000));
  act(() => jest.advanceTimersByTime(2000));
  for (const [heading, expected] of [['Novos Animes Legendados', ['Leg novo', 'Leg antigo']], ['Novos Animes Dublados', ['Dub novo', 'Dub antigo']], ['Novos Filmes Adicionados', ['Filme novo', 'Filme antigo']]]) {
    const section = screen.getByRole('region', { name: heading });
    expect(within(section).getAllByRole('heading', { level: 3 }).map(node => node.textContent)).toEqual(expected);
  }
  const releases = screen.getByRole('region', { name: 'Lançamentos' });
  expect(within(releases).getAllByRole('link').slice(1).map(node => node.getAttribute('href'))).toEqual(['/animes/anime-2/ep-recente/legendado', '/animes/anime-1/ep-novo/legendado', '/animes/anime-1/ep-antigo/legendado']);
});
test('formulário persiste a nova data de destaque ao marcar um episódio antigo', async () => {
  jest.useFakeTimers().setSystemTime(new Date('2026-10-18T12:00:00Z'));
  const save = jest.fn().mockResolvedValue([]);
  useAnimeCatalog.mockReturnValue({ animes: [fixtures[0]], save });
  render(<MemoryRouter initialEntries={['/admin/animes/1/episodes/1/edit']}><Routes><Route path="/admin/animes/:animeId/episodes/:episodeId/edit" element={<EpisodeForm />} /><Route path="/admin/animes/:animeId/episodes" element={<p>Lista de episódios</p>} /></Routes></MemoryRouter>);
  fireEvent.click(screen.getByLabelText('Marcar como lançamento'));
  fireEvent.submit(screen.getByRole('form', { name: 'Episódio' }));
  expect(await screen.findByText(/Lista de epis/)).toBeInTheDocument();
  expect(save.mock.calls[0][0][0].episodes[0]).toMatchObject({ dataCreateEpisode: oldEpisode.dataCreateEpisode, lancamento: true, releaseHighlightedAt: '2026-10-18T12:00:00.000Z' });
});
