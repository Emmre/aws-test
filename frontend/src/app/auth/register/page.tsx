"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../services/authService';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(name, email, password);
      setToken(data.token);
      toast.success('Registration successful!', { theme: 'colored' });
      router.push('/todos');
    } catch (err: any) {
      const msg = err?.response?.data?.msg || err?.message || 'Registration failed';
      setError(msg);
      toast.error(msg, { theme: 'colored' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md p-8 rounded shadow" style={{ background: 'var(--input-bg)', color: 'var(--foreground)' }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--primary)' }}>Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" className="input input-bordered" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" className="input input-bordered" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="input input-bordered" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
        </form>
        {error && <div className="mt-4 text-center" style={{ color: 'var(--error)' }}>{error}</div>}
      </div>
    </div>
  );
}
