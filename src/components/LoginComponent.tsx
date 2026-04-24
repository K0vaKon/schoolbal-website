'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './LoginComponent.module.css';

type LoginComponentVariant = 'header' | 'page';

export const LoginComponent: React.FC<{ variant?: LoginComponentVariant }> = ({
  variant = 'page',
}) => {
  const { user, login, logout, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, name);
      setEmail('');
      setName('');

      const from = searchParams.get('from');
      if (pathname === '/login') {
        router.replace(from || '/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (user) {
    const from = searchParams.get('from');
    if (pathname === '/login') {
      router.replace(from || '/');
      return null;
    }

    return (
      <div className={styles.userWrap}>
        <div className={styles.userMeta}>
          <p className={styles.userName}>{user.name}</p>
          <p className={styles.userRole}>{user.role === 'admin' ? 'Beheerder' : 'Gebruiker'}</p>
        </div>
        <button onClick={logout} className={styles.logoutButton} title="Afmelden">
          <LogOut size={20} strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  if (variant === 'header') {
    const from = searchParams.get('from');
    const href = from ? `/login?from=${encodeURIComponent(from)}` : '/login';

    return (
      <Link
        href={href}
        className={styles.logoutButton}
        title="Inloggen"
      >
        <LogIn size={18} strokeWidth={1.5} />
        <span className="hidden sm:inline">Inloggen</span>
      </Link>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <User className="w-12 h-12 text-blue-400 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className={styles.title}>Welkom bij Schoolbal</h2>
          <p className={styles.subtitle}>Log in om foto's te bekijken en uploaden</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="email" className={styles.label}>
              E-mailadres
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="jouw@email.nl"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className={styles.label}>
              Naam
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Jouw naam"
              required
            />
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              <LogIn size={18} strokeWidth={1.5} />
              {isSubmitting ? 'Inloggen...' : 'Inloggen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
