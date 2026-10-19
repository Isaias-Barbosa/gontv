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

const originalMode = process.env.NODE_ENV;
const originalUrl = process.env.REACT_APP_API_URL;

afterEach(() => {
  process.env.NODE_ENV = originalMode;
  if (originalUrl === undefined) delete process.env.REACT_APP_API_URL;
  else process.env.REACT_APP_API_URL = originalUrl;
  jest.resetModules();
});

test('production without an override uses the current origin, development keeps the local API', () => {
  delete process.env.REACT_APP_API_URL;
  process.env.NODE_ENV = 'production';
  jest.resetModules();
  expect(require('./api').apiBaseUrl).toBe('');
  process.env.NODE_ENV = 'development';
  jest.resetModules();
  expect(require('./api').apiBaseUrl).toBe('http://127.0.0.1:3001');
});

test('an explicit API override remains supported', () => {
  process.env.REACT_APP_API_URL = 'https://api.example.com/';
  jest.resetModules();
  expect(require('./api').apiBaseUrl).toBe('https://api.example.com');
});
