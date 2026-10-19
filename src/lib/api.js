export const apiBaseUrl = (process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:3001')).replace(/\/$/, '');
const tokenKey = 'gontv.admin.session';
export const getToken = () => sessionStorage.getItem(tokenKey);
export const storeToken = token => token ? sessionStorage.setItem(tokenKey, token) : sessionStorage.removeItem(tokenKey);
export async function apiRequest(path, options = {}) {
  const { anonymous, ...requestOptions } = options;
  const token = anonymous ? null : getToken();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...requestOptions,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({ error: 'A API retornou uma resposta inválida.' }));
  if (!response.ok) {
    if (response.status === 401 && token) { storeToken(null); window.dispatchEvent(new Event('gontv:session-expired')); }
    throw new Error(payload.error || 'Não foi possível concluir a operação.');
  }
  return payload;
}
