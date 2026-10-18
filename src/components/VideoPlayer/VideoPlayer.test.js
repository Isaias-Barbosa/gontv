import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import DPlayer from 'dplayer';
import VideoPlayer from './index';
import { createSubtitleWorker } from 'lib/createSubtitleWorker';
jest.mock('lib/createSubtitleWorker', () => ({ createSubtitleWorker: jest.fn() }));
jest.mock('dplayer', () => jest.fn());
function mockPlayer(options) {
  const video = global.document.createElement('video');
  video.addTextTrack = jest.fn(() => ({ mode: 'disabled', cues: [], addCue(cue) { this.cues.push(cue); }, removeCue(cue) { this.cues = this.cues.filter(item => item !== cue); } }));
  options.container.appendChild(video);
  const handlers = {};
  return { video, handlers, on: (name, callback) => { handlers[name] = callback; }, destroy: jest.fn(() => video.remove()), seek: jest.fn(), play: jest.fn() };
}
const mkv = 'https://media.discordapp.net/attachments/123/456/episode.mkv?ex=abc&hm=example&';
let worker;
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  DPlayer.mockImplementation(mockPlayer);
  window.Worker = jest.fn();
  window.VTTCue = class { constructor(start, end, text) { this.startTime = start; this.endTime = end; this.text = text; } };
  worker = { postMessage: jest.fn(), terminate: jest.fn() };
  createSubtitleWorker.mockReturnValue(worker);
});
const renderPlayer = sources => render(<MemoryRouter><VideoPlayer title="Episódio teste" sources={sources} /></MemoryRouter>);
test('MKV assinado é carregado diretamente no DPlayer e busca legendas ao reproduzir', () => {
  renderPlayer([{ url: mkv }]);
  expect(DPlayer.mock.calls[0][0].video).toMatchObject({ url: mkv, type: 'normal' });
  const player = DPlayer.mock.results[0].value;
  act(() => player.handlers.play());
  expect(worker.postMessage).toHaveBeenCalledWith({ type: 'start', url: expect.stringContaining('/api/media/discord?url=') });
  expect(screen.getByRole('button', { name: 'Interromper busca' })).toBeInTheDocument();
});
test('seleciona português, adiciona falas sincronizadas e permite desativar legendas', () => {
  renderPlayer([{ url: mkv }]);
  fireEvent.click(screen.getByRole('button', { name: 'Buscar legendas' }));
  act(() => {
    worker.onmessage({ data: { type: 'track', track: { number: 1, language: 'en', supported: true } } });
    worker.onmessage({ data: { type: 'track', track: { number: 6, language: 'pt-BR', supported: true } } });
    worker.onmessage({ data: { type: 'cues', cues: [{ track: 6, start: 2, end: 4, text: 'Olá!' }] } });
  });
  expect(screen.getByLabelText('Idioma da legenda')).toHaveValue('6');
  const player = DPlayer.mock.results[0].value;
  const native = player.video.addTextTrack.mock.results[1].value;
  expect(native.mode).toBe('showing'); expect(native.cues[0]).toMatchObject({ startTime: 2, endTime: 4, text: 'Olá!' });
  fireEvent.change(screen.getByLabelText('Idioma da legenda'), { target: { value: '' } });
  expect(native.mode).toBe('disabled');
});
test('interrompe a busca e libera player e worker ao trocar a fonte', () => {
  renderPlayer([{ url: mkv, resolution: 'FHD' }, { url: 'https://example.com/video.mp4', resolution: 'HD' }]);
  fireEvent.click(screen.getByRole('button', { name: 'Buscar legendas' }));
  fireEvent.click(screen.getByRole('button', { name: 'Interromper busca' }));
  expect(worker.postMessage).toHaveBeenCalledWith({ type: 'stop' });
  const old = DPlayer.mock.results[0].value;
  fireEvent.change(screen.getByLabelText('Fonte / qualidade'), { target: { value: '1' } });
  expect(old.destroy).toHaveBeenCalled(); expect(worker.terminate).toHaveBeenCalled();
  expect(screen.queryByText('Legendas do MKV')).not.toBeInTheDocument();
});
test('embeds existentes continuam em iframe e não iniciam extração', () => {
  renderPlayer([{ url: 'https://example.com/embed/123' }]);
  expect(screen.getByTitle('Episódio teste')).toHaveAttribute('src', 'https://example.com/embed/123');
  expect(DPlayer).not.toHaveBeenCalled(); expect(createSubtitleWorker).not.toHaveBeenCalled();
});
test('sem fonte válida mostra mensagem em vez de acessar um índice inexistente', () => {
  renderPlayer([]); expect(screen.getByRole('alert')).toHaveTextContent('Nenhuma fonte');
});

test('aparência aplica sombra, fundo, cor e tamanho sem reiniciar vídeo ou extração', () => {
  const { container } = renderPlayer([{ url: mkv }]);
  fireEvent.click(screen.getByRole('button', { name: 'Buscar legendas' }));
  fireEvent.click(screen.getByText('Configurações da legenda'));
  const rule = () => container.querySelector('style[data-subtitle-appearance]').textContent;
  expect(rule()).toContain('text-shadow: none');
  expect(rule()).toContain('background-color: transparent');
  fireEvent.change(screen.getByLabelText('Sombreamento da legenda'), { target: { value: 'outline' } });
  fireEvent.change(screen.getByLabelText('Cor da legenda'), { target: { value: 'yellow' } });
  fireEvent.change(screen.getByLabelText('Tamanho da legenda'), { target: { value: 'large' } });
  fireEvent.change(screen.getByLabelText('Fundo da legenda'), { target: { value: 'soft' } });
  expect(rule()).toContain('text-shadow: -1px -1px 0 #000000');
  expect(rule()).toContain('color: #ffe45c');
  expect(rule()).toContain('font-size: 1.45em');
  expect(rule()).toContain('background-color: rgba(0,0,0,0.55)');
  expect(screen.getByLabelText('Prévia da legenda').firstChild).toHaveStyle({ color: '#ffe45c', fontSize: '1.45em' });
  expect(DPlayer).toHaveBeenCalledTimes(1);
  expect(worker.postMessage).toHaveBeenCalledTimes(1);
});
test('preferências persistem nos próximos episódios e podem voltar ao padrão', () => {
  const first = renderPlayer([{ url: mkv }]);
  fireEvent.change(screen.getByLabelText('Sombreamento da legenda'), { target: { value: 'soft' } });
  first.unmount();
  renderPlayer([{ url: mkv }]);
  expect(screen.getByLabelText('Sombreamento da legenda')).toHaveValue('soft');
  fireEvent.click(screen.getByText('Configurações da legenda'));
  fireEvent.click(screen.getByRole('button', { name: 'Restaurar padrão' }));
  expect(screen.getByLabelText('Sombreamento da legenda')).toHaveValue('none');
  expect(screen.getByLabelText('Fundo da legenda')).toHaveValue('none');
  expect(JSON.parse(localStorage.getItem('gontv.subtitle-appearance.v1')).shadow).toBe('none');
});
test('preferências inválidas são ignoradas e não entram no CSS das legendas', () => {
  localStorage.setItem('gontv.subtitle-appearance.v1', JSON.stringify({ color: 'red; display:none', size: 'giant', shadow: 'unknown' }));
  const { container } = renderPlayer([{ url: mkv }]);
  expect(screen.getByLabelText('Cor da legenda')).toHaveValue('white');
  expect(screen.getByLabelText('Sombreamento da legenda')).toHaveValue('none');
  expect(container.querySelector('style[data-subtitle-appearance]').textContent).not.toContain('display:none');
});
