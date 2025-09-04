import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getForms, getFormById, sendAdminNotification, updateFormStatus } from '../../services/adminApi';
import toast from 'react-hot-toast';

export default function Orders() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [payOpen, setPayOpen] = useState(false);
  const [payFor, setPayFor] = useState(null); // selected form
  const [feeInput, setFeeInput] = useState('');
  const [payStatus, setPayStatus] = useState('received'); // 'received' | 'pending'
  const [didAutoOpen, setDidAutoOpen] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getForms();
      setForms(res.forms || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const openPayModal = (form) => {
    setPayFor(form);
    setFeeInput(String(form.feeAmount || ''));
    setPayStatus(form.paymentStatus === 'pending' ? 'pending' : 'received');
    setPayOpen(true);
  };

  const handleSuccessWithStatus = async (statusValue) => {
    if (!payFor) return;
    const fee = Number(String(feeInput || '0').trim());
    if (Number.isNaN(fee) || fee < 0) {
      toast.error('Invalid amount');
      return;
    }
    try {
      await updateFormStatus(payFor._id, 'success', { feeAmount: fee, paymentStatus: statusValue });
      toast.success('Marked as success');
      const payLine = statusValue === 'received' ? `Payment received: ₹${fee}` : `Payment pending: ₹${fee}`;
      const msg = `Your ${payFor.service} is completed successfully. ${payLine}. Thank you!`;
      const url = whatsappUrl(payFor.contactNumber, msg);
      window.open(url, '_blank');
      setPayOpen(false);
      setPayFor(null);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleUpdateOnly = async () => {
    if (!payFor) return;
    const fee = Number(String(feeInput || '0').trim());
    if (Number.isNaN(fee) || fee < 0) {
      toast.error('Invalid amount');
      return;
    }
    try {
      // Do not change status; reuse current status
      await updateFormStatus(payFor._id, payFor.status || 'submitted', { feeAmount: fee, paymentStatus: payStatus });
      toast.success('Payment info updated');
      setPayOpen(false);
      setPayFor(null);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update payment');
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Sync status from query param (?status=success|pending|approved|rejected)
  useEffect(() => {
    const s = (searchParams.get('status') || '').toLowerCase();
    setStatus(s);
  }, [searchParams]);

  // Sync search text from query param (?q=...)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q && q !== search) setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (forms || []).filter((f) => {
      const okQ = !q ||
        f.service?.toLowerCase().includes(q) ||
        f.applicantName?.toLowerCase().includes(q) ||
        f.user?.email?.toLowerCase().includes(q);
      const okStatus = !status || (f.status || '').toLowerCase().includes(status.toLowerCase());
      return okQ && okStatus;
    });
  }, [forms, search, status]);

  // Auto-open first filtered order if openFirst=1
  useEffect(() => {
    const openFirst = searchParams.get('openFirst') === '1';
    if (!loading && openFirst && !didAutoOpen && filtered.length > 0) {
      openDetail(filtered[0]._id);
      setDidAutoOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, filtered, searchParams]);

  const whatsappUrl = (phone, msg) => {
    const p = String(phone || '').replace(/[^0-9]/g, '');
    const base = p ? `https://wa.me/${p}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(msg)}`;
  };

  const sendEmailQuick = async (form, type) => {
    try {
      await sendAdminNotification(form._id, type);
      toast.success('Email sent');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to send email');
    }
  };

  const openDetail = async (id) => {
    try {
      setDetailOpen(true);
      setDetailLoading(true);
      const res = await getFormById(id);
      setDetail(res.form);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load details');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-md border dark:border-gray-700 text-sm"
          >Back</button>
          <input
            type="text"
            placeholder="Search name/email/service..."
            className="border dark:border-gray-700 dark:bg-gray-800 rounded-md px-3 py-2 w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border dark:border-gray-700 dark:bg-gray-800 rounded-md px-2 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="success">Success</option>
          </select>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Total: {filtered.length}</div>
      </div>

      <div className="bg-white dark:bg-gray-900 border rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-2">Service</th>
              <th className="text-left px-4 py-2">Applicant</th>
              <th className="text-left px-4 py-2 hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-2">Phone</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2 hidden sm:table-cell">Created</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-gray-500" colSpan={7}>Loading orders...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-4 py-6 text-gray-500" colSpan={7}>No orders found</td></tr>
            ) : (
              filtered.map((f) => (
                <tr key={f._id} className="border-t">
                  <td className="px-4 py-2">{f.service}</td>
                  <td className="px-4 py-2">{f.applicantName || '-'}</td>
                  <td className="px-4 py-2 hidden sm:table-cell">{f.user?.email || '-'}</td>
                  <td className="px-4 py-2">{f.contactNumber || '-'}</td>
                  <td className="px-4 py-2">
                    {(() => {
                      const s = String(f.status || '').toLowerCase();
                      let cls = 'bg-gray-100 text-gray-700';
                      if (s.includes('pending')) cls = 'bg-amber-100 text-amber-700';
                      if (s.includes('approved')) cls = 'bg-blue-100 text-blue-700';
                      if (s.includes('rejected')) cls = 'bg-red-100 text-red-700';
                      if (s.includes('success') || s.includes('completed') || s.includes('done')) cls = 'bg-emerald-100 text-emerald-700';
                      return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{f.status || '-'}</span>;
                    })()}
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">{new Date(f.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex flex-wrap gap-2">
                    <button
                      className="px-2 py-1 rounded text-xs bg-gray-700 text-white"
                      onClick={() => openDetail(f._id)}
                    >View</button>
                    {/* WhatsApp quick messages */}
                    <a
                      className="px-2 py-1 rounded text-xs bg-emerald-600 text-white"
                      href={whatsappUrl(f.contactNumber, `Thanks for applying for ${f.service}.`)}
                      target="_blank" rel="noreferrer"
                    >WhatsApp Thanks</a>
                    <a
                      className="px-2 py-1 rounded text-xs bg-blue-600 text-white"
                      href={whatsappUrl(f.contactNumber, `Your ${f.service} will be completed by tomorrow.`)}
                      target="_blank" rel="noreferrer"
                    >WhatsApp Tomorrow</a>
                    <a
                      className="px-2 py-1 rounded text-xs bg-amber-600 text-white"
                      href={whatsappUrl(f.contactNumber, `Your ${f.service} will be completed within 1 to 3 days.`)}
                      target="_blank" rel="noreferrer"
                    >WhatsApp 1-3 days</a>

                    {/* Mark Success */}
                    <button
                      onClick={() => openPayModal(f)}
                      className="px-2 py-1 rounded text-xs bg-green-600 text-white"
                    >Mark Success</button>

                    {/* Email quick actions using backend */}
                    <button onClick={() => sendEmailQuick(f, 'tomorrow')} className="px-2 py-1 rounded text-xs bg-indigo-600 text-white">Email Tomorrow</button>
                    <button onClick={() => sendEmailQuick(f, 'delay')} className="px-2 py-1 rounded text-xs bg-orange-600 text-white">Email 1-3 days</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal for Mark Success */}
      {payOpen && payFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPayOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 border rounded-lg w-full max-w-md mx-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Mark Success & Payment</div>
              <button onClick={() => setPayOpen(false)} className="px-2 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800">Cancel</button>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-300">{payFor.service} — {payFor.applicantName || '-'}</div>
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">Fees (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="flex-1 border dark:border-gray-700 dark:bg-gray-800 rounded px-3 py-2"
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm w-32">Payment</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPayStatus('received')}
                    className={`px-3 py-2 rounded border text-sm ${payStatus === 'received' ? 'bg-emerald-600 text-white' : 'bg-transparent'}`}
                  >Received</button>
                  <button
                    type="button"
                    onClick={() => setPayStatus('pending')}
                    className={`px-3 py-2 rounded border text-sm ${payStatus === 'pending' ? 'bg-amber-600 text-white' : 'bg-transparent'}`}
                  >Pending</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button className="px-3 py-2 rounded bg-emerald-600 text-white text-sm" onClick={() => handleSuccessWithStatus('received')}>Success</button>
                <button className="px-3 py-2 rounded bg-amber-600 text-white text-sm" onClick={() => handleSuccessWithStatus('pending')}>Pending</button>
                <button className="px-3 py-2 rounded bg-blue-600 text-white text-sm" onClick={handleUpdateOnly}>Update</button>
                <button className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 text-sm" onClick={() => setPayOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetailOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 border rounded-lg w-full max-w-2xl mx-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">Order Details</div>
              <button onClick={() => setDetailOpen(false)} className="px-2 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800">Close</button>
            </div>
            {detailLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : !detail ? (
              <div className="text-red-600">No details found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Service:</span> {detail.service}</div>
                <div><span className="text-gray-500">Status:</span> {detail.status}</div>
                <div><span className="text-gray-500">Applicant:</span> {detail.name}</div>
                <div><span className="text-gray-500">Parent Name:</span> {detail.parentName}</div>
                {detail.motherName && <div><span className="text-gray-500">Mother Name:</span> {detail.motherName}</div>}
                {detail.gender && <div><span className="text-gray-500">Gender:</span> {detail.gender}</div>}
                {detail.dob && <div><span className="text-gray-500">DOB:</span> {detail.dob}</div>}
                {detail.incomeAmount !== undefined && <div><span className="text-gray-500">Income Amount:</span> ₹{detail.incomeAmount}</div>}
                {detail.samagraId && <div><span className="text-gray-500">Samagra ID:</span> {detail.samagraId}</div>}
                <div><span className="text-gray-500">Aadhar:</span> {detail.aadhar}</div>
                <div><span className="text-gray-500">Email:</span> {detail.user?.email || detail.email}</div>
                <div><span className="text-gray-500">Phone:</span> {detail.contactNumber || '-'}</div>
                <div className="sm:col-span-2"><span className="text-gray-500">Address:</span> {detail.address}</div>
                <div className="sm:col-span-2"><span className="text-gray-500">Created:</span> {new Date(detail.createdAt).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
