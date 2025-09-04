import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUsers, blockUser, unblockUser, changeUserRole } from '../../services/adminApi';
import toast from 'react-hot-toast';

export default function Users() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({ search: '', role: '', status: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const load = async (opts = {}) => {
    try {
      setLoading(true);
      const params = { page, limit, ...query, ...opts };
      const res = await getUsers(params);
      setItems(res.items || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
      setPages(res.pages || 1);
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, query.role, query.status]);

  // Sync status from URL (?status=blocked|active)
  useEffect(() => {
    const s = (searchParams.get('status') || '').toLowerCase();
    if (s && s !== query.status) setQuery((q) => ({ ...q, status: s }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onSearch = (e) => {
    setQuery((q) => ({ ...q, search: e.target.value }));
  };

  const onKey = (e) => {
    if (e.key === 'Enter') load({ page: 1, search: e.target.value });
  };

  const doBlock = async (user) => {
    try {
      if (user.isBlocked) {
        await unblockUser(user._id);
        toast.success('User unblocked');
      } else {
        await blockUser(user._id);
        toast.success('User blocked');
      }
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Action failed');
    }
  };

  const doRole = async (user) => {
    const next = user.role === 'admin' ? 'user' : 'admin';
    try {
      await changeUserRole(user._id, next);
      toast.success('Role updated');
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Role update failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2 items-center flex-wrap">
          <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-md border dark:border-gray-700 text-sm">Back</button>
          <input
            type="text"
            placeholder="Search name/email..."
            className="border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 placeholder:dark:text-gray-400 rounded-md px-3 py-2 w-64"
            value={query.search}
            onChange={onSearch}
            onKeyDown={onKey}
          />
          <select
            className="border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md px-2 py-2"
            value={query.role}
            onChange={(e) => setQuery((q) => ({ ...q, role: e.target.value }))}
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md px-2 py-2"
            value={query.status}
            onChange={(e) => setQuery((q) => ({ ...q, status: e.target.value }))}
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Per page</span>
          <select className="border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md px-2 py-1" value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2 hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2 hidden sm:table-cell">Created</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={6}>Loading users...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={6}>No users found</td>
              </tr>
            ) : (
              items.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-2">{u.name || '-'}</td>
                  <td className="px-4 py-2 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => doBlock(u)}
                      className={`px-2 py-1 rounded text-xs ${u.isBlocked ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => doRole(u)}
                      className="px-2 py-1 rounded text-xs bg-indigo-600 text-white"
                    >
                      Make {u.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600 dark:text-gray-300">Total: {total}</div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border dark:border-gray-700 disabled:opacity-50"
          >Prev</button>
          <span>Page {page} / {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="px-3 py-1 rounded border dark:border-gray-700 disabled:opacity-50"
          >Next</button>
        </div>
      </div>
    </div>
  );
}
