import React, { useEffect, useMemo, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext.jsx";
import { FORM_CONFIGS, getInitialFormState, validateForm } from "../utils/formConfig.js";

const fieldCls =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition";

const labelCls = "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";

const ApplyForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useContext(LanguageContext);
  const prefillTitle = location.state?.serviceTitle || `${t('service_pan_title')} ${t('application_suffix')}`;
  const typeParam = new URLSearchParams(location.search).get('type') || 'pan';
  const isEdit = Boolean(location.state?.edit);
  const editItem = location.state?.editItem;
  const editId = location.state?.id;

  const [loading, setLoading] = useState(false);
  const formConfig = FORM_CONFIGS[typeParam] || FORM_CONFIGS['pan'];
  
  const initialForm = useMemo(() => {
    return getInitialFormState(typeParam, isEdit ? editItem : null);
  }, [typeParam, isEdit, editItem]);
  
  const [form, setForm] = useState(initialForm);
  
  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const disabled = useMemo(() => {
    return !validateForm(typeParam, form);
  }, [form, typeParam]);

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
        ? `${API}${formConfig.apiEndpoint}/${editId}`
        : `${API}${formConfig.apiEndpoint}/apply`;

      const payload = { ...form, serviceTitle: prefillTitle };
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

  // Group fields by section for property form
  const sections = useMemo(() => {
    const grouped = {};
    formConfig.fields.forEach(field => {
      const section = field.section || 'default';
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(field);
    });
    return grouped;
  }, [formConfig]);

  const renderField = (field) => {
    const commonProps = {
      name: field.name,
      value: form[field.name] || '',
      onChange: handleChange,
      className: fieldCls,
      required: field.required,
    };

    if (field.type === 'textarea') {
      return (
        <textarea
          {...commonProps}
          placeholder={field.placeholder}
          rows={field.rows || 3}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select {...commonProps}>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        {...commonProps}
        type={field.type}
        placeholder={field.placeholder}
        pattern={field.pattern}
        minLength={field.minLength}
        maxLength={field.maxLength}
        min={field.min}
        inputMode={field.type === 'tel' || field.type === 'number' ? 'numeric' : undefined}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, y: 24, scale: 0.99 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -24, y: -24, scale: 0.99 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-12 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto">
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
          {Object.keys(sections).length > 1 ? (
            // Render sections for complex forms like property
            Object.entries(sections).map(([sectionName, fields]) => (
              <div key={sectionName} className="mb-6">
                {sectionName !== 'default' && (
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {sectionName}
                  </h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {fields.map((field) => (
                    <div
                      key={field.name}
                      className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
                    >
                      <label className={labelCls}>{field.label}</label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Simple grid for other forms
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {formConfig.fields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
                >
                  <label className={labelCls}>{field.label}</label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}

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
              disabled={loading || disabled}
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
