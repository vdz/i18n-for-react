import { useState, useEffect } from 'react';
import i18n from 'i18next';
// Listen to i18n own events to change React state accordingly
export const useLanguageSwitcher = () => {
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        const handleLanguageChange = () => {
            setLanguage(i18n.language);
        }
        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);
    return { language };
};