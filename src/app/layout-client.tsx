'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { LoginComponent } from '@/components/LoginComponent';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center py-12">Laden...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Schoolbal 📸</h1>
          <LoginComponent />
        </div>
      </header>

      {/* Navigation */}
      {user && <Navigation />}

      {/* Main Content */}
      <main className="flex-1">
        {user ? (
          <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
        ) : (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welkom bij Schoolbal</h2>
              <p className="text-gray-600 mb-4">
                Meld je aan om foto's te zien en te uploaden.
              </p>
              <p className="text-sm text-gray-500">
                Gebruik je e-mailadres om in te loggen
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
