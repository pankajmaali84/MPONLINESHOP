import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext.jsx";

export  function Contact() {
  const { t } = useContext(LanguageContext);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-10 transition-colors">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row transition-colors">
        
        {/* Left Info Section */}
        <div className="bg-gradient-to-b from-blue-700 to-blue-900 text-white md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">{t('get_in_touch')}</h2>
          <p className="mb-6 text-gray-200">
            {t('get_in_touch_desc')}
          </p>
          <ul className="space-y-4 text-lg">
            <li>📞 <span className="font-semibold">{t('phone_label')}:</span> +91 7415938964</li>
            <li>✉️ <span className="font-semibold">{t('email_label')}:</span> pmaali84@gmail.com</li>
            <li>📍 <span className="font-semibold">{t('address_label')}:</span>Amla khategaon dewas Madhya Pradesh </li>
          </ul>
        </div>

        {/* Right Form Section */}
        <div className="p-8 md:w-1/2">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-100">
            {t('contact_form')}
          </h3>
          <form className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">{t('full_name')}</label>
              <input
                type="text"
                placeholder={t('full_name_placeholder')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">{t('email_label')}</label>
              <input
                type="email"
                placeholder={t('email_placeholder')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">{t('phone_label')}</label>
              <input
                type="tel"
                placeholder={t('phone_placeholder')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">{t('message')}</label>
              <textarea
                rows="4"
                placeholder={t('message_placeholder')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
            >
              {t('send_message')}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
