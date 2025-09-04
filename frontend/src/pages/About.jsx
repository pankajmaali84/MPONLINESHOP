import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext.jsx";

export const About = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 pt-24 pb-12 px-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Heading Section */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-600 mb-6">
          {t('about_title')}
        </h1>
        <p className="text-center max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-12">
          {t('about_intro')}
        </p>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=1200&auto=compress&cs=tinysrgb"
              alt="MP Online Shop"
              className="rounded-xl shadow-lg w-full max-w-md"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {t('who_we_are')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('who_we_are_desc')}
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 mb-4">
              <li>{t('list_pan')}</li>
              <li>{t('list_bills')}</li>
              <li>{t('list_forms')}</li>
              <li>{t('list_schemes')}</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              {t('who_we_are_more') || ''}
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 transition-colors">
          <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">
            {t('mission_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            {t('mission_desc')}
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-2">{t('contact_us')}</h3>
          <p className="text-gray-700 dark:text-gray-300">📞 +91 9876543210</p>
          <p className="text-gray-700 dark:text-gray-300">📧 contact@mponlineshop.com</p>
        </div>
      </div>
    </div>
  );
};
