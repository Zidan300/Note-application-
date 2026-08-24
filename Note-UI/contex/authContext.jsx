/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../src/api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    const expire = () => logout();
    window.addEventListener('auth:expired', expire);
    return () => window.removeEventListener('auth:expired', expire);
  }, []);

  const authenticate = async (method, values) => {
    const result = await method(values);
    if (!result.token) throw new Error('The server returned an invalid authentication response');
    localStorage.setItem('token', result.token);
    setToken(result.token);
    return result;
  };

  const value = useMemo(() => ({ token, isAuthenticated: Boolean(token), login: (v) => authenticate(authApi.login, v), signup: (v) => authenticate(authApi.signup, v), logout }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
