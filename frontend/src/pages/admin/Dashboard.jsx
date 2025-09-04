import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatsSummary, getTodayStats } from '../../services/adminApi';

const StatCard = ({ label, value, color = 'bg-blue-600', onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg p-4 text-white text-left ${color} ${onClick ? 'hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer' : ''}`}
  >
    <div className="text-sm opacity-90">{label}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </button>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    totalUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    blockedUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    successCount: 0,
  });
  const [today, setToday] = useState({ date: '', ordersToday: 0, revenueToday: 0, breakdown: { pan: 0, income: 0 } });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [summary, t] = await Promise.all([
          getStatsSummary(),
          getTodayStats(),
        ]);
        if (mounted) {
          setData(summary);
          setToday(t);
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load stats');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <div className="text-sm text-gray-600 dark:text-gray-300">Loading dashboard...</div>
      </div>
    </div>
  );
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Users" value={data.totalUsers} color="bg-slate-800" onClick={() => navigate('/admin/users')} />
        <StatCard label="Total Requests" value={data.totalRequests} color="bg-blue-600" onClick={() => navigate('/admin/orders')} />
        <StatCard label="Pending Requests" value={data.pendingRequests} color="bg-amber-600" onClick={() => navigate('/admin/orders?status=pending&openFirst=1')} />
        <StatCard label="Success" value={data.successCount} color="bg-green-600" onClick={() => navigate('/admin/orders?status=success&openFirst=1')} />
        <StatCard label="Blocked Users" value={data.blockedUsers} color="bg-red-600" onClick={() => navigate('/admin/users?status=blocked')} />
        <StatCard label="Total Orders" value={data.totalOrders} color="bg-emerald-600" onClick={() => navigate('/admin/orders')} />
        <StatCard label="Total Revenue" value={`₹${data.totalRevenue}`} color="bg-indigo-600" onClick={() => navigate('/admin/orders?status=success&openFirst=1')} />
      </div>

      <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="font-medium">Today's Summary</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{today.date ? new Date(today.date).toLocaleDateString() : ''}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <div className="rounded-lg p-3 bg-emerald-50 dark:bg-emerald-900/30">
            <div className="text-xs text-emerald-800 dark:text-emerald-200">Orders Today</div>
            <div className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">{today.ordersToday}</div>
          </div>
          <div className="rounded-lg p-3 bg-indigo-50 dark:bg-indigo-900/30">
            <div className="text-xs text-indigo-800 dark:text-indigo-200">Revenue Today</div>
            <div className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">₹{today.revenueToday}</div>
          </div>
          <div className="rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
            <div className="text-xs text-slate-700 dark:text-slate-300">PAN</div>
            <div className="text-xl font-semibold">{today.breakdown?.pan || 0}</div>
          </div>
          <div className="rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
            <div className="text-xs text-slate-700 dark:text-slate-300">Income Cert</div>
            <div className="text-xl font-semibold">{today.breakdown?.income || 0}</div>
          </div>
        </div>
      </div>

      {/* Charts placeholders removed */}

      {/* Revenue and Pending breakdowns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
          <div className="font-medium mb-3">Revenue Overview</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="rounded-lg p-3 bg-indigo-50 dark:bg-indigo-900/30">
              <div className="text-xs text-indigo-800 dark:text-indigo-200">Gross</div>
              <div className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">₹{data?.revenue?.gross || data.totalRevenue || 0}</div>
            </div>
            <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-900/30">
              <div className="text-xs text-amber-800 dark:text-amber-200">Pending Value</div>
              <div className="text-xl font-semibold text-amber-900 dark:text-amber-100">₹{data?.revenue?.pendingValue || 0}</div>
            </div>
            <div className="rounded-lg p-3 bg-emerald-50 dark:bg-emerald-900/30">
              <div className="text-xs text-emerald-800 dark:text-emerald-200">Currency</div>
              <div className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">{data?.revenue?.currency || 'INR'}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-700 dark:text-slate-300 mb-2">PAN</div>
              <div className="flex items-center justify-between text-sm">
                <span>Success</span>
                <button
                  className="font-semibold text-blue-600 hover:underline"
                  onClick={() => navigate('/admin/orders?status=success&q=pan&openFirst=1')}
                >₹{data?.revenue?.byService?.pan?.success || 0}</button>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>Pending</span>
                <button
                  className="font-semibold text-blue-600 hover:underline"
                  onClick={() => navigate('/admin/orders?status=pending&q=pan&openFirst=1')}
                >₹{data?.revenue?.byService?.pan?.pending || 0}</button>
              </div>
            </div>
            <div className="rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-700 dark:text-slate-300 mb-2">Income Certificate</div>
              <div className="flex items-center justify-between text-sm">
                <span>Success</span>
                <button
                  className="font-semibold text-blue-600 hover:underline"
                  onClick={() => navigate('/admin/orders?status=success&q=income&openFirst=1')}
                >₹{data?.revenue?.byService?.income?.success || 0}</button>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>Pending</span>
                <button
                  className="font-semibold text-blue-600 hover:underline"
                  onClick={() => navigate('/admin/orders?status=pending&q=income&openFirst=1')}
                >₹{data?.revenue?.byService?.income?.pending || 0}</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
          <div className="font-medium mb-3">Pending Overview</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-900/30">
              <div className="text-xs text-amber-800 dark:text-amber-200">Total Pending</div>
              <button
                className="text-xl font-semibold text-amber-900 dark:text-amber-100 hover:underline"
                onClick={() => navigate('/admin/orders?status=pending')}
              >{data?.pending?.total || data.pendingRequests || 0}</button>
            </div>
            <div className="rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-700 dark:text-slate-300">PAN</div>
              <button
                className="text-xl font-semibold hover:underline"
                onClick={() => navigate('/admin/orders?status=pending&q=pan&openFirst=1')}
              >{data?.pending?.byService?.pan || 0}</button>
            </div>
            <div className="rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-700 dark:text-slate-300">Income Cert</div>
              <button
                className="text-xl font-semibold hover:underline"
                onClick={() => navigate('/admin/orders?status=pending&q=income&openFirst=1')}
              >{data?.pending?.byService?.income || 0}</button>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm mb-2 text-gray-600 dark:text-gray-300">Top users with pending</div>
            <div className="divide-y dark:divide-gray-700 rounded-lg border dark:border-gray-700 overflow-hidden">
              {(data?.pending?.topUsers || []).length === 0 ? (
                <div className="p-3 text-sm text-gray-500">No pending users</div>
              ) : (
                (data?.pending?.topUsers || []).map((u, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{u.name || '(Unknown)'}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 dark:text-gray-300">Pending: {u.count}</span>
                      <button
                        className="px-2 py-1 rounded text-xs bg-blue-600 text-white"
                        onClick={() => navigate(`/admin/orders?status=pending&openFirst=1&q=${encodeURIComponent(u.email || u.name)}`)}
                      >View</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
        <div className="font-medium mb-3">Recent Activity</div>
        <div className="text-gray-500 text-sm">Recent products/orders will appear here.</div>
      </div>
    </div>
  );
}
