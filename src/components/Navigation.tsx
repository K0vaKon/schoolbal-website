'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Camera, Upload, Settings } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-blue-600">
              Schoolbal
            </Link>
            <div className="flex gap-6">
              <Link
                href="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive('/') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Camera size={20} />
                <span>Hoofdpagina</span>
              </Link>
              <Link
                href="/upload"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive('/upload') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Upload size={20} />
                <span>Uploaden</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive('/admin') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Settings size={20} />
                  <span>Beheer</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
