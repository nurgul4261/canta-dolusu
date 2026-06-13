import { createContext, useContext, useState } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('cantaDolusuUser') || 'null')
  );

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('cantaDolusuUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('cantaDolusuUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cantaDolusuUser');
    setUser(null);
    toast.success('Çıkış yapıldı');
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('cantaDolusuUser', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};
