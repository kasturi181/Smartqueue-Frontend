import { createContext, useContext, useState, useEffect } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);      // admin info
  const [token, setToken] = useState(null);      // JWT string
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const saved = localStorage.getItem('admin_token');
    const info  = localStorage.getItem('admin_info');
    if (saved && info) {
      setToken(saved);
      setAdmin(JSON.parse(info));
    }
    setLoading(false);
  }, []);

  const login = (tokenStr, adminInfo) => {
    localStorage.setItem('admin_token', tokenStr);
    localStorage.setItem('admin_info',  JSON.stringify(adminInfo));
    setToken(tokenStr);
    setAdmin(adminInfo);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    setToken(null); setAdmin(null);
  };

  return (
    <AuthCtx.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);