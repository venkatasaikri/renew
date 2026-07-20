'use client';

import { useState } from 'react';
import { useRegisterMutation } from '@/store/apiSlice';
import { useAppDispatch } from '@/store/storeHooks';
import { setCredentials } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    try {
      const response = await register({ username, password }).unwrap();
      if (response && response.user) {
        dispatch(setCredentials({ user: response.user }));
        router.push('/admin');
      } else {
        setRegisterError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Failed to register', err);
      setRegisterError(err?.data?.message || err?.message || 'Failed to register');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>CMS Admin Register</h2>
        {registerError && <p className="error">{registerError}</p>}
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
            minLength={4}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={4}
          />
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link href="/admin/login">Login here</Link>
        </div>
      </form>
    </div>
  );
}
