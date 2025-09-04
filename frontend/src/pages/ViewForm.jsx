import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LanguageContext } from "../context/LanguageContext.jsx";

const ViewAndDeleteForms = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem("token");
      const API = import.meta.env.VITE_API_URL || window.location.origin;
      const res = await axios.get(`${API}/api/pan/myAllPan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForms(res.data?.forms || []);
    } catch (err) {
      console.error("Error fetching forms", err);
      setForms([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const API = import.meta.env.VITE_API_URL || window.location.origin;
      await axios.delete(`${API}/api/pan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(t('delete_success'));
      fetchForms(); // Refresh list
    } catch (err) {
      toast.error(t('delete_failed'));
    }
  };

  const handleUpdate = (id) => {
    localStorage.setItem("updateFormId", id);
    navigate("/PanCardForm");
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t('my_pan_forms')}</h2>
      {forms.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">{t('no_pan_forms')}</p>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => (
            <li
              key={form._id}
              className="p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 w-[300px] rounded shadow flex flex-col gap-2 transition-colors"
            >
              <div>
                <p className="text-gray-900 dark:text-gray-100"><strong>{t('name_label_text')}:</strong> {form.name}</p>
                <p className="text-gray-900 dark:text-gray-100"><strong>{t('mobile_label_text')}:</strong> {form.contactNumber}</p>
                <p className="text-gray-900 dark:text-gray-100"><strong>{t('dob_label_text')}:</strong> {form.dob}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(form._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  {t('delete')}
                </button>
                <button
                  onClick={() => handleUpdate(form._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  {t('update')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewAndDeleteForms;
