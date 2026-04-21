'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types';
import { storageUtils, initializeStorage } from '@/lib/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    const savedUser = storageUtils.getCurrentUser();
    setUser(savedUser);
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
  };

  const logout = (): void => {
    setUser(null);
    storageUtils.setCurrentUser(null);
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
