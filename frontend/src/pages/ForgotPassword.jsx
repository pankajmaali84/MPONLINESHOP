import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext.jsx';

const ForgotPassword = () => {
  const { t } = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || window.location.origin;

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Email and new password are required');
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API}/api/auth/forgot-password`, { email: email.trim(), newPassword: password.trim() });
      toast.success('Password reset successful. Please login.');
      setTimeout(() => navigate('/login'), 800);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/60 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Reset your password to regain access.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100" required />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100" required />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Link to="/login" className="text-sm text-blue-500 hover:text-blue-400">Back to Login</Link>
            <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} disabled={loading} className={`px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
