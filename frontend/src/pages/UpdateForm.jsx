import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext.jsx";

const PanList = ({ forms }) => {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const handleUpdateClick = (formData) => {
    navigate("/PanCardForm", { state: { isUpdate: true, formData } });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 transition-colors">
      {forms.map((form) => (
        <div key={form._id} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 m-2 rounded shadow transition-colors">
          <p className="text-gray-900 dark:text-gray-100">{form.name}</p>
          <button
            onClick={() => handleUpdateClick(form)}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
          >
            {t('update')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PanList;
