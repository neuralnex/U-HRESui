import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { AuthResponse } from '../services/auth.service';

interface User {
  id: string;
  hospitalCode?: string;
  username?: string;
  name?: string;
  email?: string;
  role: 'doctor' | 'admin' | 'lab' | 'central';
  permissions?: string[];
  isSuperAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (role: 'doctor' | 'admin' | 'lab' | 'central', credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (role: 'doctor' | 'admin' | 'lab' | 'central', credentials: any) => {
    try {
      let response: AuthResponse;

      if (role === 'central' || role === 'admin') {
        response = await authService.loginAdmin(credentials);
        if (response.success && response.data.admin) {
          const admin = response.data.admin;
          const userData: User = {
            id: admin.id,
            username: admin.username,
            name: `${admin.firstName} ${admin.lastName}`,
            email: admin.email,
            role: role === 'central' ? 'central' : 'admin',
            permissions: admin.permissions,
            isSuperAdmin: admin.isSuperAdmin,
          };
          setUser(userData);
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        response = await authService.loginHospital(credentials);
        if (response.success && response.data.hospital) {
          const hospital = response.data.hospital;
          const userData: User = {
            id: hospital.id,
            hospitalCode: hospital.hospitalCode,
            name: hospital.name,
            email: hospital.email,
            role: role === 'lab' ? 'lab' : 'doctor',
          };
          setUser(userData);
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

