import React, { useEffect, useMemo, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext.jsx";

const fieldCls =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition";

const labelCls = "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";

const ApplyForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useContext(LanguageContext);
  const prefillTitle = location.state?.serviceTitle || `${t('service_pan_title')} ${t('application_suffix')}`;
  const typeParam = new URLSearchParams(location.search).get('type');
  const isIncome = useMemo(() => {
    if (typeParam === 'income') return true;
    if (typeParam === 'pan') return false;
    return /income certificate/i.test(prefillTitle);
  }, [typeParam, prefillTitle]);
  const isEdit = Boolean(location.state?.edit);
  const editItem = location.state?.editItem;
  const editId = location.state?.id;

  const [loading, setLoading] = useState(false);
  const initialForm = useMemo(() => {
    const defaults = {
      name: "",
      parentName: "",
      dob: "",
      gender: "Male",
      aadhar: "",
      contactNumber: "",
      email: "",
      address: "",
      motherName: "",
      incomeAmount: "",
      samagraId: "",
    };
    if (!isEdit || !editItem) return defaults;
    if (isIncome) {
      return {
        ...defaults,
        name: editItem.name || "",
        parentName: editItem.parentName || "",
        incomeAmount: editItem.incomeAmount ?? "",
        aadhar: editItem.aadhar || "",
        contactNumber: editItem.contactNumber || "",
        samagraId: editItem.samagraId || "",
      };
    }
    // PAN
    return {
      ...defaults,
      name: editItem.name || "",
      parentName: editItem.parentName || "",
      motherName: editItem.motherName || "",
      dob: editItem.dob || "",
      gender: editItem.gender || "Male",
      contactNumber: editItem.contactNumber || "",
      email: editItem.email || "",
      aadhar: editItem.aadhar || "",
      address: editItem.address || "",
    };
  }, [isEdit, editItem, isIncome]);
  const [form, setForm] = useState(initialForm);
  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const disabled = useMemo(() => {
    if (isIncome) {
      const incomeOk = Number(form.incomeAmount) >= 35000;
      const samagraOk = /^[0-9]{8,9}$/.test(String(form.samagraId));
      return (
        !form.name ||
        !form.parentName ||
        !incomeOk ||
        !form.aadhar ||
        !form.contactNumber ||
        !samagraOk
      );
    }
    return (
      !form.name ||
      !form.parentName ||
      !form.dob ||
      !form.gender ||
      !form.aadhar ||
      !form.contactNumber ||
      !form.email ||
      !form.address
    );
  }, [form, isIncome]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) {
      toast.error(t('please_fill_fields'));
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const API = import.meta.env.VITE_API_URL || window.location.origin;
      const url = isEdit
        ? (isIncome ? `${API}/api/income/${editId}` : `${API}/api/pan/${editId}`)
        : (isIncome ? `${API}/api/income/apply` : `${API}/api/pan/apply`);

      const payload = isIncome
        ? {
            name: form.name,
            parentName: form.parentName,
            incomeAmount: Number(form.incomeAmount),
            aadhar: form.aadhar,
            contactNumber: form.contactNumber,
            samagraId: form.samagraId,
            serviceTitle: prefillTitle,
          }
        : {
            name: form.name,
            parentName: form.parentName, // father name (required by backend as parentName)
            motherName: form.motherName,
            dob: form.dob,
            gender: form.gender,
            contactNumber: form.contactNumber,
            email: form.email,
            aadhar: form.aadhar,
            address: form.address,
            serviceTitle: prefillTitle,
          };

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = isEdit
        ? await axios.put(url, payload, config)
        : await axios.post(url, payload, config);
      toast.success(res.data?.message || (isEdit ? 'Updated' : t('submit_application')));
      navigate(isEdit ? "/profile/requested-services" : "/service");
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, y: 24, scale: 0.99 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -24, y: -24, scale: 0.99 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-12 px-4 sm:px-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {prefillTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t('applyform_fill_details')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-white/5 p-4 sm:p-6 lg:p-8"
        >
          {/* Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={labelCls}>{t('full_name')}</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('full_name_placeholder')}
                className={fieldCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>{t('fathers_name')}</label>
              <input
                name="parentName"
                value={form.parentName}
                onChange={handleChange}
                placeholder={t('fathers_name_placeholder')}
                className={fieldCls}
                required
              />
            </div>

            {!isIncome && (
              <div>
                <label className={labelCls}>{t('mothers_name')}</label>
                <input
                  name="motherName"
                  value={form.motherName}
                  onChange={handleChange}
                  placeholder={t('mothers_name_placeholder')}
                  className={fieldCls}
                />
              </div>
            )}

            {!isIncome && (
              <div>
                <label className={labelCls}>{t('dob')}</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className={fieldCls}
                  required
                />
              </div>
            )}

            {!isIncome && (
              <div>
                <label className={labelCls}>{t('gender')}</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={fieldCls}
                  required
                >
                  <option>{t('male')}</option>
                  <option>{t('female')}</option>
                  <option>{t('other')}</option>
                </select>
              </div>
            )}

            {isIncome && (
              <div>
                <label className={labelCls}>{t('income_amount')}</label>
                <input
                  type="number"
                  name="incomeAmount"
                  value={form.incomeAmount}
                  onChange={handleChange}
                  placeholder={t('income_placeholder')}
                  className={fieldCls}
                  min={35000}
                  required
                />
              </div>
            )}

            <div>
              <label className={labelCls}>{t('aadhar_number')}</label>
              <input
                name="aadhar"
                value={form.aadhar}
                onChange={handleChange}
                placeholder={t('aadhar_placeholder')}
                className={fieldCls}
                inputMode="numeric"
                pattern="^[0-9]{12}$"
                maxLength={12}
                required
              />
            </div>

            <div>
              <label className={labelCls}>{t('mobile_number')}</label>
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder={t('mobile_placeholder')}
                className={fieldCls}
                inputMode="numeric"
                pattern="^[0-9]{10}$"
                maxLength={10}
                required
              />
            </div>

            {!isIncome && (
              <div>
                <label className={labelCls}>{t('email_label')}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t('email_placeholder')}
                  className={fieldCls}
                  required
                />
              </div>
            )}

            {!isIncome && (
              <div className="sm:col-span-2">
                <label className={labelCls}>{t('address_label')}</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder={t('address_placeholder')}
                  rows={3}
                  className={fieldCls}
                  required
                />
              </div>
            )}

            {isIncome && (
              <div>
                <label className={labelCls}>{t('samagra_id_label')}</label>
                <input
                  name="samagraId"
                  value={form.samagraId}
                  onChange={handleChange}
                  placeholder={t('samagra_id_placeholder')}
                  className={fieldCls}
                  inputMode="numeric"
                  pattern="^[0-9]{8,9}$"
                  minLength={8}
                  maxLength={9}
                  required
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
            >
              {t('cancel')}
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: disabled ? 1 : 1.03 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`px-5 py-2.5 rounded-lg font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 ${
                disabled || loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
              }`}
            >
              {loading ? (isEdit ? 'Updating...' : t('submitting')) : (isEdit ? 'Update' : t('submit_application'))}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ApplyForm;
