import { apiRequest, storeToken, getToken } from './api';
beforeEach(() => { sessionStorage.clear(); global.fetch = jest.fn(); });
afterEach(() => { delete global.fetch; });
test('consulta pública não envia nem revoga a sessão administrativa', async () => {
  storeToken('private-session');
  fetch.mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'indisponível' }) });
  await expect(apiRequest('/api/animes/public', { anonymous: true })).rejects.toThrow('indisponível');
  expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  expect(fetch.mock.calls[0][1].anonymous).toBeUndefined();
  expect(getToken()).toBe('private-session');
});
test('painel continua enviando a sessão autenticada', async () => {
  storeToken('private-session');
  fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ animes: [] }) });
  await apiRequest('/api/animes');
  expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer private-session');
});
