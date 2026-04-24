'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types';
import { storageUtils, initializeStorage } from '@/lib/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_COOKIES = {
  EMAIL: 'schoolbal_email',
  NAME: 'schoolbal_name',
  ROLE: 'schoolbal_role',
} as const;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
  if (!match) return null;
  return decodeURIComponent(match.split('=')[1] ?? '');
}

function setCookie(name: string, value: string, maxAgeDays = 30) {
  if (typeof document === 'undefined') return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    const savedUser = storageUtils.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      const email = getCookie(AUTH_COOKIES.EMAIL);
      const name = getCookie(AUTH_COOKIES.NAME);
      const role = getCookie(AUTH_COOKIES.ROLE) as User['role'] | null;

      if (email && role) {
        const cookieUser: User = {
          id: `user-${email}`,
          email,
          role: role === 'admin' ? 'admin' : 'user',
          name: name || email.split('@')[0],
        };
        setUser(cookieUser);
        storageUtils.setCurrentUser(cookieUser);
      } else {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, name: string): Promise<void> => {
    let role: 'admin' | 'user' = 'user';

    // Check if user is admin (hardcoded admin email)
    if (email === 'admin@schoolbal.nl') {
      role = 'admin';
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role,
      name: name || email.split('@')[0],
    };

    setUser(newUser);
    storageUtils.setCurrentUser(newUser);

    setCookie(AUTH_COOKIES.EMAIL, newUser.email);
    setCookie(AUTH_COOKIES.NAME, newUser.name || '');
    setCookie(AUTH_COOKIES.ROLE, newUser.role);
  };

  const logout = (): void => {
    setUser(null);
    storageUtils.setCurrentUser(null);

    deleteCookie(AUTH_COOKIES.EMAIL);
    deleteCookie(AUTH_COOKIES.NAME);
    deleteCookie(AUTH_COOKIES.ROLE);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'admin' || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
