import React, { useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaIdCard, FaMoneyBillWave, FaUniversity, FaMobileAlt, FaFileAlt, FaHome, FaUserCheck, FaLaptopHouse } from "react-icons/fa";
import { LanguageContext } from "../context/LanguageContext.jsx";

export const Services = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const services = [
    {
      icon: <FaIdCard className="text-blue-500 text-4xl" />,
      title: t('service_pan_title'),
      description: t('service_pan_desc'),
      type: 'pan',
    },
    {
      icon: <FaFileAlt className="text-green-500 text-4xl" />,
      title: t('service_income_title'),
      description: t('service_income_desc'),
      type: 'income',
    },
    {
      icon: <FaUserCheck className="text-purple-500 text-4xl" />,
      title: t('service_caste_title'),
      description: t('service_caste_desc'),
    },
    {
      icon: <FaUniversity className="text-orange-500 text-4xl" />,
      title: t('service_domicile_title'),
      description: t('service_domicile_desc'),
    },
    {
      icon: <FaMobileAlt className="text-pink-500 text-4xl" />,
      title: t('service_recharge_title'),
      description: t('service_recharge_desc'),
    },
    {
      icon: <FaMoneyBillWave className="text-teal-500 text-4xl" />,
      title: t('service_bills_title'),
      description: t('service_bills_desc'),
    },
    {
      icon: <FaHome className="text-red-500 text-4xl" />,
      title: t('service_property_title'),
      description: t('service_property_desc'),
    },
    {
      icon: <FaLaptopHouse className="text-indigo-500 text-4xl" />,
      title: t('service_formfill_title'),
      description: t('service_formfill_desc'),
    },
    
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-600 mb-6">
          {t('services_title_full')}
        </h1>
        <p className="text-center max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-12">
          {t('services_intro')}
        </p>

        {/* Services Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 hover:cursor-pointer"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300"
              variants={{
                hidden: { opacity: 0, y: 18, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{service.description}</p>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  toast.success(`${t('apply_started')} ${service.title}`);
                  const state = { serviceTitle: `${service.title} ${t('application_suffix')}` };
                  if (service.type === 'pan') {
                    navigate('/apply?type=pan', { state });
                  } else if (service.type === 'income') {
                    navigate('/apply?type=income', { state });
                  } else {
                    navigate('/service');
                  }
                }}
                className="inline-flex items-center justify-center px-4 py-2 mt-1 w-full rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {t('apply')}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

