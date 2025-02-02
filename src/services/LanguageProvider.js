import { createContext, useState, useEffect, useContext } from 'react';
import i18n, { changeLanguage as i18nChangeLanguage } from 'i18next';

const LanguageContext = createContext({
    language: 'en-US',
    setLanguage: () => {}
});

export default function LanguageProvider({children}) {
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        const handleLanguageChange = (lang) => {
          setLanguage(lang);
        };
        i18n.on("languageChanged", handleLanguageChange);
        return () => i18n.off("languageChanged", handleLanguageChange);
      }, []);
    
      const changeLanguage = async (lang) => {
        await i18nChangeLanguage(lang);
        setLanguage(lang);
      };

    return (
        <LanguageContext.Provider value={{language, changeLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
}

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);