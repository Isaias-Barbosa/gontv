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

test('ID do AniList preenche o formulário e usa o banner próprio', async () => {
  apiRequest.mockResolvedValue({ anilist_id:195604,mal_id:61967,title:'Anime do AniList',type:'TV',status:'Not yet aired',bannerImage:'https://example.com/banner.jpg',images:{jpg:{large_image_url:'https://example.com/cover.jpg'}},genres:[{name:'Action'}],warnings:[] });
  render(<MemoryRouter><AnimeForm /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('ID do AniList'), {target:{value:'195604'}});
  fireEvent.click(screen.getByRole('button',{name:'Buscar AniList'}));
  expect(await screen.findByDisplayValue('Anime do AniList')).toBeInTheDocument();
  expect(screen.getByLabelText('URL do fundo')).toHaveValue('https://example.com/banner.jpg');
  expect(screen.getByLabelText('URL da capa')).toHaveValue('https://example.com/cover.jpg');
  expect(apiRequest).toHaveBeenCalledWith('/api/anilist/anime/195604');
});
test('timeout do MAL permite usar o mesmo ID via correspondência no AniList', async () => {
  apiRequest.mockRejectedValueOnce(new Error('A consulta demorou para responder.')).mockResolvedValueOnce({anilist_id:195604,mal_id:61967,title:'Anime recuperado',genres:[],warnings:[]});
  render(<MemoryRouter><AnimeForm /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('ID do MyAnimeList'),{target:{value:'61967'}});
  fireEvent.click(screen.getByRole('button',{name:'Buscar MAL'}));
  fireEvent.click(await screen.findByRole('button',{name:'Tentar este ID MAL no AniList'}));
  expect(await screen.findByDisplayValue('Anime recuperado')).toBeInTheDocument();
  expect(apiRequest).toHaveBeenLastCalledWith('/api/anilist/anime/by-mal/61967');
});
