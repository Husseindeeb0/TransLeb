import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    if (i18n.language === lng) return;
    
    i18n.changeLanguage(lng);
    
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    
    // If the first part is a language code, replace it
    if (['en', 'ar'].includes(pathParts[0])) {
      pathParts[0] = lng;
    } else {
      pathParts.unshift(lng);
    }
    
    navigate(`/${pathParts.join('/')}${location.search}${location.hash}`);
  };

  return (
    <div className="flex items-center p-1 bg-gray-100/50 backdrop-blur-sm rounded-2xl border border-gray-200">
      <button
        onClick={() => changeLanguage('en')}
        className={`relative px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${
          i18n.language === 'en'
            ? 'text-white'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {i18n.language === 'en' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-gradient-to-br from-red-600 to-green-600 rounded-xl"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
      
      <button
        onClick={() => changeLanguage('ar')}
        className={`relative px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${
          i18n.language === 'ar'
            ? 'text-white'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {i18n.language === 'ar' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-gradient-to-br from-red-600 to-green-600 rounded-xl"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">AR</span>
      </button>
      
      <div className="mx-2 flex items-center justify-center">
        <Globe size={14} className="text-gray-400 animate-pulse" />
      </div>
    </div>
  );
};

export default LanguageSwitcher;
