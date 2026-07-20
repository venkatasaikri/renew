'use client';

import { useState } from 'react';
import { useLoginMutation } from '@/store/apiSlice';
import { useAppDispatch } from '@/store/storeHooks';
import { setCredentials } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await login({ username, password }).unwrap();
      if (response && response.user) {
        dispatch(setCredentials({ user: response.user }));
        router.push('/admin');
      } else {
        setLoginError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Failed to log in', err);
      setLoginError(err?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>CMS Admin Login</h2>
        {loginError && <p className="error">{loginError}</p>}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don&apos;t have an account? </span>
          <Link href="/admin/register">Register here</Link>
        </div>
      </form>
    </div>
  );
}
