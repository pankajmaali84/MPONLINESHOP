import React, { useEffect, useMemo, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { LanguageContext } from '../../context/LanguageContext.jsx';

const MyProfile = () => {
  const { t } = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);

  const API = import.meta.env.VITE_API_URL || window.location.origin;
  const token = localStorage.getItem('token');
  const authHeader = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API}/api/profile/me`, authHeader);
        const u = res.data?.user || res.data;
        if (alive) {
          setUser(u);
          setForm({ name: u?.name || '', email: u?.email || '' });
        }
      } catch (e) {
        if (alive) setError(e.response?.data?.message || 'Failed to load profile');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [API, authHeader]);

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.email?.trim()) {
      toast.error('Please fill name and email');
      return;
    }
    try {
      setSaving(true);
      await axios.put(`${API}/api/profile/me`, { name: form.name.trim(), email: form.email.trim() }, authHeader);
      toast.success('Profile updated');
      setUser((u) => ({ ...u, name: form.name.trim(), email: form.email.trim() }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 pb-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('profile_my_profile')}</h1>
        {error && <div className="mb-4 rounded border border-red-300 bg-red-50 text-red-700 px-4 py-2 dark:bg-red-900/20 dark:border-red-800">{error}</div>}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-200/60 dark:bg-gray-800 animate-pulse" />)}
          </div>
        ) : !user ? (
          <p className="text-gray-700 dark:text-gray-300">No profile data.</p>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible" className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-white/5 p-6">
            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('profile_my_profile')}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Name</label>
                <input name="name" value={form.name} onChange={onChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={onChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Role</label>
                <input value={user?.role || 'user'} disabled className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900/50 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100" />
              </div>
              {user?.createdAt && (
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Joined</label>
                  <input value={new Date(user.createdAt).toLocaleString()} disabled className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900/50 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100" />
                </div>
              )}
              <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} disabled={saving} className={`px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  {saving ? 'Updating...' : t('update')}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyProfile;
