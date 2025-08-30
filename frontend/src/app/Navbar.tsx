"use client";
import React from 'react';
import { useAuth } from './auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { token, setToken } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setToken(null);
    router.push('/auth/login');
  };

  return (
    <nav className="w-full shadow mb-8" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="font-bold text-xl" style={{ color: 'var(--primary)' }}>TodoPro</a>
        <div className="flex gap-4 items-center">
          <a href="/todos" className="hover:underline" style={{ color: 'var(--primary-dark)' }}>Todos</a>
          {!token ? (
            <>
              <a href="/auth/login" className="hover:underline" style={{ color: 'var(--primary-dark)' }}>Login</a>
              <a href="/auth/register" className="hover:underline" style={{ color: 'var(--secondary-dark)' }}>Register</a>
            </>
          ) : (
            <button className="btn btn-error btn-sm" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}
