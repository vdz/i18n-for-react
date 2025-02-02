import { useState, useEffect } from 'react';
import i18n from 'i18next';
export function useLazyTranslation(namespace) {
    const [isLangLoading, setIsLangLoading] = useState(true);
    // create a local translations state to avoid re-fetching the translations for the same language
    const [translations, setTranslations] = useState({});
    const [lang, setLang] = useState(i18n.language);

    useEffect(() => {
        const fetchLocales = async () => {
            setIsLangLoading(true);
            try {
                // if resource was not already loaded and added with a unique namespace, use it
                if (!i18n.hasResourceBundle(i18n.language, namespace)) {
                    // we can impolement the hook logic inside components and use a simpler import:
                    // import('./locales/${i18n.language}/strings.json')
                    // but for the sake of the exercise I use this approach, although it's stiffer, but solvable
                    const resources = await import(`../containers/ResourcesContainer/components/${namespace}/locales/${i18n.language}/strings.json`);   
                    i18n.addResourceBundle(i18n.language, namespace, resources.default);
                }

                setTranslations(i18n.getResourceBundle(i18n.language, namespace) ?? {});
             } catch (error) {
                console.error(`Error loading ${namespace} translations for language ${i18n.language}:`, error);
            } finally {
                setIsLangLoading(false); // Finish loading
            }
        };

        fetchLocales();

        // manage language change notification using i18n to be listened to in other react components
        // can be recoded using i18nextreact.
        i18n.on('languageChanged', handleLanguageChange);
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };

        function handleLanguageChange(lang) {
            setLang(lang);
        }
    }, [namespace, lang]);  // the lang dependency will be responsible for re-fetching the translations for the new language
    
    return {
        t: (key) => translations[key] ?? key, // fallback to key if no translation is found
        isLangLoading
    };
}
    