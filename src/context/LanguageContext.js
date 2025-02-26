import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('he'); // Default language: Hebrew

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'he' ? 'ar' : 'he'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
