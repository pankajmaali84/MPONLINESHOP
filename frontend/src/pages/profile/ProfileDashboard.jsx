import React, { useEffect, useMemo, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LanguageContext } from '../../context/LanguageContext.jsx';

const ProfileDashboard = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const API = import.meta.env.VITE_API_URL || window.location.origin;
  const token = localStorage.getItem('token');
  const authHeader = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` }}), [token]);

  // TEMPORARILY DISABLED: Dashboard is commented out for now
  // We return null to avoid rendering this page while keeping code for later reuse
  return null;

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const [panRes, incomeRes] = await Promise.all([
          axios.get(`${API}/api/pan/myAllPan`, authHeader),
          axios.get(`${API}/api/income/myAll`, authHeader),
        ]);

        const pan = (panRes.data?.forms || panRes.data || []).map((f) => ({
          _id: f._id,
          type: 'pan',
          service: f.serviceTitle || t('service_pan_title'),
          applicantName: f.name || f.applicantName || '-',
          contactNumber: f.mobile || f.contactNumber || '-',
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
          status: f.status || 'submitted',
          raw: f,
        }));

        const income = (incomeRes.data?.forms || incomeRes.data || []).map((f) => ({
          _id: f._id,
          type: 'income',
          service: f.serviceTitle || t('service_income_title'),
          applicantName: f.name || f.applicantName || '-',
          contactNumber: f.mobile || f.contactNumber || '-',
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
          status: f.status || 'submitted',
          raw: f,
        }));

        const combined = [...pan, ...income].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (isMounted) setItems(combined);
      } catch (e) {
        console.error(e);
        if (isMounted) setError(e.response?.data?.message || 'Failed to load');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [API, authHeader, t]);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVar = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  };

  const handleDelete = async (it) => {
    const ok = window.confirm('Delete this application?');
    if (!ok) return;
    try {
      const url = it.type === 'pan' ? `${API}/api/pan/${it._id}` : `${API}/api/income/${it._id}`;
      await axios.delete(url, authHeader);
      toast.success('Deleted');
      setItems((prev) => prev.filter((x) => x._id !== it._id));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  const handleUpdate = (it) => {
    // Navigate to ApplyForm in edit mode with prefilled data
    navigate('/apply', {
      state: {
        edit: true,
        type: it.type,
        id: it._id,
        serviceTitle: it.service,
        editItem: it.raw,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>{t('profile')}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">• {items.length} {t('all_applications').toLowerCase()}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{t('apply_started')} {t('service_pan_title')} / {t('service_income_title')}</p>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 text-red-700 px-4 py-2 dark:bg-red-900/20 dark:border-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-gray-200/60 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">{t('no_forms')}</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((it) => {
              const isPan = it.type === 'pan';
              const accent = isPan ? 'from-blue-500 to-indigo-500' : 'from-emerald-500 to-teal-500';
              const badge =
                it.status === 'approved' ? 'bg-green-500/15 text-green-600 border-green-500/40' :
                it.status === 'rejected' ? 'bg-red-500/15 text-red-500 border-red-500/40' :
                it.status === 'in_review' ? 'bg-amber-500/15 text-amber-600 border-amber-500/40' :
                'bg-gray-500/10 text-gray-500 border-gray-400/30';
              const cAt = it.createdAt ? new Date(it.createdAt) : null;
              const uAt = it.updatedAt ? new Date(it.updatedAt) : null;
              const isUpdated = uAt && cAt && uAt.getTime() - cAt.getTime() > 2000; // >2s difference implies updated
              const shown = isUpdated ? uAt : cAt;
              const dateStr = shown ? shown.toLocaleDateString() + ' • ' + shown.toLocaleTimeString() : '-';

              return (
                <motion.div key={it._id} variants={itemVar} className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg bg-white dark:bg-gray-900">
                  <div className={`relative h-24 w-full bg-gradient-to-r ${accent}`}>
                    <div className="absolute inset-0 flex items-center px-6">
                      <h3 className="text-white text-lg font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                        {isPan ? `${t('service_pan_title')} ${t('application_suffix')}` : t('service_income_title')}
                      </h3>
                    </div>
                  </div>
                  <div className="-mt-10 px-6 pb-6 pt-2 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${isPan ? 'bg-blue-500/15 text-blue-500 border-blue-500/30' : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                          {isPan ? (
                            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          ) : (
                            <path d="M12 3a9 9 0 100 18 9 9 0 000-18Zm1 5h-2v5h5v-2h-3V8Z" />
                          )}
                        </svg>
                        <span className="text-xs font-medium tracking-wide">{isPan ? t('type_pan') : t('type_income')}</span>
                      </div>
                      <span className={`text-xs border px-2.5 py-1 rounded-full ${badge}`}>{it.status}</span>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <h3 className="text-lg font-semibold leading-6">{it.service}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('applicant')}: <span className="font-medium">{it.applicantName}</span></p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t(isUpdated ? 'updated' : 'submitted')}: <span className="font-medium">{dateStr}</span></p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      {/* Left column details */}
                      <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Father</p>
                        <p className="font-medium">{it.raw?.parentName || '-'}</p>
                      </div>
                      {isPan ? (
                        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Mother</p>
                          <p className="font-medium">{it.raw?.motherName || '-'}</p>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Income</p>
                          <p className="font-medium">{it.raw?.incomeAmount != null ? `₹${it.raw.incomeAmount}` : '-'}</p>
                        </div>
                      )}
                      {isPan ? (
                        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">DOB / Gender</p>
                          <p className="font-medium">{[it.raw?.dob, it.raw?.gender].filter(Boolean).join(' • ') || '-'}</p>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Samagra ID</p>
                          <p className="font-medium">{it.raw?.samagraId || '-'}</p>
                        </div>
                      )}
                      <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Aadhaar</p>
                        <p className="font-medium">{it.raw?.aadhar || '-'}</p>
                      </div>
                      <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('contact_label_text')}</p>
                        <p className="font-medium">{it.contactNumber}</p>
                      </div>
                      {isPan && (
                        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3 sm:col-span-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Email / Address</p>
                          <p className="font-medium truncate" title={it.raw?.email || ''}>{[it.raw?.email, it.raw?.address].filter(Boolean).join(' • ') || '-'}</p>
                        </div>
                      )}
                      <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-3 sm:col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                        <p className="font-medium truncate" title={it._id}>{it._id}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUpdate(it)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition"
                      >
                        {t('update')}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDelete(it)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition"
                      >
                        {t('delete')}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
