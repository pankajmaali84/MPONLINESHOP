import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getRoleFromToken, isTokenExpired } from '../utils/auth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || window.location.origin;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      const token = res.data?.token;
      if (!token) throw new Error('No token received');
      const role = getRoleFromToken(token);
      if (isTokenExpired(token) || role !== 'admin') {
        setError('Only admins can login here.');
        return;
      }
      localStorage.setItem('token', token);
      try { window.dispatchEvent(new Event('auth:changed')); } catch {}
      navigate('/admin');
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-white/5 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Admin Login</h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100" />
        </div>
        <button disabled={loading} className="w-full py-2 rounded bg-blue-600 text-white disabled:opacity-60">{loading ? 'Logging in...' : 'Login as Admin'}</button>
      </form>
    </div>
  );
};

export default AdminLogin;
