import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../../context/LanguageContext.jsx';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [sendingId, setSendingId] = useState('');
  const [email, setEmail] = useState('');
  const API = import.meta.env.VITE_API_URL || window.location.origin;
  const { t } = useContext(LanguageContext);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const loadForms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/admin/forms`, authHeader);
      setForms(res.data?.forms || []);
    } catch (e) {
      console.error('Failed to load forms', e);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const notify = async (id, type) => {
    try {
      const customMessage = window.prompt('Optional custom message to include (or leave blank):', '');
      setSendingId(id + ':' + type);
      await axios.post(`${API}/api/admin/forms/${id}/notify`, { type, customMessage }, authHeader);
      toast.success('Notification sent');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send');
    } finally {
      setSendingId('');
    }
  };

  const makeAdmin = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await axios.put(`${API}/api/creatAdmin/make-admin/${encodeURIComponent(email)}`, {}, authHeader);
      alert(t('promote_user'));
      setEmail('');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to promote');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 pb-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('admin_dashboard')}</h1>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow border border-white/5 p-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{t('promote_user')}</h2>
          <form onSubmit={makeAdmin} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('user_email')}
              className="flex-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100"
              required
            />
            <button
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
            >
              {t('make_admin')}
            </button>
          </form>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow border border-white/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('all_applications')}</h2>
            <button onClick={loadForms} className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">{t('refresh')}</button>
          </div>
          {loading ? (
            <p className="text-gray-700 dark:text-gray-300">{t('loading')}</p>
          ) : forms.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300">{t('no_forms')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {forms.map((f) => {
                const date = f.createdAt ? new Date(f.createdAt) : null;
                const dateStr = date ? date.toLocaleDateString() + ' • ' + date.toLocaleTimeString() : '-';
                const isPan = (f.service || '').toLowerCase().includes('pan');
                const accentBar = isPan ? 'from-blue-500 to-indigo-500' : 'from-emerald-500 to-teal-500';
                const iconBg = isPan ? 'bg-blue-500/15 text-blue-500 border-blue-500/30' : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
                const badge =
                  f.status === 'approved' ? 'bg-green-500/15 text-green-600 border-green-500/40' :
                  f.status === 'rejected' ? 'bg-red-500/15 text-red-500 border-red-500/40' :
                  f.status === 'in_review' ? 'bg-amber-500/15 text-amber-600 border-amber-500/40' :
                  'bg-gray-500/10 text-gray-500 border-gray-400/30';
                const headerTitle = isPan ? `${t('service_pan_title')} ${t('application_suffix')}` : t('service_income_title');

                return (
                  <div
                    key={f._id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-lg bg-white/70 dark:bg-gray-900/60 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    {/* Header Gradient with Title */}
                    <div className={`relative h-24 w-full bg-gradient-to-r ${accentBar}`}>
                      <div className="absolute inset-0 flex items-center px-6">
                        <h3 className="text-white text-lg sm:text-xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                          {headerTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="-mt-10 px-6 pb-6 pt-2 text-gray-900 dark:text-gray-100">
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${iconBg} shadow-sm`}> 
                          {/* Icon */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                            {isPan ? (
                              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            ) : (
                              <path d="M12 3a9 9 0 100 18 9 9 0 000-18Zm1 5h-2v5h5v-2h-3V8Z" />
                            )}
                          </svg>
                          <span className="text-xs font-medium tracking-wide">{isPan ? t('type_pan') : t('type_income')}</span>
                        </div>
                        <span className={`text-xs border px-2.5 py-1 rounded-full ${badge}`}>{f.status}</span>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        <h3 className="text-lg font-semibold leading-6">{f.service}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t('applicant')}: <span className="font-medium">{f.applicantName}</span></p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t('submitted')}: <span className="font-medium">{dateStr}</span></p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg border border-white/10 bg-white/40 dark:bg-gray-800/40 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('contact_label_text')}</p>
                          <p className="font-medium">{f.contactNumber || '-'}</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/40 dark:bg-gray-800/40 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('submitted_by')}</p>
                          <p className="font-medium truncate" title={f.user?.email || ''}>{f.user?.email || '-'}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                          onClick={() => notify(f._id, 'tomorrow')}
                          disabled={!!sendingId}
                          className="px-3 py-1.5 rounded-md text-xs font-medium border border-green-500/40 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white transition disabled:opacity-60"
                        >
                          {sendingId === f._id + ':tomorrow' ? 'Sending…' : 'Notify: Tomorrow'}
                        </button>
                        <button
                          onClick={() => notify(f._id, 'delay')}
                          disabled={!!sendingId}
                          className="px-3 py-1.5 rounded-md text-xs font-medium border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white transition disabled:opacity-60"
                        >
                          {sendingId === f._id + ':delay' ? 'Sending…' : 'Notify: Delay (1–3 days)'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
