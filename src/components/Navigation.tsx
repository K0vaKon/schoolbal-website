'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Camera, Upload, Settings } from 'lucide-react';
import styles from './Navigation.module.css';

export const Navigation: React.FC = () => {
  const { isAdmin } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <Link href="/" className={styles.brand}>
              Schoolbal
            </Link>
            <div className={styles.links}>
              <Link
                href="/"
                className={`${styles.linkBase} ${isActive('/') ? styles.linkActive : styles.linkInactive}`}
              >
                <Camera size={18} strokeWidth={1.5} />
                <span className="hidden sm:inline">Galerij</span>
              </Link>
              <Link
                href="/upload"
                className={`${styles.linkBase} ${isActive('/upload') ? styles.linkActive : styles.linkInactive}`}
              >
                <Upload size={18} strokeWidth={1.5} />
                <span className="hidden sm:inline">Uploaden</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`${styles.linkBase} ${isActive('/admin') ? styles.linkActive : styles.linkInactive}`}
                >
                  <Settings size={18} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Beheer</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
