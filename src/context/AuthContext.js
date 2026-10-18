import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiRequest, getToken, storeToken } from 'lib/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (getToken()) apiRequest('/api/auth/me').then(data => { if (active) setUser(data.user); }).catch(() => { storeToken(null); }).finally(() => { if (active) setLoading(false); });
    else setLoading(false);
    const expired = () => { setUser(null); setLoading(false); };
    window.addEventListener('gontv:session-expired', expired);
    return () => { active = false; window.removeEventListener('gontv:session-expired', expired); };
  }, []);
  const login = useCallback(async (email, password) => {
    const data = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    storeToken(data.token); setUser(data.user); return data.user;
  }, []);
  const logout = useCallback(async () => {
    try { await apiRequest('/api/auth/logout', { method: 'POST' }); }
    finally { storeToken(null); setUser(null); }
  }, []);
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
